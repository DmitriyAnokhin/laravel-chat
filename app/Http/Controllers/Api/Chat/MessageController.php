<?php

namespace App\Http\Controllers\Api\Chat;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Events\ChatMessage;
use App\Http\Controllers\Controller;
use App\Dialog;
use App\Message;

class MessageController extends Controller
{
  public function sendMessages(Request $request) {

    $message = Message::create(
          [
            'dialog_id' => $request->dialog_id,
            'author' => $request->author,
            'message' => $request->message,
            'attachment' => $request->attachment,
            'attachment_type' => $request->attachment_type,
            'status' => 'delivered',
            'send_time' => $request->send_time
          ]
        );

    Dialog::where('id', $request->dialog_id)->update(['last_send' => $request->send_time]);

    event(new ChatMessage($message));
    // broadcast(new ChatMessage($message))->toOthers();

    return response()->json($message);

  }

  public function readMessages(Request $request) {

    $messages = array();

    foreach ($request->dialogs_ids as $key => $value) {
      $message = Dialog::find($value)->messages()->orderBy('send_time', 'asc')->get();
      if (count($message) > 0) $messages[$value] = $message;
      if (count($message) == 0) $messages[$value] = array();
    }

    return response()->json($messages);

  }

  public function updateMessage(Request $request)
  {
    Message::where('dialog_id', $request->dialog_id)
            ->where('send_time', $request->send_time)
            ->update([
              'status' => 'seen'
            ]);

    $update = Message::where('dialog_id', $request->dialog_id)
                      ->where('send_time', $request->send_time)
                      ->first();

    event(new ChatMessage($update));

    return response()->json($update);
  }

  public function massReadMessages(Request $request)
  {
    $messages = Message::where('dialog_id', $request->dialog_id)->get();

    return response()->json($messages);
  }

  public function massUpdateMessages(Request $request)
  {
    Message::where('dialog_id', $request->not_seen[0]['dialog_id'])
            ->where('author', $request->not_seen[0]['author'])
            ->where('status', '!=', 'seen')
            ->update([
              'status' => 'seen'
            ]);

    $update = Message::where('dialog_id', $request->not_seen[0]['dialog_id'])->get();

    $event = [
      'massread' => 'massread',
      'dialog_id' => $request->not_seen[0]['dialog_id']
    ];

    event(new ChatMessage($event));

    return response()->json($update);
  }

  public function uploadFile(Request $request)
  {
    $path = '/public/attachments/'.$request->dialog_id;

    $upload = Storage::put($path, $request->file);

    return response()->json(['url' => $upload]);
  }
}
