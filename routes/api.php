<?php

use App\Http\Controllers\TrainController;
use App\Http\Controllers\TrainDataCollectorController;
use Illuminate\Support\Facades\Route;


Route::get("/map-key", function () {
    return response()->json([
        'apiKey' => env('GOOGLE_MAPS_API_KEY'),
    ]);
})->name('map.key');

Route::post("/train-location-data", [TrainDataCollectorController::class, "updateLocations"]);

Route::get("/trains/nearby", [TrainController::class, "findNearby"])->name('trains.nearby');
