<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::post('/users_create', [UserController::class, 'store']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/project', [ProjectController::class, 'store']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/tag', [TagController::class, 'store']);
});