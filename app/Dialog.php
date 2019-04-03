<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Dialog extends Model
{
  protected $fillable = [
    'user1',
    'user2',
    'last_send'
  ];

  public function messages()
  {
    return $this->hasMany('App\Message');
  }
}
