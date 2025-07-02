<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTrainRequest;
use App\Models\Locomotive;
use App\Models\Train;
use App\Models\Wagon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class TrainController extends Controller
{
    public function index()
    {
        // Use withCount to efficiently get the number of associated
        // locomotives and wagons for each train. Eloquent automatically
        // adds `locomotives_count` and `wagons_count` attributes
        // to each train model.
        $trains = Train::withCount(['locomotives', 'wagons'])->latest()->get();

        // Pass the collection of trains to your Inertia view.
        return Inertia::render('trains/index', [
            'trains' => $trains,
        ]);
    }

    public function create()
    {
        return Inertia::render('trains/create',
            ['locomotives' => Locomotive::all(),
                'wagons' => Wagon::all()
            ]
        );
    }

    public function store(StoreTrainRequest $request)
    {
        // Get the validated data from the form request
        $validated = $request->validated();

        Log::info($validated);

        try {
            // Wrap everything in a database transaction.
            // If any part fails, all changes will be rolled back.
            DB::transaction(function () use ($validated) {

                // 1. Create the main Train record
                $train = Train::create([
                    'name' => $validated['name'],
                    'latitude' => $validated['latitude'] ?? null,
                    'longitude' => $validated['longitude'] ?? null,
                ]);

                // 2. Process and create Power Train sections
                if (!empty($validated['power_trains'])) {
                    foreach ($validated['power_trains'] as $powerTrainData) {
                        // Create the section linked to the train
                        $powerTrainSection = $train->powerTrains()->create([
                            'name' => $powerTrainData['name'],
                        ]);

                        // Attach the locomotives to this section via the pivot table
                        $locomotiveIds = array_column($powerTrainData['locomotives'], 'id');
                        $powerTrainSection->locomotives()->attach($locomotiveIds);
                    }
                }


                // 3. Process and create Wagon sections
                if (!empty($validated['train_sections'])) {
                    foreach ($validated['train_sections'] as $trainSectionData) {
                        // Create the section linked to the train
                        $wagonSection = $train->trainSections()->create([
                            'name' => $trainSectionData['name'],
                        ]);

                        // Attach the wagons to this section via the pivot table
                        $wagonIds = array_column($trainSectionData['wagons'], 'id');
                        $wagonSection->wagons()->attach($wagonIds);
                    }
                }
            });
        } catch (\Exception $e) {
            Log::error('Train creation failed: ' . $e->getMessage());
            // If the transaction fails, redirect back with an error
            // You should also log the error for debugging
            // Log::error('Train creation failed: ' . $e->getMessage());
            return Redirect::back()->with('error', 'There was an error creating the train. Please try again.');
        }

        // If the transaction is successful, redirect to the index page
        return Redirect::route('trains.index')->with('success', 'Train created successfully!');
    }

    public function show(string $train)
    {

        $trainObj = Train::find($train)->load([
            'powerTrains.locomotives',
            'trainSections.wagons',
        ]);

        return Inertia::render('trains/show', [
            'train' => $trainObj,
        ]);
    }

    public function edit(Train $train)
    {
        // Load the train with its related locomotives and wagons
        $train->load(['powerTrains', 'trainSections']);

        // Pass the train data to the Inertia view
        return Inertia::render('trains/edit', [
            'train' => $train,
            'locomotives' => Locomotive::all(),
            'wagons' => Wagon::all(),
        ]);
    }


    public function destroy(Train $train)
    {
        // Use a transaction to ensure that all related records are deleted
        DB::transaction(function () use ($train) {
            // Delete all power trains and their locomotives
            $train->powerTrains()->each(function ($powerTrain) {
                $powerTrain->locomotives()->detach();
                $powerTrain->delete();
            });

            // Delete all train sections and their wagons
            $train->trainSections()->each(function ($section) {
                $section->wagons()->detach();
                $section->delete();
            });

            // Finally, delete the train itself
            $train->delete();
        });

        return Redirect::route('trains.index')->with('success', 'Train deleted successfully.');
    }

    public function findNearby(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $latitude = $request->input('latitude');
        $longitude = $request->input('longitude');
        $radius = 1;

        //? Haversine formula
        $closestTrains = Train::select('trains.*')
            ->selectRaw(
                '( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) AS distance',
                [$latitude, $longitude, $latitude]
            )
            ->whereNotNull(['latitude', 'longitude'])
            ->having('distance', '<=', $radius)
            ->orderBy('distance', 'asc')
            ->get();

        if ($closestTrains) {
            foreach ($closestTrains as $train) {
                $train->distance = round($train->distance, 2);
            }

            return response()->json($closestTrains);
        }

        return response()->json(['message' => 'No trains found within the specified radius.'], 404);
    }
}
