<?php

namespace App\Modules;

use Faker\Extension\Helper;

class Gait
{
    public function getTable(string $json)
    {
        // Array with values
        $paramsRight = array(
            'Hip Flexion' => array(),
            'Knee Flexion' => array(),
            'Ankle Flexion' => array(),
            'Hip Abduction Frontal' => array(),
            'Hip Abduction Transversal' => array(),
            'Knee Abduction' => array(),
        );

        $paramsRight2 = array(
            'Step Length' => array(),
            'Step Time' => array(),
            'Step Width' => array(),
            'Stride Length' => array(),
            'Stride Time' => array(),
            'Hip Variation' => array(),
            'Knee Variation' => array(),
            'Ankle Variation' => array(),
        );

        $paramsSingle = array(
            'Neck Flexion' => array(),
            'Body Speed' => array(),
            'Cadence' => array(),
            'Double Support Time' => array(),
            'Swing Time' => array(),
            'Step Assymetry' => array(),
            'Stride Assymetry' => array(),
        );

        $paramsLeft = $paramsRight;
        $paramsLeft2 = $paramsRight2;

        // Get JSON data from DB right
        $datas = json_decode($json);
        // Data from JSON Object to PHP arrays
        foreach ($datas as $data) {
            array_push($paramsLeft["Hip Flexion"], $data->Left->HipFlexion);
            array_push($paramsLeft["Knee Flexion"], $data->Left->KneeFlexion);
            array_push($paramsLeft["Ankle Flexion"], $data->Left->AnkleFlexion);
            array_push($paramsLeft["Hip Abduction Frontal"], $data->Left->HipAbduction);
            array_push($paramsLeft["Hip Abduction Transversal"], $data->Left->HipAbduction);
            array_push($paramsLeft["Knee Abduction"], $data->Left->KneeAbduction);
            array_push($paramsLeft2["Step Length"], $data->Left->StepLength);
            array_push($paramsLeft2["Step Time"], $data->Left->StepTime);
            array_push($paramsLeft2["Step Width"], $data->Left->StepWidth);
            array_push($paramsLeft2["Stride Length"], $data->Left->StrideLength);
            array_push($paramsLeft2["Stride Time"], $data->Left->StrideTime);
            array_push($paramsLeft2["Hip Variation"], $data->Left->HipVariation);
            array_push($paramsLeft2["Knee Variation"], $data->Left->KneeVariation);
            array_push($paramsLeft2["Ankle Variation"], $data->Left->AnkleVariation);

            array_push($paramsRight["Hip Flexion"], $data->Right->HipFlexion);
            array_push($paramsRight["Knee Flexion"], $data->Right->KneeFlexion);
            array_push($paramsRight["Ankle Flexion"], $data->Right->AnkleFlexion);
            array_push($paramsRight["Hip Abduction Frontal"], $data->Right->HipAbduction);
            array_push($paramsRight["Hip Abduction Transversal"], $data->Right->HipAbduction);
            array_push($paramsRight["Knee Abduction"], $data->Right->KneeAbduction);
            array_push($paramsRight2["Step Length"], $data->Right->StepLength);
            array_push($paramsRight2["Step Time"], $data->Right->StepTime);
            array_push($paramsRight2["Step Width"], $data->Right->StepWidth);
            array_push($paramsRight2["Stride Length"], $data->Right->StrideLength);
            array_push($paramsRight2["Stride Time"], $data->Right->StrideTime);
            array_push($paramsRight2["Hip Variation"], $data->Right->HipVariation);
            array_push($paramsRight2["Knee Variation"], $data->Right->KneeVariation);
            array_push($paramsRight2["Ankle Variation"], $data->Right->AnkleVariation);

            array_push($paramsSingle["Neck Flexion"], $data->GaitDataSingle->PelvisFlexion);
            array_push($paramsSingle["Body Speed"], $data->GaitDataSingle->BodySpeed);
            array_push($paramsSingle["Cadence"], $data->GaitDataSingle->Cadence);
            array_push($paramsSingle["Double Support Time"], $data->GaitDataSingle->DoubleSupportTime);
            array_push($paramsSingle["Swing Time"], $data->GaitDataSingle->SwingTime);
            array_push($paramsSingle["Step Assymetry"], $data->GaitDataSingle->StepAsymmetry);
            array_push($paramsSingle["Stride Assymetry"], $data->GaitDataSingle->StepAsymmetry);
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
            'Average'
        );

        // Table content
        foreach ($paramsRight as $key => $param) {
            $paramLeft = $paramsLeft[$key];
            $side = false;
            $table[] = array(
                $key,
                round(min($param), 1) . $this->GetUnits($key),
                round(max($param), 1) . $this->GetUnits($key),
                round(Helpers::avg(($param)), 1) . $this->GetUnits($key),
                'spacesmall',
                round(min($paramLeft), 1) . $this->GetUnits($key),
                round(max($paramLeft), 1) . $this->GetUnits($key),
                round(Helpers::avg(($paramLeft)), 1) . $this->GetUnits($key),
            );
        }


        //Second table
        $table[] = array('newline');
        $table[] = array('space');
        $table[] = array('newline');
        $table[] = array('space');
        $table[] = array('newtable');


        $table[] = array(
            'space',
            'Value',
            'space',
            'space',
            'spacesmall',
            'Value',
            'space',
            'space'
        );

        // Table content
        foreach ($paramsRight2 as $key => $param) {
            $paramLeft = $paramsLeft2[$key];
            $table[] = array(
                $key,
                round($param[count($param) - 1], 1) . $this->GetUnits($key),
                'space',
                'space',
                'spacesmall',
                round($paramLeft[count($paramLeft) - 1], 1) . $this->GetUnits($key),
                'space',
                'space'
            );
        }

        // Third table
        $table[] = array('newline');
        $table[] = array('space');
        $table[] = array('newline');
        $table[] = array('space');
        $table[] = array('newtable');

        // Header
        $table[] = array(
            'space',
            'space',
            'space',
            'Value',
        );

        // Table content
        foreach ($paramsSingle as $key => $param) {
            $table[] = array(
                'space',
                'space',
                $key,
                round($param[count($param) - 1], 2) . $this->GetUnits($key),
            );
        }
        return $table;
    }

    private function GetUnits($key): string
    {
        $degrees = ["Hip Flexion", "Knee Flexion", "Ankle Flexion", "Hip Abduction Frontal", "Hip Abduction Transversal", "Knee Abduction",
            "Neck Flexion"];
        $meters = [];
        $centimeters = ["Hip Variation", "Knee Variation", "Ankle Variation", "Stride Length", "Step Length", "Step Width", "Step Assymetry", "Stide Assymetry"];
        $seconds = ["Stride Time", "Step Time", "Swing Time", "Double Support Time"];
        $steps_per_min = ["Cadence"];
        $meters_per_second = ["Body Speed"];

        if (in_array($key, $degrees))
            return "°";
        if (in_array($key, $meters))
            return "m";
        if (in_array($key, $centimeters))
            return "cm";
        if (in_array($key, $seconds))
            return "s";
        if (in_array($key, $steps_per_min))
            return "step/min";
        if (in_array($key, $meters_per_second))
            return "m/s";
        return "";
    }
}
