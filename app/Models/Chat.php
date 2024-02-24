<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;
    protected $table = 'message';
    protected $fillable = [

        'sender_id', 'reciver_id', 'sender_message', 'reciver_message', 'time',
    ];

}
