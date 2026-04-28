<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    protected $fillable = [
        'ip',
        'country',
        'city',
        'user_agent',
        'last_visited_at',
        'visit_count',
    ];

    protected $casts = [
        'last_visited_at' => 'datetime',
    ];
}
