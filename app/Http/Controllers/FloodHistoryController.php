<?php

namespace App\Http\Controllers;

use App\Models\FloodDetection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FloodHistoryController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 12;
        $detections = FloodDetection::where('user_id', Auth::id())
            ->latest()
            ->paginate($perPage)
            ->through(function ($detection) {
                return [
                    'id' => $detection->id,
                    'original_image_url' => asset('storage/' . $detection->original_image_path),
                    'mask_image_url'     => asset('storage/' . $detection->mask_image_path),
                    'created_at' => $detection->created_at->format('d M Y, H:i'),
                    'created_at_raw' => $detection->created_at->toISOString(),
                ];
            });

        return Inertia::render('dashboard/flood-history', [
            'detections' => $detections,
        ]);
    }

    public function show($id)
    {
        $detection = FloodDetection::where('user_id', Auth::id())
            ->findOrFail($id);

        return Inertia::render('dashboard/flood-detail', [
            'detection' => [
                'id' => $detection->id,
                'original_image_url' => asset('storage/' . $detection->original_image_path),
                'mask_image_url'     => asset('storage/' . $detection->mask_image_path),
                'created_at' => $detection->created_at->format('d M Y, H:i'),
                'created_at_raw' => $detection->created_at->toISOString(),
            ],
        ]);
    }
}
