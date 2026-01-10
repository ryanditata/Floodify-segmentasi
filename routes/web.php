<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FloodHistoryController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', [UserController::class, 'index'])->name('home');

// Authenticated routes
Route::middleware(['auth'])->group(function () {
    Route::post('/detect', [UserController::class, 'detect'])->name('flood.detect');
    
    // Dashboard routes
    Route::prefix('dashboard')->group(function () {
        Route::get('/flood-history', [FloodHistoryController::class, 'index'])->name('dashboard.flood-history');
        Route::get('/flood-history/{id}', [FloodHistoryController::class, 'show'])->name('dashboard.flood-detail');
    });
});

// Admin routes
Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
});

Route::middleware(['auth', 'verified'])->get('/dashboard', [DashboardController::class, 'index'])
    ->name('dashboard');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
