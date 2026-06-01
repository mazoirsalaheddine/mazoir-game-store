<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameAccount extends Model
{
    protected $fillable = [
    'game_name', 
    'whatsapp', // أضف هذا هنا
    'description', 
    'price', 
    'images',
    'likes_count',
    'status', 
    'created_by'
];

protected $casts = [
    'images' => 'array', // لكي يتم تحويل الـ JSON تلقائياً إلى Array عند التعامل معه في PHP
];
}
