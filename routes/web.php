<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FloodHistoryController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [UserController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::post('/detect', [UserController::class, 'detect'])->name('flood.detect');

    Route::prefix('dashboard')->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard.dashboard');
        
        Route::get('/flood-history', [FloodHistoryController::class, 'index'])
            ->name('dashboard.flood-history');
            
        Route::get('/flood-history/{id}', [FloodHistoryController::class, 'show'])
            ->name('dashboard.flood-detail');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';