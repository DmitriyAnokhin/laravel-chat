<?php

namespace App\Http\Controllers\Api\Chat;

use Illuminate\Http\Request;
use App\Events\NewChat;
use App\Http\Controllers\Controller;
use App\Dialog;

class DialogController extends Controller
{
  public function create(Request $request) {

    $create = Dialog::firstOrCreate(
      [
        'user1' => $request->user1,
        'user2' => $request->user2,
        'last_send' => time() * 1000
      ]
    );

    event(new NewChat($create));

    return response()->json($create);

  }

  public function readDialogList(Request $request) {

    $list = Dialog::select('id', 'user1', 'user2', 'last_send')->where('user1', $request->email)->orWhere('user2', $request->email)->orderBy('last_send', 'desc')->get();

    return response()->json($list);

  }

}
