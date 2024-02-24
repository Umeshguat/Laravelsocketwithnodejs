<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Chatcontroller extends Controller
{
    //

    public function store(Request $request){

        $chats = Chat::create([
            'sender_id'=>$request->sender_id,
            'reciver_id'=>$request->reciver_id,
            'sender_message'=>$request->savemessage,
            'reciver_message'=>$request->message,
        ]);

    }
}
