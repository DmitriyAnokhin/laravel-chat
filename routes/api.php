<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/register', 'Api\Auth\RegisterController');
Route::post('/login', 'Api\Auth\LoginController');
Route::post('/sendlogout', 'Api\Chat\UsersController@sendLogout');

Route::middleware('auth:api')->group(function () {
  /* Logout */
  Route::post('/logout', 'Api\Auth\LogoutController');
  /* Users */
  Route::get('/user', 'Api\Chat\UsersController@currentUser');
  Route::get('/userslist', 'Api\Chat\UsersController@readUsersList');
  /* Dialogs */
  Route::post('/dialog/create', 'Api\Chat\DialogController@create');
  Route::post('/dialog/readdialoglist', 'Api\Chat\DialogController@readDialogList');
  /* Messages */
  Route::post('/messages/read', 'Api\Chat\MessageController@readMessages');
  Route::post('/messages/send', 'Api\Chat\MessageController@sendMessages');
  Route::post('/messages/file', 'Api\Chat\MessageController@uploadFile');
  Route::post('/messages/seen', 'Api\Chat\MessageController@updateMessage');
  Route::post('/messages/massseen', 'Api\Chat\MessageController@massUpdateMessages');
  Route::post('/messages/massread', 'Api\Chat\MessageController@massReadMessages');
});
