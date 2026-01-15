<?php

namespace App\Http\Controllers;

use App\Models\FloodDetection;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $total = FloodDetection::where('user_id', $user->id)->count();

        $today = FloodDetection::where('user_id', $user->id)
            ->whereDate('created_at', today())
            ->count();

        $month = FloodDetection::where('user_id', $user->id)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $recent = FloodDetection::where('user_id', $user->id)
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn ($d) => [
                'id' => $d->id,
                'original' => asset('storage/' . $d->original_image_path),
                'mask' => asset('storage/' . $d->mask_image_path),
                'created_at' => $d->created_at->format('d M Y, H:i'),
            ]);

        return Inertia::render('dashboard/dashboard', [
            'user' => [
                'name' => $user->name,
                'role' => ucfirst($user->role ?? 'User'),
            ],
            'stats' => [
                'total' => $total,
                'today' => $today,
                'month' => $month,
            ],
            'recent' => $recent,
            'system' => [
                'ai' => 'Aktif',
                'server' => 'Online',
            ],
        ]);
    }
}