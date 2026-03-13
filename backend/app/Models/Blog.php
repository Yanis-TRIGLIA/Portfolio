<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Blog extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'title',
        'slug', 
        'short_description',
        'content', 
        'cover', 
        'read_time',
        'meta_title', 
        'meta_description'
    ];

    protected $casts = [
        'content' => 'array', 
    ];


      public function tag()
    {
        return $this->belongsToMany(Tag::class, 'blog_tag', 'blog_id', 'tag_id');
    }

  

}
