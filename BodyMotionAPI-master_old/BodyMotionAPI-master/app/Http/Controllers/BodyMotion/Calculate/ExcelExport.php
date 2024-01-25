<?php

namespace App\Http\Controllers\BodyMotion\Calculate;

use App\Exports\DataExport;
use App\Exports\Patient;
use App\Models\Record;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ExcelExport
{

    /**
     * @return \Illuminate\Support\Collection
     */
    public function download(Record $record)
    {
        $patient = array(
            array(
                "Firstname",
                $record->patient->first_name
            ),
            array(
                "Surname",
                $record->patient->surname
            ),
            array(
                "E-Mail",
                $record->patient->email
            ),
            array(
                "Since",
                $record->patient->since
            ),
            array(
                "Height",
                $record->patient->height
            ),
            array(
                "Weight",
                $record->patient->weight
            ),
            array(
                "Examination date",
                $record->created_at
            ),
            array(
                "Module",
                $record->module
            ),
        );


        $arr = array();
        $arr_by_time = array();
        switch ($record->module) {
            case "dystonia":
                $input = DystoniaController::getChart($record, true);
                $table = DystoniaController::getTable($record, false);
                break;
            case "posture":
                $input = PostureController::getChart($record, true);
                $table = PostureController::getTable($record, false);
                break;
            case "gait":
                $gaitController = new GaitController();
                $input = $gaitController->getChart($record, true);
                $table = $gaitController->getTable($record, false);
                break;
            case "fullbody":
                $fullbodyController = new FullbodyController();
                $input = $fullbodyController->getChart($record, true);
                $table = $fullbodyController->getTable($record, false);
                break;
        }

        if ($record->module != "fullbody") {
            // data
            $row = array(
                "Left Side",
                '',
                '',
                '',
                '',
                "Right Side"
            );
            array_push($arr_by_time, $row);
            $row = array(
                '',
            );
            array_push($arr_by_time, $row);

            $row = array(
                "",
                'Min',
                'Max',
                'Average',
                '',
                '',
                'Min',
                'Max',
                'Average',
            );
            array_push($arr_by_time, $row);


            $col = array();
            $left = $table["vals"]['data']["leftSide"];
            $right = $table["vals"]['data']["rightSide"];
            $single = $table["vals"]['data']["single"];


            for ($i = 0; $i < count($left); $i++) {
                $row = array();
                array_push($row, $left[$i]["Param"]);
                array_push($row, $left[$i]["Min"]);
                array_push($row, $left[$i]["Max"]);
                array_push($row, $left[$i]["Avg"]);
                array_push($row, '');
                array_push($row, '');
                array_push($row, $right[$i]["Min"]);
                array_push($row, $right[$i]["Max"]);
                array_push($row, $right[$i]["Avg"]);
                array_push($arr_by_time, $row);
            }

            $row = array(
                '',
            );
            array_push($arr_by_time, $row);

            $row = array(
                'Single data',
            );
            array_push($arr_by_time, $row);
            $row = array(
                "",
                'Min',
                'Max',
                'Average',
            );
            array_push($arr_by_time, $row);
            for ($i = 0; $i < count($single); $i++) {
                $row = array();
                array_push($row, $single[$i]["Param"]);
                array_push($row, $single[$i]["Min"]);
                array_push($row, $single[$i]["Max"] ?? '');
                array_push($row, $single[$i]["Avg"]);
                array_push($arr_by_time, $row);
            }



            // data by time
            $date_arr = array();
            foreach ($input[0] as $date) {
                array_push($date_arr, $date);
            }
            array_push($arr, $date_arr);

            foreach ($input[1] as $param) {
                $param_arr = array();
                array_push($param_arr, $param["param"]);
                foreach ($param["data"] as $excursion) {
                    array_push($param_arr, $excursion);
                }
                array_push($arr, $param_arr);
            }

        } else {
            //data
            $row = array(
                "Left Side",
                '',
                '',
                '',
                '',
                "Right Side"
            );
            array_push($arr_by_time, $row);
            $row = array(
                '',
            );
            array_push($arr_by_time, $row);

            $row = array(
                "",
                'Min',
                'Max',
                'Average',
                '',
                '',
                'Min',
                'Max',
                'Average',
            );
            array_push($arr_by_time, $row);

            $col = array();
            $posture_left = $table["vals"]["posture"]["vals"]['data']["leftSide"];
            $posture_right = $table["vals"]["posture"]["vals"]['data']["rightSide"];
            $gait_left = $table["vals"]["gait"]["vals"]['data']["leftSide"];
            $gait_right = $table["vals"]["gait"]["vals"]['data']["rightSide"];
            $posture_single = $table["vals"]["gait"]["vals"]['data']["single"];
            $gait_single = $table["vals"]["gait"]["vals"]['data']["single"];


            for ($i = 0; $i < count($posture_left); $i++) {
                $row = array();
                array_push($row, $posture_left[$i]["Param"]);
                array_push($row, $posture_left[$i]["Min"]);
                array_push($row, $posture_left[$i]["Max"]);
                array_push($row, $posture_left[$i]["Avg"]);
                array_push($row, '');
                array_push($row, '');
                array_push($row, $posture_right[$i]["Min"]);
                array_push($row, $posture_right[$i]["Max"]);
                array_push($row, $posture_right[$i]["Avg"]);
                array_push($arr_by_time, $row);
            }

            for ($i = 0; $i < count($gait_left); $i++) {
                $row = array();
                array_push($row, $gait_left[$i]["Param"]);
                array_push($row, $gait_left[$i]["Min"]);
                array_push($row, $gait_left[$i]["Max"]);
                array_push($row, $gait_left[$i]["Avg"]);
                array_push($row, '');
                array_push($row, '');
                array_push($row, $gait_right[$i]["Min"]);
                array_push($row, $gait_right[$i]["Max"]);
                array_push($row, $gait_right[$i]["Avg"]);
                array_push($arr_by_time, $row);
            }
            $row = array(
                '',
            );
            array_push($arr_by_time, $row);

            $row = array(
                'Single data',
            );
            array_push($arr_by_time, $row);
            $row = array(
                "",
                'Min',
                'Max',
                'Average',
            );
            array_push($arr_by_time, $row);
            for ($i = 0; $i < count($posture_single); $i++) {
                $row = array();
                array_push($row, $posture_single[$i]["Param"]);
                array_push($row, $posture_single[$i]["Min"]);
                array_push($row, $posture_single[$i]["Max"] ?? '');
                array_push($row, $posture_single[$i]["Avg"]);
                array_push($arr_by_time, $row);
            }

            for ($i = 0; $i < count($gait_single); $i++) {
                $row = array();
                array_push($row, $gait_single[$i]["Param"]);
                array_push($row, $gait_single[$i]["Min"]);
                array_push($row, $gait_single[$i]["Max"] ?? '');
                array_push($row, $gait_single[$i]["Avg"]);
                array_push($arr_by_time, $row);
            }


            // data by time
            $date_arr = array();
            foreach ($input["posture"][0] as $date) {
                array_push($date_arr, $date);
            }
            array_push($arr, $date_arr);

            foreach ($input["posture"][1] as $param) {
                $param_arr = array();
                array_push($param_arr, $param["param"]);
                foreach ($param["data"] as $excursion) {
                    array_push($param_arr, $excursion);
                }
                array_push($arr, $param_arr);
            }
            foreach ($input["gait"][1] as $param) {
                $param_arr = array();
                array_push($param_arr, $param["param"]);
                foreach ($param["data"] as $excursion) {
                    array_push($param_arr, $excursion);
                }
                array_push($arr, $param_arr);
            }
        }

        return Excel::download(new DataExport($patient, $arr_by_time, $arr), 'data.xlsx');
    }
}