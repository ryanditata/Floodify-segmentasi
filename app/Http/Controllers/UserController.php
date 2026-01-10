<?php

namespace App\Http\Controllers;

use App\Models\FloodDetection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('user/index');
    }

    public function detect(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login')->withErrors([
                'auth' => 'Silakan login terlebih dahulu untuk menggunakan fitur deteksi.'
            ]);
        }

        $image = $request->file('image');

        try {
            $response = Http::attach(
                'file',
                fopen($image->getPathname(), 'r'),
                $image->getClientOriginalName()
            )->timeout(30)
             ->post(config('services.ml_api') . '/predict');

            if ($response->successful()) {
                $result = $response->json();

                if ($result['status'] === 'success' && isset($result['image_base64'])) {
                    // Decode base64 mask image
                    $maskImageData = base64_decode($result['image_base64']);
                    
                    // Generate unique filenames
                    $originalFilename = 'original_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    $maskFilename = 'mask_' . time() . '_' . uniqid() . '.png';
                    
                    // Store original image
                    $originalPath = $image->storeAs('floods', $originalFilename, 'public');
                    
                    // Store mask image
                    $maskPath = 'floods/' . $maskFilename;
                    Storage::disk('public')->put($maskPath, $maskImageData);
                    
                    // Save to database
                    $floodDetection = FloodDetection::create([
                        'user_id' => Auth::id(),
                        'original_image_path' => $originalPath,
                        'mask_image_path' => $maskPath,
                    ]);

                    return back()->with('success', [
                        'mask_image' => 'data:image/png;base64,' . $result['image_base64'],
                        'message' => 'Deteksi berhasil! Hasil telah disimpan.'
                    ]);
                }

                return back()->withErrors([
                    'api_error' => 'Gagal memproses gambar di server AI.'
                ]);
            }

            return back()->withErrors([
                'api_error' => 'Gagal memproses gambar di server AI.'
            ]);

        } catch (\Throwable $e) {
            return back()->withErrors([
                'connection_error' => 'Tidak dapat terhubung ke service Python. Pastikan API berjalan.'
            ]);
        }
    }
}