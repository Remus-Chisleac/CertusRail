<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTrainRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],

            // --- Power Train Sections Validation ---
            'power_trains' => ['present', 'array'],
            'power_trains.*.name' => ['required', 'string', 'max:255'],
            'power_trains.*.locomotives' => ['required', 'array', 'min:1'],
            'power_trains.*.locomotives.*.id' => [
                'required',
                'integer',
                Rule::exists('locomotives', 'id'), // Ensure the locomotive exists
            ],

            // --- Wagon Sections Validation ---
            'train_sections' => ['present', 'array'],
            'train_sections.*.name' => ['required', 'string', 'max:255'],
            'train_sections.*.wagons' => ['required', 'array', 'min:1'],
            'train_sections.*.wagons.*.id' => [
                'required',
                'integer',
                Rule::exists('wagons', 'id'), // Ensure the wagon exists
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'power_trains.*.locomotives.min' => 'Each power section must have at least one locomotive.',
            'train_sections.*.wagons.min' => 'Each wagon section must have at least one wagon.',
        ];
    }
}
