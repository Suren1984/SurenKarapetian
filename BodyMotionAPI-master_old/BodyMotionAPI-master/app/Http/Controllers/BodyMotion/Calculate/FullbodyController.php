<?php

namespace App\Http\Controllers\BodyMotion\Calculate;

use App\Http\Controllers\Controller;
use App\Mail\PatientRegistered;
use App\Models\Record;
use App\Models\Patient;
use App\Models\Rehabilitation;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class FullbodyController
{

    public function getCurrentExcursion(Request $request)
    {
        $data = json_decode($request->post("jointDatas"));
        $postureController = new PostureController();
        $posture = $postureController->calculateCurrentExcursion($data, false);
        $gaitController = new GaitController();
        $gait = $gaitController->calculateCurrentExcursion($data, false, false);

        $fullbody = array(
            "posture" => $posture,
            "gait" => $gait,
        );

        return response()->json($fullbody);
    }

    public function getTable(Record $record, $json = true)
    {
        $gaitController = new GaitController();

        $table = array(
            "posture" => PostureController::getTable($record, false),
            "gait" => $gaitController->getTable($record, false)
        );

        if ($json)
            return response()->json($table);
        return array("vals" => $table);
    }

    public function getChart(Record $record, $unixMillies = false)
    {
        $gaitController = new GaitController();

        $chart = array(
            "posture" => PostureController::getChart($record, $unixMillies),
            "gait" => $gaitController->getChart($record, $unixMillies)
        );

        return $chart;
    }
}
 