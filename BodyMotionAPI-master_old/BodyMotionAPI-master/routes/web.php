<?php

use App\Http\Controllers\BodyMotion\AuthController;
use App\Http\Controllers\BodyMotion\MLController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\DystoniaTreatment\RehabController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', [Controller::class, 'Welcome']);

// Dystonia Treatment Mobile App
Route::get('{api_key}/get_rehab_params/{rehab_id}', [RehabController::class, 'GetParams'])->name("get_rehab_params");
Route::get('/add_param', [RehabController::class, 'AddParam'])->name("add_param"); // test endpoint
Route::get('/ml', [MLController::class, 'index']);
