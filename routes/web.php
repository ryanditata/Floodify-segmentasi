<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CafeController;
use App\Http\Controllers\CustomerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [CustomerController::class, 'index'])->name('home');

Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
});

Route::middleware(['auth', 'verified'])->get('/dashboard', [DashboardController::class, 'index'])
    ->name('dashboard');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
