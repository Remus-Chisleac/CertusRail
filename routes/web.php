<?php

use App\Http\Controllers\LocomotiveController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\TrainController;
use App\Http\Controllers\WagonController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('/rolling-stock/locomotives', LocomotiveController::class);
    Route::resource('/rolling-stock/wagons', WagonController::class);
    Route::resource('/trains', TrainController::class);

    Route::get('/map', [MapController::class, 'index'])->name('map.index');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
