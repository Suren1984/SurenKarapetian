<?php

use App\Http\Controllers\BodyMotion\AuthController;
use App\Http\Controllers\BodyMotion\Calculate\DystoniaController;
use App\Http\Controllers\BodyMotion\Calculate\ExcelExport;
use App\Http\Controllers\BodyMotion\Calculate\FullbodyController;
use App\Http\Controllers\BodyMotion\Calculate\GaitController;
use App\Http\Controllers\BodyMotion\Calculate\PostureController;
use App\Http\Controllers\BodyMotion\MLController;
use App\Http\Controllers\BodyMotion\RecordTablesController;
use App\Http\Controllers\BodyMotion\VersionController;
use App\Http\Controllers\DystoniaTreatment\AuthController as PatientsAuthController;
use App\Http\Controllers\DystoniaTreatment\PatientController as PatientsPatientController;
use App\Http\Controllers\BodyMotion\UserController;
use \App\Http\Controllers\BodyMotion\PatientController;
use \App\Http\Controllers\BodyMotion\RecordController;
use App\Http\Controllers\BodyMotion\RehabilitationController;
use Illuminate\Support\Facades\Route;

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
Route::middleware(['cors'])->group(function () {


    Route::get('download/{version}', [VersionController::class, 'download']);
    Route::get('excel/{record}', [ExcelExport::class, 'download']);

    Route::prefix('bodymotion')->group(function () {
        Route::post('register/', [AuthController::class, 'register']);
        Route::get('getversion/', [VersionController::class, 'index']);
        Route::post('login/', [AuthController::class, 'login']);
        Route::post('forgot-password/', [AuthController::class, 'forgotPassword'])->name('password.email');
        Route::post('reset-password/', [AuthController::class, 'resetPassword'])->name('password.update');

        Route::prefix('calculate')->group(function () {
            Route::post('current-dystonia/', [DystoniaController::class, 'getCurrentExcursion']);
            Route::post('current-posture/', [PostureController::class, 'getCurrentExcursion']);
            Route::post('current-gait/', [GaitController::class, 'getCurrentExcursion']);
            Route::post('current-fullbody/', [FullbodyController::class, 'getCurrentExcursion']);
            Route::post('test/', [DystoniaController::class, 'test']);
        });

        Route::prefix('api')->group(function () {
            Route::post('patients', [PatientController::class, 'getPatientsAPI']);
            Route::post('/create-rehab-record', [PatientController::class, 'storeRecordAPI']);
        });

        // If user is authenticated by API token
        Route::group(['middleware' => ['auth:sanctum']], function () {
            Route::get('user/', [UserController::class, 'showProfile']);
            Route::post('change-password/', [AuthController::class, 'changePassword']);
            Route::post('logout/', [AuthController::class, 'logout']);

            Route::get('doctors/', [UserController::class, 'indexDoctors']);

            Route::prefix('patients')->group(function () {
                Route::get('/', [PatientController::class, 'index']);
                Route::post('/', [PatientController::class, 'store']);

                Route::prefix('{patient}')->group(function () {
                    Route::get('/', [PatientController::class, 'show']);
                    Route::delete('/', [PatientController::class, 'destroy']);
                    Route::put('/', [PatientController::class, 'update']);
                    Route::post('register/', [PatientController::class, 'register']);

                    Route::prefix('records')->group(function () {
                        Route::get('/', [PatientController::class, 'indexRecords']);
                        Route::get('/{module}', [PatientController::class, 'indexRecordsModule']);
                        Route::post('/', [PatientController::class, 'storeRecordNoFile']);
                    });

                    Route::prefix('rehabilitations')->group(function () {
                        Route::get('/', [PatientController::class, 'indexRehabilitations']);
                        Route::post('/', [PatientController::class, 'storeRehabilitation']);
                        Route::delete('/', [PatientController::class, 'destroyRehabilitations']);
                    });
                });
            });

            Route::prefix('records/{record}')->group(function () {
                Route::get('/', [RecordController::class, 'show']);
                Route::delete('/', [RecordController::class, 'destroy']);
                Route::get('file/', [RecordController::class, 'showFile']);
                Route::get('data/', [RecordTablesController::class, 'getData']);
                Route::get('dystonia/table/', [DystoniaController::class, 'getTable']);
                Route::get('dystonia/chart/', [DystoniaController::class, 'getChart']);
                Route::get('posture/table/', [PostureController::class, 'getTable']);
                Route::get('posture/chart/', [PostureController::class, 'getChart']);
                Route::get('gait/table/', [GaitController::class, 'getTable']);
                Route::get('gait/chart/', [GaitController::class, 'getChart']);
                Route::get('fullbody/table/', [FullbodyController::class, 'getTable']);
                Route::get('fullbody/chart/', [FullbodyController::class, 'getChart']);
                Route::get('rehabilitation/', [RehabilitationController::class, 'getRehab']);
                Route::prefix('table')->group(function () {
                    Route::get('/', [RecordTablesController::class, 'index']);
                });
            });


            Route::prefix('rehabilitations/{rehabilitation}')->group(function () {
                Route::delete('/', [RehabilitationController::class, 'destroy']);
            });
        });
    });

    Route::prefix('mobile')->group(function () {
        Route::post('login/', [PatientsAuthController::class, 'login']);
        Route::post('forgot-password/', [PatientsAuthController::class, 'forgotPassword'])->name('password.email2');
        Route::post('reset-password/', [PatientsAuthController::class, 'resetPassword'])->name('password.update2');

        // If patient is authenticated by API token
        Route::group(['middleware' => ['auth:patients_api']], function () {
            Route::post('change-password/', [PatientsAuthController::class, 'changePassword2']);
            Route::post('logout/', [PatientsAuthController::class, 'logout2']);

            Route::get('patient/rehabilitations/', [PatientsPatientController::class, 'indexRehabilitations']);
        });
    });
});
