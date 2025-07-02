<?php

namespace App\Console\Commands;

use App\Models\Train;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\Console\Command\Command as CommandAlias;

class UpdateTrainLocation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * We define a required 'train' argument to specify which train to move.
     * @var string
     */
    protected $signature = 'train:move {train : The ID of the train to move}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Simulates a train moving by updating its coordinates 5 times in one second';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        try {
            // Find the train by the ID provided in the command argument.
            $train = Train::findOrFail($this->argument('train'));
        } catch (ModelNotFoundException $e) {
            // If the train doesn't exist, show an error and exit.
            $this->error("Train with ID {$this->argument('train')} not found.");
            return CommandAlias::FAILURE;
        }

        $this->info("Starting to move Train ID: {$train->id} (Name: {$train->name})");
        $this->line("Initial coordinates: Lat: {$train->latitude}, Lng: {$train->longitude}");

        // Loop 5 times to update the coordinates.
        for ($i = 0; $i < 5; $i++) {
            // Increment latitude and longitude by a small amount.
            // 0.0001 degrees is roughly 11 meters.
            $train->latitude -= 0.0001;
            $train->longitude -= 0.0001;

            // Save the new coordinates to the database.
            $train->save();

            // Output the new coordinates to the console.
            $this->line("Update ".($i + 1)."/5 -> New Coords: Lat: {$train->latitude}, Lng: {$train->longitude}");

            // Wait for 200,000 microseconds (0.2 seconds) to achieve 5 updates per second.
            sleep(2);
        }

        $this->info("Finished moving train {$train->id}.");

        return CommandAlias::SUCCESS;
    }
}
