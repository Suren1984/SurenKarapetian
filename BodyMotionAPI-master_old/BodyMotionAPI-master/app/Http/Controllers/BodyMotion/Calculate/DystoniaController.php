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

class DystoniaController
{
    public function test(Request $request)
    {
        $datas = json_decode($request->post("jointDatas"));
        $side = "Left";
        $param = "Shoulder Flexion";

        $arr = array(); // array of values of the current parameter

        foreach ($datas as $data) {
            $exc = PostureController::getSideData($side, $data->jointDatas, false);
            foreach ($exc as $p) {
                if ($p["param"] == $param)
                    array_push($arr, $p["val"]);
            }
        }
        if ($arr == null)
            $arr = array(0);

        // flexion, extension, abducaiton...

    }



    public function getCurrentExcursion(Request $request)
    {
        $data = json_decode($request->post("jointDatas"));
        return response()->json($this->calculateCurrentExcursion($data));
    }

    public function calculateCurrentExcursion($data)
    {
        $arr = array();

        // rotation
        $val = Helpers::getXRotationsDiff(
            $data[Helpers::$JOINTS["Head"]]->orient->Matrix,
            $data[Helpers::$JOINTS["Torso"]]->orient->Matrix
        );
        $arr[] = array(
            "param" => "Rotation",
            "val" => $val,
            "text" => abs($val) . "°" . (($val > 0) ? " left" : " right")
        );

        // torticollis
        $val = Helpers::getXRotationsDiff(
            $data[Helpers::$JOINTS["Neck"]]->orient->Matrix,
            $data[Helpers::$JOINTS["Torso"]]->orient->Matrix
        );
        $arr[] = array(
            "param" => "Torticollis",
            "val" => $val,
            "text" => abs($val) . "°" . (($val > 0) ? " left" : " right")
        );

        // laterocollis
        $val = Helpers::getYRotationsDiff(
            $data[Helpers::$JOINTS["Neck"]]->orient->Matrix,
            $data[Helpers::$JOINTS["Torso"]]->orient->Matrix
        );
        $arr[] = array(
            "param" => "Laterocollis",
            "val" => $val,
            "text" => abs($val) . "°" . (($val > 0) ? " left" : " right")
        );

        // laterocaput
        $val = Helpers::getYRotationsDiff(
            $data[Helpers::$JOINTS["Head"]]->orient->Matrix,
            $data[Helpers::$JOINTS["Torso"]]->orient->Matrix
        );
        $arr[] = array(
            "param" => "Laterocaput",
            "val" => $val,
            "text" => abs($val) . "°" . (($val > 0) ? " left" : " right")
        );

        // anterocollis
        $val = Helpers::getZRotationsDiff(
            $data[Helpers::$JOINTS["Neck"]]->orient->Matrix,
            $data[Helpers::$JOINTS["Torso"]]->orient->Matrix
        );
        $arr[] = array(
            "param" => "Anterocollis",
            "val" => (($val > 0) ? $val : 0),
            "text" => (($val > 0) ? abs($val) . "°" : "0°")
        );

        // anterocaput
        $val = Helpers::getZRotationsDiff(
            $data[Helpers::$JOINTS["Head"]]->orient->Matrix,
            $data[Helpers::$JOINTS["Torso"]]->orient->Matrix
        );
        $arr[] = array(
            "param" => "Anterocaput",
            "val" => (($val > 0) ? $val : 0),
            "text" => (($val > 0) ? abs($val) . "°" : "0°")
        );

        // retrocollis
        $val = Helpers::getZRotationsDiff(
            $data[Helpers::$JOINTS["Neck"]]->orient->Matrix,
            $data[Helpers::$JOINTS["Torso"]]->orient->Matrix
        );
        $arr[] = array(
            "param" => "Retrocollis",
            "val" => (($val <= 0) ? $val : 0),
            "text" => (($val <= 0) ? abs($val) . "°" : "0°")
        );

        // retrocaput
        $val = Helpers::getZRotationsDiff(
            $data[Helpers::$JOINTS["Head"]]->orient->Matrix,
            $data[Helpers::$JOINTS["Torso"]]->orient->Matrix
        );
        $arr[] = array(
            "param" => "Retrocaput",
            "val" => (($val <= 0) ? $val : 0),
            "text" => (($val <= 0) ? abs($val) . "°" : "0°")
        );

        // lateralshift
        $val = Helpers::GetCMDifference($data[Helpers::$JOINTS["Head"]]->real->X, $data[Helpers::$JOINTS["Torso"]]->real->X);
        $arr[] = array(
            "param" => "Lateral Shift",
            "val" => $val,
            "text" => abs($val) . "cm" . (($val > 0) ? " left up" : " right up")
        );

        // sagittalshift
        $val = Helpers::GetCMDifference($data[Helpers::$JOINTS["Head"]]->real->Z, $data[Helpers::$JOINTS["Neck"]]->real->Z);
        $arr[] = array(
            "param" => "Sagittal Shift",
            "val" => $val,
            "text" => abs($val) . "cm" . (($val > 0) ? " forward" : " backward")
        );

        // shoulderelevation
        $val = Helpers::GetCMDifference($data[Helpers::$JOINTS["RightShoulder"]]->real->X, $data[Helpers::$JOINTS["LeftShoulder"]]->real->X);
        $arr[] = array(
            "param" => "Shoulder Elevation",
            "val" => $val,
            "text" => abs($val) . "cm" . (($val > 0) ? " left up" : " right up")
        );

        return $arr;
    }

    public static function getTable(Record $record, $json = true)
    {
        $datas = json_decode($record->data);

        $table = array(
            "id" => $record->id,
            "data" => array(
                self::getTableValues("Rotation", $datas),
                self::getTableValues("Torticollis", $datas),
                self::getTableValues("Laterocollis", $datas),
                self::getTableValues("Laterocaput", $datas),
                self::getTableValues("Anterocollis", $datas),
                self::getTableValues("Anterocaput", $datas),
                self::getTableValues("Retrocollis", $datas),
                self::getTableValues("Retrocaput", $datas),
                self::getTableValues("Shoulder Elevation", $datas),
            ));
        if ($json)
            return response()->json($table);
        return array("vals" => $table);
    }

    public static function getTableValues($param, $datas)
    {
        $arr = array(); // array of values of the current parameter

        foreach ($datas as $data) {
            $exc = self::calculateCurrentExcursion($data->jointDatas);
            foreach ($exc as $p) {
                if ($p["param"] == $param)
                    array_push($arr, $p["val"]);
            }
        }

        return array(
            "Param" => $param,
            "Max" => max($arr),
            "Avg" => Helpers::avg($arr),
            "Med" => Helpers::med($arr),
            "v014" => Helpers::getShare($arr, 1, 14),
            "v1529" => Helpers::getShare($arr, 15, 29),
            "v3044" => Helpers::getShare($arr, 30, 44),
            "v45" => Helpers::getShare($arr, 45, 1000),
        );
    }

    public static function getChart(Record $record, $unixMillies = false)
    {
        $datas = json_decode($record->data);
        $datasets = array();
        $times = array();
        $milli = 0;
        array_push($times, "");
        foreach ($datas as $data) {
            array_push($times, ($unixMillies ? $milli . " / " . $data->date : $milli));
            $milli = $milli + 40;
        }

        $labels = array("Rotation", "Torticollis", "Laterocollis", "Laterocaput", "Anterocollis");

        foreach ($labels as $label) {
            $dataset = array();
            foreach ($datas as $data) {
                $exc = self::calculateCurrentExcursion($data->jointDatas);
                foreach ($exc as $p) {
                    if ($p["param"] == $label)
                        array_push($dataset, $p["val"]);
                }
            }
            $datasets[] = array(
                "param" => $label,
                "data" => $dataset
            );
        }

        return array(
            $times,
            $datasets
        );
    }
}
