<?php

namespace App\Http\Controllers\BodyMotion\Calculate;

use App\Http\Controllers\BodyMotion\Calculate\Objects\StepData;
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

class GaitController
{
    private $stepStride;

    public function getCurrentExcursion(Request $request)
    {
        $data = json_decode($request->post("jointDatas"));
        return response()->json($this->calculateCurrentExcursion($data));
    }

    public function calculateCurrentExcursion($data, $allData = false, $json = true)
    {
        $arr = array();

        $arr[] = $this->getSideData("Left", $data, $allData);
        $arr[] = $this->getSideData("Right", $data, $allData);
        $arr[] = $this->getSingleData($data, $allData);

        if ($json)
            return response()->json($arr);
        return $arr;
    }

    private function getSideData($side, $data, $allData, $current = true)
    {
        $arr = array();

        // hip flexion
        $val = (Helpers::getAngle2YZ(
                $data[Helpers::$JOINTS[$side . "Knee"]]->real,
                $data[Helpers::$JOINTS["Waist"]]->real
            ) - 90);

        $conf = "1";
        if (isset($data[Helpers::$JOINTS[$side . "Hip"]]->confidence)) {
            $conf = $data[Helpers::$JOINTS[$side . "Hip"]]->confidence;
        }

        $val = $val * -1;


        if ($current) {
            $arr[] = array(
                "param" => "Hip Flexion",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
        } else {
            $arr[] = array(
                "param" => "Hip Flexion",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
            $arr[] = array(
                "param" => "Hip Extension",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
        }

        // knee flexion
        $val = ((Helpers::getAngle3(
                $data[Helpers::$JOINTS[$side . "Knee"]]->real,
                $data[Helpers::$JOINTS[$side . "Hip"]]->real,
                $data[Helpers::$JOINTS[$side . "Ankle"]]->real
            ))) - 180;

        $val = $val * -1;


        $conf = "1";
        if (isset($data[Helpers::$JOINTS[$side . "Knee"]]->confidence)) {
            $conf = $data[Helpers::$JOINTS[$side . "Knee"]]->confidence;
        }

        if ($current) {
            $arr[] = array(
                "param" => "Knee Flexion",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
        } else {
            $arr[] = array(
                "param" => "Knee Flexion",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
            $arr[] = array(
                "param" => "Knee Extension",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
        }


        // ankle flexion
        /*$val = ((Helpers::getYRotation(
                    $data[Helpers::$JOINTS[$side . "Ankle"]]->orient->Matrix
                )) + (($side == "Right") ? 0 : 0)) * (($side == "Right") ? -1 : 1);*/

        $val = Helpers::getAngle2YZ($data[Helpers::$JOINTS[$side . "Knee"]]->real, $data[Helpers::$JOINTS[$side . "Ankle"]]->real) + 90;


        $conf = "1";
        if (isset($data[Helpers::$JOINTS[$side . "Ankle"]]->confidence)) {
            $conf = $data[Helpers::$JOINTS[$side . "Ankle"]]->confidence;
        }

        //$val = $val * -1;


        if ($current) {
            $arr[] = array(
                "param" => "Ankle Flexion",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
        } else {
            $arr[] = array(
                "param" => "Ankle Flexion",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
            $arr[] = array(
                "param" => "Ankle Extension",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
        }

        // hip abduction frontal
        $val = ((Helpers::getZRotation(
            $data[Helpers::$JOINTS[$side . "Hip"]]->orient->Matrix
        )));

        if ($side == "Right")
            $val = $val * -1;


        $conf = "1";
        if (isset($data[Helpers::$JOINTS[$side . "Hip"]]->confidence)) {
            $conf = $data[Helpers::$JOINTS[$side . "Hip"]]->confidence;
        }

        if ($current) {
            $arr[] = array(
                "param" => "Hip Abduction Frontal",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
        } else {
            $arr[] = array(
                "param" => "Hip Abduction Frontal",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
            $arr[] = array(
                "param" => "Hip Adduction Frontal",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
        }

        // hip abduction transversal
        /* $val = ((Helpers::getXRotation(
             $data[Helpers::$JOINTS[$side . "Hip"]]->orient->Matrix
         )));*/

        $val = abs(abs(Helpers::getAngle2XZ($data[Helpers::$JOINTS[$side . "Hip"]]->real, $data[Helpers::$JOINTS[$side . "Knee"]]->real)) - 90);

        /* if ($side == "Left")
             $val = $val * -1;*/

        if ($data[Helpers::$JOINTS["LeftKnee"]]->proj->X - $data[Helpers::$JOINTS["RightKnee"]]->proj->X <= 0)
            $val = $val * -1;


        $conf = "1";
        if (isset($data[Helpers::$JOINTS[$side . "Hip"]]->confidence)) {
            $conf = $data[Helpers::$JOINTS[$side . "Hip"]]->confidence;
        }

        if ($current) {
            $arr[] = array(
                "param" => "Hip Abduction Transversal",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
        } else {
            $arr[] = array(
                "param" => "Hip Abduction Transversal",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
            $arr[] = array(
                "param" => "Hip Adduction Transversal",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
        }


        // knee abduction
        $val = ((Helpers::getXRotationsDiff(
            $data[Helpers::$JOINTS[$side . "Hip"]]->orient->Matrix,
            $data[Helpers::$JOINTS[$side . "Knee"]]->orient->Matrix
        )));

        // $val = $val * -1;


        $conf = "1";
        if (isset($data[Helpers::$JOINTS[$side . "Knee"]]->confidence)) {
            $conf = $data[Helpers::$JOINTS[$side . "Knee"]]->confidence;
        }

        if ($current) {
            $arr[] = array(
                "param" => "Knee Abduction",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
        } else {
            $arr[] = array(
                "param" => "Knee Abduction",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
            $arr[] = array(
                "param" => "Knee Adduction",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
        }


        if ($allData) {

            $val = $this->stepStride->GetStepLength($side);
            $arr[] = array(
                "param" => "Step Length",
                "val" => $val,
                "text" => $val . "cm"
            );

            $val = $this->stepStride->GetStepTime($side);
            $arr[] = array(
                "param" => "Step Time",
                "val" => $val,
                "text" => $val . "s"
            );

            $val = $this->stepStride->GetStepWidth($side);
            $arr[] = array(
                "param" => "Step Width",
                "val" => $val,
                "text" => $val . "cm"
            );

            $val = $this->stepStride->GetStrideLength($side);
            $arr[] = array(
                "param" => "Stride Length",
                "val" => $val,
                "text" => $val . "cm"
            );

            $val = $this->stepStride->GetStrideTime($side);
            $arr[] = array(
                "param" => "Stride Time",
                "val" => $val,
                "text" => $val . "s"
            );

            $val = $this->stepStride->GetHipVariation($side);
            $arr[] = array(
                "param" => "Hip Variation",
                "val" => $val,
                "text" => $val . "cm"
            );

            $val = $this->stepStride->GetKneeVariation($side);
            $arr[] = array(
                "param" => "Knee Variation",
                "val" => $val,
                "text" => $val . "cm"
            );

            $val = $this->stepStride->GetAnkleVariation($side);
            $arr[] = array(
                "param" => "Ankle Variation",
                "val" => $val,
                "text" => $val . "cm"
            );
        }

        return $arr;
    }

    private function getSingleData($data, $allData, $current = true)
    {
        $arr = array();


        if ($allData) {
            $val = $this->stepStride->GetCadence();
            $arr[] = array(
                "param" => "Cadence",
                "val" => $val,
                "text" => $val . "steps/m"
            );

            $val = $this->stepStride->GetDoubleSupportTime();
            $arr[] = array(
                "param" => "Double Support Time",
                "val" => $val,
                "text" => $val . "s"
            );

            $val = $this->stepStride->GetSwingTime();
            $arr[] = array(
                "param" => "Swing Time",
                "val" => $val,
                "text" => $val . "s"
            );
            $val = $this->stepStride->GetStepAssymetry();
            $arr[] = array(
                "param" => "Step Assymetry",
                "val" => $val,
                "text" => $val . "cm"
            );

            $val = $this->stepStride->GetStrideAssymetry();
            $arr[] = array(
                "param" => "Stride Assymetry",
                "val" => $val,
                "text" => $val . "cm"
            );
        }

        return $arr;
    }

    public function getTable(Record $record, $json = true)
    {
        $datas = json_decode($record->data);
        $this->stepStride = new StepStride();
        foreach ($datas as $frame)
            $this->stepStride->AddData($frame->jointDatas);

        $table = array(
            "id" => $record->id,
            "data" => array(
                "leftSide" => array(
                    self::getTableValuesSide("Hip Flexion", $datas, "Left"),
                    //    self::getTableValuesSide("Hip Extension", $datas, "Left"),
                    self::getTableValuesSide("Knee Flexion", $datas, "Left"),
                    //   self::getTableValuesSide("Knee Extension", $datas, "Left"),
                    self::getTableValuesSide("Ankle Flexion", $datas, "Left"),
                    //  self::getTableValuesSide("Ankle Extension", $datas, "Left"),
                    self::getTableValuesSide("Hip Abduction Frontal", $datas, "Left"),
                    self::getTableValuesSide("Hip Abduction Transversal", $datas, "Left"),
                    //  self::getTableValuesSide("Hip Adduction", $datas, "Left"),
                    self::getTableValuesSide("Knee Abduction", $datas, "Left"),
                    // self::getTableValuesSide("Knee Adduction", $datas, "Left"),
                    self::getTableValuesSide("Step Length", $datas, "Left"),
                    self::getTableValuesSide("Step Time", $datas, "Left"),
                    self::getTableValuesSide("Step Width", $datas, "Left"),
                    self::getTableValuesSide("Stride Length", $datas, "Left"),
                    self::getTableValuesSide("Stride Time", $datas, "Left"),
                    self::getTableValuesSide("Hip Variation", $datas, "Left"),
                    self::getTableValuesSide("Knee Variation", $datas, "Left"),
                    self::getTableValuesSide("Ankle Variation", $datas, "Left"),

                ),
                "rightSide" => array(
                    self::getTableValuesSide("Hip Flexion", $datas, "Right"),
                    //   self::getTableValuesSide("Hip Extension", $datas, "Right"),
                    self::getTableValuesSide("Knee Flexion", $datas, "Right"),
                    //   self::getTableValuesSide("Knee Extension", $datas, "Right"),
                    self::getTableValuesSide("Ankle Flexion", $datas, "Right"),
                    // self::getTableValuesSide("Ankle Extension", $datas, "Right"),
                    self::getTableValuesSide("Hip Abduction Frontal", $datas, "Right"),
                    self::getTableValuesSide("Hip Abduction Transversal", $datas, "Right"),
                    //  self::getTableValuesSide("Hip Adduction", $datas, "Right"),
                    self::getTableValuesSide("Knee Abduction", $datas, "Right"),
                    // self::getTableValuesSide("Knee Adduction", $datas, "Right"),
                    self::getTableValuesSide("Step Length", $datas, "Right"),
                    self::getTableValuesSide("Step Time", $datas, "Right"),
                    self::getTableValuesSide("Step Width", $datas, "Right"),
                    self::getTableValuesSide("Stride Length", $datas, "Right"),
                    self::getTableValuesSide("Stride Time", $datas, "Right"),
                    self::getTableValuesSide("Hip Variation", $datas, "Right"),
                    self::getTableValuesSide("Knee Variation", $datas, "Right"),
                    self::getTableValuesSide("Ankle Variation", $datas, "Right"),
                ),
                "single" => array(
                    //   self::getTableValuesSingle("Neck Flexion", $datas),
                    //    self::getTableValuesSingle("Pelvis Extension", $datas),
                    self::getTableValuesSingle("Cadence", $datas),
                    self::getTableValuesSingle("Double Support Time", $datas),
                    self::getTableValuesSingle("Swing Time", $datas),
                    self::getTableValuesSingle("Step Assymetry", $datas),
                    self::getTableValuesSingle("Stride Assymetry", $datas),
                )
            )
        );
        if ($json)
            return response()->json($table);
        return array("vals" => $table);
    }

    public function getTableValuesSide($param, $datas, $side)
    {
        $arr = array(); // array of values of the current parameter

        foreach ($datas as $data) {
            $confVal = 0;
            $exc = self::getSideData($side, $data->jointDatas, true, false);
            foreach ($exc as $p) {
                if ($p["param"] == $param) {
                    try {
                        if ($p["conf"] < 0.5)
                            array_push($arr, $confVal);
                        else {
                            array_push($arr, $p["val"]);
                            $confVal = $p["val"];
                        }
                    }catch (\Exception $ee){
                        array_push($arr, $p["val"]);
                    }
                }
            }
        }

        return array(
            "Param" => $param,
            "Min" => min($arr),
            "Max" => max($arr),
            "Avg" => Helpers::avg($arr),
        );
    }

    public function getTableValuesSingle($param, $datas)
    {
        $arr = array(); // array of values of the current parameter

        foreach ($datas as $data) {
            $confVal = 0;
            $exc = self::getSingleData($data->jointDatas, true, false);
            foreach ($exc as $p) {
                if ($p["param"] == $param) {
                    try {
                        if ($p["conf"] < 0.5)
                            array_push($arr, $confVal);
                        else {
                            array_push($arr, $p["val"]);
                            $confVal = $p["val"];
                        }
                    } catch (\Exception $ee) {
                        array_push($arr, $p["val"]);
                    }
                }
            }
        }

        return array(
            "Param" => $param,
            "Min" => count($arr) > 0 ? min($arr) : -1,
            "Min" => count($arr) > 0 ? max($arr) : -1,
            "Avg" => count($arr) > 0 ? Helpers::avg($arr) : -1,
        );
    }

    public function getChart(Record $record, $unixMillies = false)
    {
        $datas = json_decode($record->data);
        $this->stepStride = new StepStride();
        foreach ($datas as $frame)
            $this->stepStride->AddData($frame->jointDatas);

        $datas = json_decode($record->data);
        $datasets = array();
        $times = array();
        $milli = 0;
        array_push($times, "");
        foreach ($datas as $data) {
            array_push($times, ($unixMillies ? $milli . " / " . $data->date : $milli / 1000));
            $milli = $milli + 40;
        }

        // Left Side chart
        $side = "Left";
        $labels_sides = array(
            $side . " Hip Flexion",
            $side . " Knee Flexion",
            $side . " Ankle Flexion",
            $side . " Hip Abduction Frontal",
            $side . " Hip Abduction Transversal",
            $side . " Knee Abduction",
        );

        foreach ($labels_sides as $label) {
            $dataset = array();
            $confVal = 0;

            foreach ($datas as $data) {
                $exc = self::getSideData("Left", $data->jointDatas, true, false);
                foreach ($exc as $p) {
                    if ($p["param"] == str_replace("Left ", "", $label)){
                        try {
                            if ($p["conf"] < 0.5)
                                array_push($dataset, $confVal);
                            else {
                                array_push($dataset, $p["val"]);
                                $confVal = $p["val"];
                            }
                        }catch (\Exception $ee){
                            array_push($dataset, $p["val"]);
                        }
                    }
                }
            }
            $datasets[] = array(
                "param" => $label . (str_contains($label, "Flexion") ? " / Extension" : " / Adduction"),
                "data" => $dataset
            );
        }

        // Right side
        $side = "Right";
        $labels_sides = array(
            $side . " Hip Flexion",
            $side . " Knee Flexion",
            $side . " Ankle Flexion",
            $side . " Hip Abduction Frontal",
            $side . " Hip Abduction Transversal",
            $side . " Knee Abduction",
        );

        foreach ($labels_sides as $label) {
            $dataset = array();
            foreach ($datas as $data) {
                $confVal = 0;
                $exc = self::getSideData("Right", $data->jointDatas, true, false);
                foreach ($exc as $p) {
                    if ($p["param"] == str_replace("Right ", "", $label)){
                        try {
                            if ($p["conf"] < 0.5)
                                array_push($dataset, $confVal);
                            else {
                                array_push($dataset, $p["val"]);
                                $confVal = $p["val"];
                            }
                        }catch (\Exception $ee){
                            array_push($dataset, $p["val"]);
                        }
                    }
                }
            }
            $datasets[] = array(
                "param" => $label . (str_contains($label, "Flexion") ? " / Extension" : " / Adduction"),
                "data" => $dataset
            );
        }


        // Single data
        /*  $labels = array(
              "Pelvis Extension",
          );

          foreach ($labels as $label) {
              $dataset = array();
              foreach ($datas as $data) {
                  $exc = self::getSingleData($data->jointDatas, true, false);
                  foreach ($exc as $p) {
                      if ($p["param"] == $label)
                          array_push($dataset, $p["val"]);
                  }
              }
              $datasets[] = array(
                  "param" => $label,
                  "data" => $dataset
              );
          }*/

        return array(
            $times,
            $datasets
        );
    }

}
