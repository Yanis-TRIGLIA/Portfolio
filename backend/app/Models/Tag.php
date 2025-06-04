<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'categories',
        'master_percentage',

    ];



    public function project()
    {
        return $this->belongsToMany(Project::class, 'project_tag');
    }

    public function blog()
    {
        return $this->belongsToMany(Blog::class, 'blog_tag');
    }
}
