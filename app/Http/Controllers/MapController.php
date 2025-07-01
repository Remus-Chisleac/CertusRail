<?php

namespace App\Http\Controllers;

use App\Models\Train;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index()
    {
        $trains = Train::get();
        return Inertia::render('map/RailMap', ['trains' => $trains, 'apiKey' => env('GOOGLE_MAPS_API_KEY')]);
    }
}
