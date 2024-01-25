<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Patient extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'first_name',
        'surname',
        'email',
        'phoneotype',
        'since',
        'height',
        'weight',
        'gender',
        'joints_distances'
    ];

    protected $hidden = [
        'password',
    ];

    public function records ()
    {
        return $this->hasMany(Record::class);
    }

    public function rehabilitations ()
    {
        return $this->hasMany(Rehabilitation::class);
    }
}
