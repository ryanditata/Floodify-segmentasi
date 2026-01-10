<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('detection_histories', function (Blueprint $table) {
            $table->id();
            
            // Menghubungkan ke tabel users. 
            // onDelete('cascade') artinya jika User dihapus, history-nya ikut terhapus.
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Menyimpan path/lokasi file gambar
            $table->string('original_image_path'); // Gambar asli yang diupload
            $table->string('mask_image_path');     // Gambar hasil segmentasi (mask)
            
            // Menyimpan waktu pembuatan (created_at & updated_at)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detection_histories');
    }
};