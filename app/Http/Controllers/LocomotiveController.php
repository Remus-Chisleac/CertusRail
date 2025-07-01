<?php

namespace App\Http\Controllers;

use App\Models\Locomotive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LocomotiveController extends Controller
{
    public function index()
    {
        $locomotives = Locomotive::orderBy('code')->get();
        return Inertia::render('locomotives/index', compact('locomotives'));
    }

    public function create()
    {
        return Inertia::render('locomotives/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code'         => 'required|string|unique:locomotives,code|max:255',
            'model'        => 'required|string|max:255',
            'manufacturer' => 'nullable|string|max:255',
            'built_year'   => 'nullable|digits:4|integer|min:1900|max:' . date('Y'),
        ]);

        Locomotive::create($data);

        return redirect()->route('locomotives.index');
    }

    public function show(string $locomotive)
    {
        $locomotiveObj = Locomotive::findOrFail(id: $locomotive);
        Log::info("Locomotive details accessed:", ['locomotive_id' => $locomotiveObj->id, 'code' => $locomotiveObj->code]);
        if (!$locomotiveObj) {
            return redirect()->route('locomotives.index')->with('error', 'Locomotive not found.');
        }
        return Inertia::render('locomotives/show', ['locomotive' => $locomotiveObj]);
    }

    public function edit(Locomotive $locomotive)
    {
        return Inertia::render('locomotives/edit', compact('locomotive'));
    }

    public function update(Request $request, Locomotive $locomotive)
    {
        $data = $request->validate([
            'code'         => 'required|string|unique:locomotives,code,' . $locomotive->id . '|max:255',
            'model'        => 'required|string|max:255',
            'manufacturer' => 'nullable|string|max:255',
            'built_year'   => 'nullable|digits:4|integer|min:1900|max:' . date('Y'),
        ]);

        $locomotive->update($data);

        return redirect()->route('locomotives.show', $locomotive);
    }

    public function destroy(Locomotive $locomotive)
    {
        $locomotive->delete();
        return redirect()->route('locomotives.index');
    }
}
