<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Collections;

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

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::prefix('v1')->group(function () {

  Route::get('/me', function (Request $request) {
      $user = $request->user();
      if (is_a($user,  'Exception')) {
          return date('Y-m-d H:i:s',time())." ".$user;
      }
      $claims = $user->getAuthClaims();
      return (array) $claims;
  })->middleware('auth:api');

  Route::get('collections',                     'Collections@index');
  Route::get('collections/{resource}',          'Collections@find');
  Route::get('collections/{resource}/{id}',     'Collections@find');
  Route::post('collections/{resource}',         'Collections@create');
  Route::put('collections/{resource}/{id}',     'Collections@update');
  Route::delete('collections/{resource}/{id}',  'Collections@delete');

  function registerResourceRoutes($resource) {
    Route::get($resource, function (Request $request) {
      $resource = explode('/', $request->path())[2];
      $collections = App::make('App\Http\Controllers\Collections');
      return $collections->find($request, $resource, null);
    });

    Route::get($resource . '/{id}', function (Request $request, $id) {
      $resource = explode('/', $request->path() . '///')[2];
      $collections = App::make('App\Http\Controllers\Collections');
      return $collections->find($request, $resource, $id);
    });

    Route::post($resource, function (Request $request) {
      $resource = explode('/', $request->path() . '///')[2];
      $collections = App::make('App\Http\Controllers\Collections');
      return $collections->create($request, $resource);
    });

    Route::put($resource . '/{id}', function (Request $request, $id) {
      $resource = explode('/', $request->path() . '///')[2];
      $collections = App::make('App\Http\Controllers\Collections');
      return $collections->update($request, $resource, $id);
    });

    Route::delete($resource . '/{id}', function (Request $request, $id) {
      $resource = explode('/', $request->path() . '///')[2];
      $collections = App::make('App\Http\Controllers\Collections');
      return $collections->delete($request, $resource, $id);
    });
  }

  registerResourceRoutes('vendors');
  
});
