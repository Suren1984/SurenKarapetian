<?php

namespace App\Modules;

class Spine
{
    public function getTable(string $json)
    {
        // Array with values
        $params = array(
            'Cervical Rotation' => array(),
            'Torso Rotation' => array(),
            'Laterocaput' => array(),
            'Laterocollis' => array(),
            'Anterocaput' => array(),
            'Anterocollis' => array(),
            'Retrocaput' => array(),
            'Retrocollis' => array(),
            'Torso Flexion' => array(),
            'Torso Lateroflexion' => array(),
            'Waist Flexion' => array()
        );

        // Get JSON data from DB
        $datas = json_decode($json);
        // Data from JSON Object to PHP arrays
        foreach ($datas as $data) {
            array_push($params["Cervical Rotation"], $data->Rotation);
            array_push($params["Torso Rotation"], $data->TorsoRotation);
            array_push($params["Laterocaput"], $data->Laterocaput);
            array_push($params["Laterocollis"], $data->Laterocollis);
            array_push($params["Anterocaput"], $data->Anterocaput);
            array_push($params["Anterocollis"], $data->Anterocollis);
            array_push($params["Retrocaput"], $data->Retrocaput);
            array_push($params["Retrocollis"], $data->Retrocollis);
            array_push($params["Torso Flexion"], $data->TorsoFlexion);
            array_push($params["Torso Lateroflexion"], $data->TorsoLateroflexion);
            array_push($params["Waist Flexion"], $data->WaistFlexion);
        }

        $table = array();
        // Header
        $table[] = array(
            'space',
            'Maximal',
            'Average',
            'Median',
            '0 - 14',
            '15 - 29',
            '30 - 44',
            '45+'
        );

        // Table content
        foreach ($params as $key => $param) {
            $side = true;
            if ($key == "Anterocaput" or $key == "Anterocollis" or $key == "Retrocaput" or $key == "Retrocollis")
                $side = false;
            $table[] = array(
                $key,
                abs(max($param)) > 0 ? abs(max($param)) . ($side ? "° left" : "°") : abs(min($param)) . ($side ? "° right" : "°"),
                Helpers::avg(($param)) > 0 ? abs(Helpers::avg($param)) . ($side ? "° left" : "°") : abs(Helpers::avg($param)) . ($side ? "° right" : "°"),
                Helpers::med(($param)) > 0 ? abs(Helpers::med($param)) . ($side ? "° left" : "°") : abs(Helpers::med($param)) . ($side ? "° right" : "°"),
                Helpers::getShare($param, 1, 14),
                Helpers::getShare($param, 15, 29),
                Helpers::getShare($param, 30, 44),
                Helpers::getShare($param, 45, 150),
            );
        }
        return $table;
    }
}
