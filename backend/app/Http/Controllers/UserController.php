<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        Log::info('Requête de création d\'utilisateur reçue : ', $request->all());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'photo_profil' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        Log::info('Validation réussie pour la création de l\'utilisateur : ', $validated);

        $validated['password'] = Hash::make($validated['password']);

        if ($request->hasFile('photo_profil')) {
            $image = $request->file('photo_profil');
            $filename = 'profile_photos/' . uniqid() . '.' . $image->getClientOriginalExtension();

            $image->move(public_path('storage/profile_photos'), $filename);

            $validated['photo_profil'] = 'storage/' . $filename;
        }

        $user = User::create($validated);

        Log::info('Utilisateur créé avec succès : ', $user->toArray());
        return response()->json($user, 201);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

   
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->photo_profil && file_exists(public_path($user->photo_profil))) {
            unlink(public_path($user->photo_profil));
        }

        $user->delete();

        Log::info('Utilisateur supprimé avec succès : ', ['id' => $id]);
        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }
}
