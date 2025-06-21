<?php

use App\Http\Controllers\AbonnementController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PlanningController;
use App\Http\Controllers\CoursController;
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

// Planning management routes
Route::get('/planning/weekly', [PlanningController::class, 'getWeeklyPlanning']);
Route::get('/planning/courses/available', [PlanningController::class, 'getAvailableCourses']);
Route::post('/planning', [PlanningController::class, 'store']);
Route::put('/planning/{id}', [PlanningController::class, 'update']);
Route::delete('/planning/{id}', [PlanningController::class, 'destroy']);
Route::post('/planning/weekly-template', [PlanningController::class, 'createWeeklyTemplate']);
Route::post('/planning/{planningId}/assign-course', [PlanningController::class, 'assignCourse']);

// Course management routes
Route::get('/courses', [CoursController::class, 'index']);
Route::post('/courses', [CoursController::class, 'store']);
Route::get('/courses/{id}', [CoursController::class, 'show']);
Route::put('/courses/{id}', [CoursController::class, 'update']);
Route::delete('/courses/{id}', [CoursController::class, 'destroy']);
Route::get('/courses/coaches/available', [CoursController::class, 'getAvailableCoaches']);
