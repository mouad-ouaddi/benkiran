<?php

use App\Http\Controllers\AbonnementController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Handle preflight OPTIONS requests for login
Route::options('/login', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Accept');
});

// Authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/me', [AuthController::class, 'me']);

// Dashboard routes
Route::get('/dashboard/statistics', [DashboardController::class, 'getStatistics']);
Route::get('/dashboard/detailed-stats', [DashboardController::class, 'getDetailedStats']);

// User management routes
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Abonnement management routes
Route::get('/abonnements', [AbonnementController::class, 'index']);
Route::post('/abonnements', [AbonnementController::class, 'store']);
Route::get('/abonnements/{id}', [AbonnementController::class, 'show']);
Route::put('/abonnements/{id}', [AbonnementController::class, 'update']);
Route::delete('/abonnements/{id}', [AbonnementController::class, 'destroy']);
