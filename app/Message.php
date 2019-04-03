<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
  protected $fillable = [
    'dialog_id',
    'author',
    'message',
    'attachment',
    'attachment_type',
    'status',
    'send_time'
  ];
}
