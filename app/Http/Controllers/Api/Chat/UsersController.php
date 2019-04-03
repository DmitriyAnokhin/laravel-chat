<?php

namespace App\Http\Controllers\Api\Chat;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\Dialog;

class UsersController extends Controller
{
  public function currentUser() {

    $user = auth()->user();

    return response()->json($user);

  }

  public function readUsersList() {

    $users = User::select('email')->get();

    $user = auth()->user()->email;

    /* минус текущий пользователь */
    foreach ($users as $key => $value) {
      if ($value->email == $user) unset($users[$key]);
    }

    $list = Dialog::select('user1', 'user2')->where('user1', $user)->orWhere('user2', $user)->get();

    /* минус активные диалоги */
    foreach ($users as $key => $value) {
      foreach ($list as $key2 => $value2) {
        if ($value->email == $value2->user1 || $value->email == $value2->user2) unset($users[$key]);
      }
    }

    return response()->json($users);

  }

  public function sendLogout(Request $request) {

    User::where('id', $request->id)->update([ 'logout' => time() ]);

  }
}
