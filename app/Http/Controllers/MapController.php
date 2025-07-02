<?php

namespace App\Http\Controllers;

use App\Models\Train;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index()
    {
        $trains = Train::query()
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get(['id', 'name', 'latitude', 'longitude']);
        return Inertia::render('map/RailMap', [
            'trains' => $trains,
            'apiKey' => env('GOOGLE_MAPS_API_KEY')
        ]);
    }
}
