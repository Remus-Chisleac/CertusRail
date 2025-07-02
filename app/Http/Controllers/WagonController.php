<?php

namespace App\Http\Controllers;

use App\Models\Wagon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class WagonController extends Controller
{
    public function index()
    {
        $wagons = Wagon::orderBy('code')->get();
        return Inertia::render('wagons/index', ['wagons' => $wagons]);
    }

    public function create()
    {
        return Inertia::render('wagons/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code'         => 'required|string|unique:wagons,code|max:255',
            'type'         => 'required|string|max:255',
            'capacity'     => 'required|numeric|min:1',
        ]);

        Wagon::create($data);

        return redirect()->route('wagons.index');
    }

    public function show(string $wagon)
    {
        $wagonObj = Wagon::findOrFail(id: $wagon);
        if (!$wagonObj) {
            return redirect()->route('wagons.index')->with('error', 'Wagon not found.');
        }
        return Inertia::render('wagons/show', ['wagon' => $wagonObj]);
    }

    public function edit(Wagon $wagon)
    {
        return Inertia::render('wagons/edit', compact('wagon'));
    }

    public function update(Request $request, Wagon $wagon)
    {
        $data = $request->validate( [
            'code'         => 'required|string|unique:wagons,code,' . $wagon->id . '|max:255',
            'type'         => 'required|string|max:255',
            'capacity'     => 'required|numeric|min:1',
        ]);

        $wagon->update($data);

        return redirect()->route('wagons.show', $wagon);
    }

    public function destroy(Wagon $wagon)
    {
        $wagon->delete();
        return redirect()->route('wagons.index');
    }
}
