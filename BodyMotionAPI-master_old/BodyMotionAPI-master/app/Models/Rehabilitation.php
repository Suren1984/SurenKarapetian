<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rehabilitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'name',
        'name_detailed',
        'repeats',
        'to_stay',
        'filename',
        'description'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
