<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::post('/users_create', [UserController::class, 'store']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
});


Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');



Route::get('/project', [ProjectController::class, 'index']);
Route::get('/project/{id}', [ProjectController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/project', [ProjectController::class, 'store']);
    Route::post('/project/{id}', action: [ProjectController::class, 'update']);
    Route::delete('/project/{id}', action: [ProjectController::class, 'destroy']);
});

Route::get('/tag', [TagController::class, 'index']);
Route::get('/tag/{id}', [TagController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/tag', [TagController::class, 'store']);
    Route::post('/tag/{id}', [TagController::class, 'update']);
    Route::delete('/tag/{id}', [TagController::class, 'destroy']);
});


Route::get('/blog', [BlogController::class, 'index']);
Route::get('/blog/{id}', [BlogController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/blog/upload-image', [BlogController::class, 'uploadImage']);
    Route::post('/blog', [BlogController::class, 'store']);
    Route::post('/blog/{id}', [BlogController::class, 'update']);
    Route::delete('/blog/{id}', [BlogController::class, 'destroy']);

});