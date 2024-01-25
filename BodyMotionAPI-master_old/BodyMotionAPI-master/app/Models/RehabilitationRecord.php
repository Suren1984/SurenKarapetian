<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class RehabilitationRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'round',
        'rehab_name',
        'data',
        'record_id',
        'module'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
