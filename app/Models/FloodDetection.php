<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FloodDetection extends Model
{
    protected $fillable = [
        'user_id',
        'original_image_path',
        'mask_image_path',
    ];

    /**
     * Get the user that owns the flood detection.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
