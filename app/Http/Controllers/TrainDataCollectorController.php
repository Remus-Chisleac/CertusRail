<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Train;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TrainDataCollectorController extends Controller
{
    /**
     * Handle a batch update of train locations.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updateLocations(Request $request): JsonResponse
    {
        // Define the validation rules for the incoming data.
        // We expect a main 'updates' key which is an array.
        // Each item in the array must also be an array with exactly 3 elements.
        $validator = Validator::make($request->all(), [
            'updates' => 'required|array',
            'updates.*' => 'required|array|size:3',
            'updates.*.0' => 'required|integer|exists:trains,id', // train_id
            'updates.*.1' => 'required|numeric|between:-90,90',   // latitude
            'updates.*.2' => 'required|numeric|between:-180,180', // longitude
        ]);

        // If validation fails, return a 422 Unprocessable Entity response with errors.
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $updates = $request->input('updates');

        // Use a database transaction to ensure that either all updates succeed or none do.
        // This maintains data integrity.
        try {
            DB::transaction(function () use ($updates) {
                foreach ($updates as $update) {
                    Train::where('id', $update[0])->update([
                        'latitude' => $update[1],
                        'longitude' => $update[2],
                    ]);
                }
            });
        } catch (\Exception $e) {
            // If anything goes wrong during the transaction, return a server error.
            report($e);
            return response()->json(['message' => 'An error occurred while updating locations.'], 500);
        }

        return response()->json(['message' => 'Train locations updated successfully.']);
    }
}
