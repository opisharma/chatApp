<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Mail\Events\MessageSent;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    
public function store(Request $request)
{
    $message = Message::create([
        'user_id' => Auth::id(),
        'message' => $request->message,
    ]);

    broadcast(new MessageSent($message->load('user')))->toOthers();

    return response()->json(['status' => 'Message Sent!']);
}
}
