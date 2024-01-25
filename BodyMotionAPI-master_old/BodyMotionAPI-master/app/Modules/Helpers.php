<?php

namespace App\Modules;

class Helpers
{
    public static function avg($a){
        return round(array_sum($a)/count($a), 1);
    }

    public static function med($arr) {
        $num = count($arr);
        $middleVal = floor(($num - 1) / 2);
        if($num % 2) {
            return $arr[$middleVal];
        }
        else {
            $lowMid = $arr[$middleVal];
            $highMid = $arr[$middleVal + 1];
            return round((($lowMid + $highMid) / 2));
        }
    }

    public static function getShare($arr, $from, $to): string
    {
        $count = 0;
        foreach ($arr as $val){
            if (abs(round($val,0)) >= $from and abs(round($val, 0)) <= $to)
                $count = $count + 1;
        }
        $all = count($arr);
        $countSeconds = round(($count * 250) / 1000, 1);
        if ($count > 0)
            return round(($count * 100) / $all, 0) . "% - " . $countSeconds . " sec";
        return "";
    }

    public static function rangeOfMotion($arr){
        return round(abs(min($arr))) . "° - " . round(abs(max($arr))) . "°";
    }
}
