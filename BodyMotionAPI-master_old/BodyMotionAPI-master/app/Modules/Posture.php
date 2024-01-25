<?php

namespace App\Modules;

use Faker\Extension\Helper;

class Posture
{
    public function getTable(string $json)
    {
        // Array with values
        $paramsRight = array(
            'Shoulder Abduction' => array(),
            'Shoulder Flexion' => array(),
            'Elbow Flexion' => array(),
            'Wrist Flexion' => array(),
            'Shoulder Rotation' => array(),
            'Shoul. Hor. Abduction' => array(),
            'Shoul. Hor. Adduction' => array()
        );

        $paramsSingle = array(
          'Torso Rotation' => array(),
          'Torso Flexion' => array(),
          'Torso Lateroflexion' => array(),
          'Waist Flexion' => array()
        );

        $paramsLeft = $paramsRight;

        // Get JSON data from DB right
        $datas = json_decode($json);
        // Data from JSON Object to PHP arrays
        foreach ($datas as $data) {
            array_push($paramsLeft["Shoulder Abduction"], $data->Left->ShoulderAbduction);
            array_push($paramsLeft["Shoulder Flexion"], $data->Left->ShoulderFlexion);
            array_push($paramsLeft["Elbow Flexion"], $data->Left->ElbowFlexion);
            array_push($paramsLeft["Wrist Flexion"], $data->Left->WristFlexion);
            array_push($paramsLeft["Shoulder Rotation"], $data->Left->ShoulderRotation);
            array_push($paramsLeft["Shoul. Hor. Abduction"], $data->Left->ElbowRotation);
            array_push($paramsLeft["Shoul. Hor. Adduction"], $data->Left->WristRotation);

            array_push($paramsRight["Shoulder Abduction"], $data->Right->ShoulderAbduction);
            array_push($paramsRight["Shoulder Flexion"], $data->Right->ShoulderFlexion);
            array_push($paramsRight["Elbow Flexion"], $data->Right->ElbowFlexion);
            array_push($paramsRight["Wrist Flexion"], $data->Right->WristFlexion);
            array_push($paramsRight["Shoulder Rotation"], $data->Right->ShoulderRotation);
            array_push($paramsRight["Shoul. Hor. Abduction"], $data->Right->ElbowRotation);
            array_push($paramsRight["Shoul. Hor. Adduction"], $data->Right->WristRotation);

            array_push($paramsSingle["Torso Rotation"], $data->TorsoRotation);
            array_push($paramsSingle["Torso Flexion"], $data->TorsoFlexion);
            array_push($paramsSingle["Torso Lateroflexion"], $data->TorsoLateroflexion);
        }

        $table = array();
        // Header

        $table[] = array(
            'titleLabel-Left',
            'space',
            'space',
            'space',
            'spacesmall',
            'titleLabel-Right',
            'space',
            'space'
        );

        $table[] = array(
            'space',
            'headerDouble',
            'space',
            'spacesmall',
            'headerDouble',
            'space'
        );

        $table[] = array(
            'space',
            'Minimal',
            'Maximal',
            'Average',
            'spacesmall',
            'Minimal',
            'Maximal',
            'Average',
        );

        // Table content
        foreach ($paramsRight as $key => $param) {
            $paramLeft = $paramsLeft[$key];
            $side = false;
            $table[] = array(
                $key,
                round(min($param)) . "°",
                (max($param)) > 0 ? (max($param)) . ($side ? "° left" : "°") : (min($param)) . ($side ? "° right" : "°"),
                Helpers::avg(($param)) > 0 ? (Helpers::avg($param)) . ($side ? "° left" : "°") : (Helpers::avg($param)) . ($side ? "° right" : "°"),
                'spacesmall',
                round(min($paramLeft)),
                (max($paramLeft)) > 0 ? (max($paramLeft)) . ($side ? "° left" : "°") : (min($paramLeft)) . ($side ? "° right" : "°"),
                Helpers::avg(($paramLeft)) > 0 ? abs(Helpers::avg($paramLeft)) . ($side ? "° left" : "°") : abs(Helpers::avg($paramLeft)) . ($side ? "° right" : "°"),
            );
        }

        // Second table
        $table[] = array('newline');
        $table[] = array('space');
        $table[] = array('newtable');


        $table[] = array(
            'space',
            'Minimal',
            'Maximal',
            'Average',
        );

        // Table content
        foreach ($paramsSingle as $key => $param) {
            $table[] = array(
                $key,
                round(min($param)) . "°",
                round(max($param)) . "°",
                Helpers::avg(($param)) . "°"
            );
        }

        return $table;
    }
}
