<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;
use Illuminate\Support\Facades\Log;
use App\Models\Contact;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        Log::info('Début du traitement du formulaire de contact', ['ip' => $request->ip()]);

        // Validation des données
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'captcha' => 'required|string'
        ]);

        if ($validator->fails()) {
            Log::error('Validation échouée', ['errors' => $validator->errors()]);
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        Log::debug('Données validées', $request->all());

        // Vérification du CAPTCHA
        Log::debug('Vérification du CAPTCHA');
        $response = Http::withOptions([
            'verify' => app()->isProduction()
        ])->asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => env('RECAPTCHA_SECRET_KEY'),
            'response' => $request->captcha
        ]);

        $responseData = $response->json();
        Log::debug('Réponse CAPTCHA', $responseData);

        if (!$responseData['success']) {
            Log::error('CAPTCHA invalide', ['response' => $responseData]);
            return response()->json([
                'success' => false,
                'message' => 'CAPTCHA invalide'
            ], 422);
        }

        // Envoi de l'email
        try {
            Log::debug('Tentative d\'envoi d\'email', [
                'to' => env('MAIL_TO_ADDRESS'),
                'from' => env('MAIL_FROM_ADDRESS')
            ]);

            Mail::to(env('MAIL_TO_ADDRESS'))->send(new ContactFormMail($request->all()));

            // Sauvegarde en base de données
            Contact::create([
                'first_name' => $request->firstName,
                'last_name'  => $request->lastName,
                'email'      => $request->email,
                'phone'      => $request->phone,
                'subject'    => $request->subject,
                'message'    => $request->message,
            ]);
            
            Log::info('Email envoyé avec succès');
            
            return response()->json([
                'success' => true,
                'message' => 'Message envoyé avec succès!'
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'envoi d\'email', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi du message: ' . $e->getMessage()
            ], 500);
        }
    }
}