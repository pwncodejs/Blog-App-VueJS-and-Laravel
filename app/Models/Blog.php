<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;

    protected $table = 'blog';

    protected $fillable = ['title', 'cover_photo', 'blog_content', 'user_id', 'is_active'];

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }
}
