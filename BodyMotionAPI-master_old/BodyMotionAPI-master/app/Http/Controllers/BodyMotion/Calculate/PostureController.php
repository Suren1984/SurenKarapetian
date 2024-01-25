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

class PostureController
{
    private static $sensitivity = 100;

    public function getCurrentExcursion(Request $request)
    {
        $data = json_decode($request->post("jointDatas"));
        return response()->json($this->calculateCurrentExcursion($data));
    }

    public function calculateCurrentExcursion($data, $json = true)
    {
        $arr = array();

        $arr[] = $this->getSideData("Left", $data);
        $arr[] = $this->getSideData("Right", $data);
        $arr[] = $this->getSingleData($data);

        if ($json)
            return response()->json($arr);
        return $arr;
    }

    public static function getSideData($side, $data, $current = true)
    {
        $arr = array();
        // shoulder flexion and abduction are based on shoulder rotation value
        $shoulder_rotation = Helpers::getYRotation($data[Helpers::$JOINTS[$side . "Shoulder"]]->orient->Matrix);

        // shoulder abduction transversal
        $val = 0;
        /*  if ((abs($shoulder_rotation) > self::$sensitivity)) {
              $val = Helpers::getZRotation($data[Helpers::$JOINTS[$side . "Shoulder"]]->orient->Matrix) -
                  (($side == "Right") ? + 90 : -90);
          }*/

        // $val = Helpers::getXRotation($data[Helpers::$JOINTS[$side . "Shoulder"]]->orient->Matrix);
        /* if ($data[Helpers::$JOINTS[$side . "Elbow"]]->real->Y - $data[Helpers::$JOINTS[$side . "Shoulder"]]->real->Y >= 0) {
             $val =  180 - ((Helpers::getXRotation($data[Helpers::$JOINTS[$side . "Shoulder"]]->orient->Matrix)));
         }else{
             $val = ((Helpers::getXRotation($data[Helpers::$JOINTS[$side . "Shoulder"]]->orient->Matrix)));
         }*/

        if ($data[Helpers::$JOINTS[$side . "Elbow"]]->real->Z - $data[Helpers::$JOINTS["Torso"]]->real->Z >= 0) {
            $val = 180 - abs(abs(Helpers::getAngle2XZ($data[Helpers::$JOINTS[$side . "Shoulder"]]->real, $data[Helpers::$JOINTS[$side . "Elbow"]]->real)) - 90);
        } else {
            $val = abs(abs(Helpers::getAngle2XZ($data[Helpers::$JOINTS[$side . "Shoulder"]]->real, $data[Helpers::$JOINTS[$side . "Elbow"]]->real)) - 90);
        }

       // $val = $data[Helpers::$JOINTS[$side . "Elbow"]]->real->Z - $data[Helpers::$JOINTS[$side . "Shoulder"]]->real->Z;

      /*  if ($val > 0){
            90 - $val;
        }*/

        /*  $val = Helpers::getXRotationsDiff($data[Helpers::$JOINTS[$side . "Shoulder"]]->orient->Matrix,
                  $data[Helpers::$JOINTS["Waist"]]->orient->Matrix) -
              (($side == "Right") ? + 0 : - 0);*/

        /*   $val = Helpers::getAngle2XY(
               $data[Helpers::$JOINTS[$side . "Shoulder"]]->real,
               $data[Helpers::$JOINTS[$side . "Elbow"]]->real
           );*/

        // $val = ($side == "Right" ? ($val < 0 ? $val + 90 : +(360 - $val - 90)) : $val + 90);
        //  $val = ($side == "Right" ? $val - 90 : $val + 90);

        /* $val = (Helpers::getAngle3XY(
                     $data[Helpers::$JOINTS["Torso"]]->real,
                     $data[Helpers::$JOINTS[$side . "Shoulder"]]->real,
                     $data[Helpers::$JOINTS[$side . "Elbow"]]->real
                 ));*/

        $conf = "1";
        if (isset($data[Helpers::$JOINTS[$side . "Shoulder"]]->confidence)) {
            $conf = $data[Helpers::$JOINTS[$side . "Shoulder"]]->confidence;
        }

        if ($current) {
            $arr[] = array(
                "param" => "Shoulder Abduction Transversal",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
        } else {
            $arr[] = array(
                "param" => "Shoulder Abduction Transversal",
                "val" => $val, //$val > 0 ? $val : 0,
                "text" => $val . "°",
                "conf" => $conf
            );
            $arr[] = array(
                "param" => "Shoulder Adduction Transversal",
                "val" => $val, //$val < 0 ? abs($val) : 0,
                "text" => $val . "°",
                "conf" => $conf
            );
        }

        // shoulder abduction frontal
        $val = 0;
        if ((abs($shoulder_rotation) < self::$sensitivity)) {
            if ($data[Helpers::$JOINTS[$side . "Elbow"]]->real->X - $data[Helpers::$JOINTS[$side . "Shoulder"]]->real->X >= 0) {
                $val = (Helpers::getZRotation($data[Helpers::$JOINTS[$side . "Shoulder"]]->orient->Matrix) -
                    (($side == "Right") ? +90 : -90));
            } else {
                $val = (Helpers::getZRotation($data[Helpers::$JOINTS[$side . "Shoulder"]]->orient->Matrix) -
                    (($side == "Right") ? +90 : -90));
            }

        }

        if ($side == "Right")
            $val = $val * -1;

        $conf = "1";
        if (isset($data[Helpers::$JOINTS[$side . "Shoulder"]]->confidence)) {
            $conf = $data[Helpers::$JOINTS[$side . "Shoulder"]]->confidence;
        }

        if ($current) {
            $arr[] = array(
                "param" => "Shoulder Abduction Frontal",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
        } else {
            $arr[] = array(
                "param" => "Shoulder Abduction Frontal",
                "val" => $val, //$val > 0 ? $val : 0,
                "text" => $val . "°",
                "conf" => $conf
            );
            $arr[] = array(
                "param" => "Shoulder Adduction Frontal",
                "val" => $val, //$val < 0 ? abs($val) : 0,
                "text" => $val . "°",
                "conf" => $conf
            );
        }

        // shoulder flexion
        $val = 0;
        /* if (abs($shoulder_rotation) < self::$sensitivity or (abs($shoulder_rotation) >= self::$sensitivity and abs($shoulder_rotation) <= self::$sensitivity + 30)) {
             $val = (Helpers::getAngle3(
                         $data[Helpers::$JOINTS["Torso"]]->real,
                         $data[Helpers::$JOINTS[$side . "Shoulder"]]->real,
                         $data[Helpers::$JOINTS[$side . "Wrist"]]->real
                     ) - 90) * 2 * -1;
         }*/


        /*    $valY = Helpers::getYRotation(
                $data[Helpers::$JOINTS[$side . "Shoulder"]]->orient->Matrix
            );*/

        /*if ($valY >= 40){
            $val = $valY;
        }else {
            $val = (Helpers::getAngle3(
                        $data[Helpers::$JOINTS["Torso"]]->real,
                        $data[Helpers::$JOINTS[$side . "Shoulder"]]->real,
                        $data[Helpers::$JOINTS[$side . "Wrist"]]->real
                    ) - 100) * 2 * -1;
        }*/
        /* $val = (Helpers::getAngle3(
                     $data[Helpers::$JOINTS["Torso"]]->real,
                     $data[Helpers::$JOINTS[$side . "Shoulder"]]->real,
                     $data[Helpers::$JOINTS[$side . "Elbow"]]->real
                 ) - 100) * -1;*/

        /*   $val = Helpers::getAngle2YZ(
                 $data[Helpers::$JOINTS[$side . "Shoulder"]]->real,
                 $data[Helpers::$JOINTS[$side . "Elbow"]]->real
             ) + 90;*/

        /* $val = (Helpers::getAngle3(
                     $data[Helpers::$JOINTS["Torso"]]->real,
                     $data[Helpers::$JOINTS[$side . "Shoulder"]]->real,
                     $data[Helpers::$JOINTS[$side . "Elbow"]]->real
                 ) - 100) * 2 * -1;*/

        /* $val = Helpers::getYRotationsDiff($data[Helpers::$JOINTS[$side . "Shoulder"]]->orient->Matrix,
                 $data[Helpers::$JOINTS["Waist"]]->orient->Matrix) -
             (($side == "Right") ? + 0 : - 0);*/

        if ($data[Helpers::$JOINTS[$side . "Elbow"]]->real->Y - $data[Helpers::$JOINTS[$side . "Shoulder"]]->real->Y >= 0) {
            $val = 180 - abs(Helpers::getYRotation($data[Helpers::$JOINTS[$side . "Shoulder"]]->orient->Matrix));
        } else {
            $val = abs(Helpers::getYRotation($data[Helpers::$JOINTS[$side . "Shoulder"]]->orient->Matrix));
        }

        if ($data[Helpers::$JOINTS[$side . "Elbow"]]->real->Z - $data[Helpers::$JOINTS["Head"]]->real->Z >= 0)
            $val = $val * -1;


        $conf = "1";
        if (isset($data[Helpers::$JOINTS[$side . "Shoulder"]]->confidence)) {
            $conf = $data[Helpers::$JOINTS[$side . "Shoulder"]]->confidence;
        }

        if ($current) {
            $arr[] = array(
                "param" => "Shoulder Flexion",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
        } else {
            $arr[] = array(
                "param" => "Shoulder Flexion",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
            $arr[] = array(
                "param" => "Shoulder Extension",
                "val" => $val,
                "text" => $val . "°",
                "conf" => $conf
            );
        }

        // elbow flexion
        $val = Helpers::getAngle3(
                $data[Helpers::$JOINTS[$side . "Elbow"]]->real,
                $data[Helpers::$JOINTS[$side . "Shoulder"]]->real,
                $data[Helpers::$JOINTS[$side . "Wrist"]]->real
            ) - 180;

        $conf = "1";
        if (isset($data[Helpers::$JOINTS[$side . "Elbow"]]->confidence)) {
            $conf = $data[Helpers::$JOINTS[$side . "Elbow"]]->confidence;
        }

        if ($current) {
            $arr[] = array(
                "param" => "Elbow Flexion",
                "val" => abs($val),
                "text" => abs($val) . "°",
                "conf" => $conf
            );
        } else {
            $arr[] = array(
                "param" => "Elbow Flexion",
                "val" => abs($val), //$val > 0 ? $val : 0,
                "text" => abs($val > 0 ? $val : 0) . "°",
                "conf" => $conf
            );
            $arr[] = array(
                "param" => "Elbow Extension",
                "val" => abs($val), //$val < 0 ? abs($val) : 0,
                "text" => abs($val < 0 ? $val : 0) . "°",
                "conf" => $conf
            );
        }


        // shoulder rotation
        /*  $arr[] = array(
              "param" => "Shoulder Rotation",
              "val" => $shoulder_rotation,
              "text" => abs($shoulder_rotation) . "°"
          );*/

        // shoulder hor. abduction
        /*  $val = Helpers::getAngle2XY(
                  $data[Helpers::$JOINTS[$side . "Shoulder"]]->real,
                  $data[Helpers::$JOINTS[$side . "Elbow"]]->real
              ) + 90;*/

        /* if ($data[Helpers::$JOINTS[$side . "Elbow"]]->real->X - $data[Helpers::$JOINTS[$side . "Shoulder"]]->real->X >= 0) {
             $val =  abs(Helpers::getZRotation($data[Helpers::$JOINTS[$side . "Shoulder"]]->orient->Matrix));
         }else{
             $val = abs(Helpers::getZRotation($data[Helpers::$JOINTS[$side . "Shoulder"]]->orient->Matrix));
         }

         $conf = "1";
         if (isset($data[Helpers::$JOINTS[$side . "Shoulder"]]->confidence)) {
             $conf = $data[Helpers::$JOINTS[$side . "Shoulder"]]->confidence;
         }

         if ($current) {
             $arr[] = array(
                 "param" => "Shoulder Hor. Abduc.",
                 "val" => $val,
                 "text" => abs($val) . "°",
                 "conf" => $conf
             );
         } else {
             $arr[] = array(
                 "param" => "Shoulder Hor. Abduc.",
                 "val" => $val,
                 "text" => abs($val > 0 ? $val : 0) . "°",
                 "conf" => $conf
             );
             $arr[] = array(
                 "param" => "Shoulder Hor. Adduc.",
                 "val" => $val,
                 "text" => abs($val < 0 ? $val : 0) . "°",
                 "conf" => $conf
             );
         }*/

        return $arr;
    }

    private function getSingleData($data, $current = true)
    {
        $arr = array();

        // torso rotation
     /*   $val = Helpers::getYRotation(
                $data[Helpers::$JOINTS["Torso"]]->orient->Matrix
            ) * -1;*/

        $val = (Helpers::getAngle2YZ(
                    $data[Helpers::$JOINTS["Torso"]]->real,
                    $data[Helpers::$JOINTS["Waist"]]->real
                ) + 90) * -1;

        $conf = "1";
        if (isset($data[Helpers::$JOINTS["Torso"]]->confidence)) {
            $conf = $data[Helpers::$JOINTS["Torso"]]->confidence;
        }

        $arr[] = array(
            "param" => "Torso Rotation",
            "val" => $val,
            "text" => $val . "°",
            "conf" => $conf
        );

        // torso flexion
        $val = (Helpers::getAngle2YZ(
                    $data[Helpers::$JOINTS["Neck"]]->real,
                    $data[Helpers::$JOINTS["Waist"]]->real
                ) + 90) * -1;

        $conf = "1";
        if (isset($data[Helpers::$JOINTS["Waist"]]->confidence)) {
            $conf = $data[Helpers::$JOINTS["Waist"]]->confidence;
        }

        $arr[] = array(
            "param" => "Torso Flexion",
            "val" => $val,
            "text" => abs($val) . "°",
            "conf" => $conf
        );

        // torso lateroflexion
        $val = Helpers::getZRotation(
                $data[Helpers::$JOINTS["Torso"]]->orient->Matrix
            ) * -1;

        // $val = $data[Helpers::$JOINTS["Torso"]]->real->Z - $data[Helpers::$JOINTS["RightWrist"]]->real->Z;


        $conf = "1";
        if (isset($data[Helpers::$JOINTS["Torso"]]->confidence)) {
            $conf = $data[Helpers::$JOINTS["Torso"]]->confidence;
        }

        $arr[] = array(
            "param" => "Torso Lateroflexion",
            "val" => $val,
            "text" => abs($val) . "°",
            "conf" => $conf
        );

        // waist flexion
        $val = (Helpers::getAngle2YZ(
                    $data[Helpers::$JOINTS["Torso"]]->real,
                    $data[Helpers::$JOINTS["Waist"]]->real
                ) + 90) * -1;

        $conf = "1";
        if (isset($data[Helpers::$JOINTS["Waist"]]->confidence)) {
            $conf = $data[Helpers::$JOINTS["Waist"]]->confidence;
        }

        $arr[] = array(
            "param" => "Waist Flexion",
            "val" => $val,
            "text" => abs($val) . "°",
            "conf" => $conf
        );


        // Neck Flexion
        $val = (Helpers::getAngle3YZ(
            $data[Helpers::$JOINTS["Head"]]->real,
            $data[Helpers::$JOINTS["Neck"]]->real,
            $data[Helpers::$JOINTS["Waist"]]->real,
        ));

        /* $val = Helpers::getYRotationsDiff(
             $data[Helpers::$JOINTS["Head"]]->orient->Matrix,
             $data[Helpers::$JOINTS["Neck"]]->orient->Matrix
         );*/

        /*$val = ((Helpers::getYRotation(
            $data[Helpers::$JOINTS["Neck"]]->orient->Matrix
        )));*/


        $conf = "1";
        if (isset($data[Helpers::$JOINTS["Waist"]]->confidence)) {
            $conf = $data[Helpers::$JOINTS["Waist"]]->confidence;
        }

        if ($current) {
            $arr[] = array(
                "param" => "Neck Flexion",
                "val" => $val,
                "text" => abs($val) . "°",
                "conf" => $conf
            );
        } else {
            $arr[] = array(
                "param" => "Neck Flexion",
                "val" => $val,
                "text" => abs($val > 0 ? $val : 0) . "°",
                "conf" => $conf
            );
            $arr[] = array(
                "param" => "Pelvis Extension",
                "val" => $val,
                "text" => abs($val < 0 ? $val : 0) . "°",
                "conf" => $conf
            );
        }


        return $arr;
    }

    public static function getTable(Record $record, $json = true)
    {
        $datas = json_decode($record->data);

        $table = array(
            "id" => $record->id,
            "data" => array(
                "leftSide" => array(
                    self::getTableValuesSide("Shoulder Abduction Frontal", $datas, "Left"),
                    self::getTableValuesSide("Shoulder Abduction Transversal", $datas, "Left"),
                    // self::getTableValuesSide("Shoulder Adduction", $datas, "Left"),
                    self::getTableValuesSide("Shoulder Flexion", $datas, "Left"),
                    //   self::getTableValuesSide("Shoulder Extension", $datas, "Left"),
                    self::getTableValuesSide("Elbow Flexion", $datas, "Left"),
                    // self::getTableValuesSide("Elbow Extension", $datas, "Left"),
                    //    self::getTableValuesSide("Shoulder Rotation", $datas, "Left"),
                    //   self::getTableValuesSide("Shoulder Hor. Abduc.", $datas, "Left"),
                    //  self::getTableValuesSide("Shoulder Hor. Adduc.", $datas, "Left"),
                ),
                "rightSide" => array(
                    self::getTableValuesSide("Shoulder Abduction Frontal", $datas, "Right"),
                    self::getTableValuesSide("Shoulder Abduction Transversal", $datas, "Right"),                  //  self::getTableValuesSide("Shoulder Adduction", $datas, "Right"),
                    self::getTableValuesSide("Shoulder Flexion", $datas, "Right"),
                    // self::getTableValuesSide("Shoulder Extension", $datas, "Right"),
                    self::getTableValuesSide("Elbow Flexion", $datas, "Right"),
                    //  self::getTableValuesSide("Elbow Extension", $datas, "Right"),
                    //  self::getTableValuesSide("Shoulder Rotation", $datas, "Right"),
                    //  self::getTableValuesSide("Shoulder Hor. Abduc.", $datas, "Right"),
                    // self::getTableValuesSide("Shoulder Hor. Adduc.", $datas, "Right"),
                ),
                "single" => array(
                    self::getTableValuesSingle("Torso Rotation", $datas),
                    self::getTableValuesSingle("Torso Flexion", $datas),
                    self::getTableValuesSingle("Torso Lateroflexion", $datas),
                    self::getTableValuesSingle("Waist Flexion", $datas),
                    self::getTableValuesSingle("Neck Flexion", $datas),
                )
            )
        );
        if ($json)
            return response()->json($table);
        return array("vals" => $table);
    }

    public static function getTableValuesSide($param, $datas, $side)
    {
        $arr = array(); // array of values of the current parameter

        foreach ($datas as $data) {
            $exc = self::getSideData($side, $data->jointDatas, true);
            foreach ($exc as $p) {
                if ($p["param"] == $param)
                    array_push($arr, $p["val"]);
            }
        }
        if ($arr == null)
            $arr = array(0);


        // flexion, extension, abducaiton...
        /* if (strpos($param, "Flexion") !== false) {
             // Flexion
             foreach ($arr as $index => $value) {
                 if (!self::isValueBiggerThanPreviousX($arr, $index, 3))
                     $arr[$index] = 0;
             }
         }

         if (strpos($param, "Extension") !== false) {
             // Extension
             foreach ($arr as $index => $value) {
                 if (self::isValueBiggerThanPreviousX($arr, $index, 3))
                     $arr[$index] = 0;
             }
         }*/


        return array(
            "Param" => $param,
            "Min" => min($arr),
            "Max" => max($arr),
            "Avg" => Helpers::avg($arr),
        );
    }

    public static function isValueBiggerThanPreviousX($arr, $index, $previous_x)
    {
        if (count($arr) > $previous_x) {
            for ($i = 0; $i < $previous_x; $i++) {
                if ($arr[$index] >= $arr[(count($arr) - 1) - $i]) {
                    return true;
                }
            }
        }
        return false;
    }

    public static function getTableValuesSingle($param, $datas)
    {
        $arr = array(); // array of values of the current parameter

        foreach ($datas as $data) {
            $exc = self::getSingleData($data->jointDatas, true);
            foreach ($exc as $p) {
                if ($p["param"] == $param)
                    array_push($arr, $p["val"]);
            }
        }

        return array(
            "Param" => $param,
            "Min" => min($arr),
            "Max" => max($arr),
            "Avg" => Helpers::avg($arr),
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
            array_push($times, ($unixMillies ? $milli . " / " . $data->date : $milli / 1000));
            $milli = $milli + 40;
        }

        // Left Side chart
        $side = "Left";
        $labels_sides = array(
            $side . " Shoulder Abduction Frontal",
            $side . " Shoulder Abduction Transversal",
            $side . " Shoulder Flexion",
            $side . " Elbow Flexion",
        );

        foreach ($labels_sides as $label) {
            $dataset = array();
            foreach ($datas as $data) {
                $exc = self::getSideData("Left", $data->jointDatas, false);
                foreach ($exc as $p) {
                    if ($p["param"] == str_replace("Left ", "", $label))
                        array_push($dataset, $p["val"]);
                }
            }

            /*   if (strpos($label, "Flexion") !== false) {
                   for ($i = 0; $i < count($dataset); $i++)
                       if ($i > 0){
                           if (abs(abs($dataset[$i - 1]) - abs($dataset[$i])) >= 100){
                               // bad value, do optimalization

                       }
                   }
               }*/


            // flexion, extension, abducaiton...
            /*  if (strpos($label, "Flexion") !== false) {
                  // Flexion
                  foreach ($dataset as $index => $val) {
                      if (!self::isValueBiggerThanPreviousX($dataset, $index, 3))
                          $dataset[$index] = 0;
                  }
              }

              if (strpos($label, "Extension") !== false) {
                  // Extension
                  foreach ($dataset as $index => $val) {
                      if (self::isValueBiggerThanPreviousX($dataset, $index, 3))
                          $dataset[$index] = 0;
                  }
              }*/


            $datasets[] = array(
                "param" => $label . (str_contains($label, "Flexion") ? " / Extension" : " / Adduction"),
                "data" => $dataset
            );
        }

// Right side
        $side = "Right";
        $labels_sides = array(
            $side . " Shoulder Abduction Frontal",
            $side . " Shoulder Abduction Transversal",
            $side . " Shoulder Flexion",
            $side . " Elbow Flexion",
        );

        foreach ($labels_sides as $label) {
            $dataset = array();
            foreach ($datas as $data) {
                $exc = self::getSideData("Right", $data->jointDatas, false);
                foreach ($exc as $p) {
                    if ($p["param"] == str_replace("Right ", "", $label))
                        array_push($dataset, $p["val"]);
                }
            }
            $datasets[] = array(
                "param" => $label . (str_contains($label, "Flexion") ? " / Extension" : " / Adduction"),
                "data" => $dataset
            );
        }


// Single data
        $labels = array(
            "Torso Rotation",
            "Torso Flexion",
            "Torso Lateroflexion",
            "Waist Flexion",
            "Neck Flexion"
        );

        foreach ($labels as $label) {
            $dataset = array();
            foreach ($datas as $data) {
                $exc = self::getSingleData($data->jointDatas, false);
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

    function is_undefined(&$test)
    {
        return isset($test) && !is_null($test);
    }
}
