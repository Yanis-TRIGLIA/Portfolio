<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// Catch-all : sert l'index.html du frontend pour le routing React (SPA)
Route::get('/{any}', function () {
    return response()->file(public_path('index.html'));
})->where('any', '.*');
