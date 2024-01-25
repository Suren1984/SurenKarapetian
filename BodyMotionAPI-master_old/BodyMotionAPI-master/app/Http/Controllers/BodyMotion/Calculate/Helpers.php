<?php

namespace App\Http\Controllers\BodyMotion\Calculate;

class Helpers
{
    public static $JOINTS = array(
        "Head" => 1,
        "Neck" => 2,
        "Torso" => 3,
        "Waist" => 4,
        "LeftCollar" => 5,
        "LeftShoulder" => 6,
        "LeftElbow" => 7,
        "LeftWrist" => 8,
        "LeftHand" => 9,
        "LeftFinertip" => 10,
        "RightCollar" => 11,
        "RightShoulder" => 12,
        "RightElbow" => 13,
        "RightWrist" => 14,
        "RightHand" => 15,
        "RightFingertip" => 16,
        "LeftHip" => 17,
        "LeftKnee" => 18,
        "LeftAnkle" => 19,
        "LeftFoot" => 20,
        "RightHip" => 21,
        "RightKnee" => 22,
        "RightAnkle" => 23,
        "RightFoot" => 24,
    );

    public static function getXRotation($matrix)
    { //0 3 6
        return round(atan2($matrix[7], $matrix[8]) * (180 / pi()));
    }

    public static function getYRotation($matrix)
    { // 1 4 7
        $sy = sqrt($matrix[0] * $matrix[0] + $matrix[3] * $matrix[3]);
        return round(atan2(-$matrix[6], $sy) * (180 / pi()));
    }

    public static function getZRotation($matrix)
    { // 2 5 8
        return round(atan2($matrix[3], $matrix[0]) * (180 / pi()));
    }

    public static function GetCMDifference($a, $b)
    {
        return round(($a - $b) / 10, 1);
    }

    public static function getAngle3($AR, $BR, $CR)
    {
        $A = array($AR->X, $AR->Y, $AR->Z);
        $B = array($BR->X, $BR->Y, $BR->Z);
        $C = array($CR->X, $CR->Y, $CR->Z);

        $ab = self::dist($A, $B);
        $bc = self::dist($B, $C);
        $ac = self::dist($A, $C);

        $radians = (pow($ab, 2) + pow($bc, 2) - pow($ac, 2)) /
            (2 * $ab * $bc);

        $targetToParentVector = self::calculateVector($A, $B);
        $targetToChildVector = self::calculateVector($A, $C);

        $dot = self::dot($targetToParentVector, $targetToChildVector);
        $maga = sqrt(
            pow($targetToParentVector[0], 2) +
            pow($targetToParentVector[1], 2) +
            pow($targetToParentVector[2], 2)
        );
        $magb = sqrt(
            pow($targetToChildVector[0], 2) +
            pow($targetToChildVector[1], 2) +
            pow($targetToChildVector[2], 2)
        );

        return round(acos($dot / ($maga * $magb)) * (180 / pi()));

        $abNorm = array();

        $radians = acos(self::dot($targetToParentVector, $targetToChildVector) /
            (count($targetToParentVector) * count($targetToChildVector)));
        return round($radians * (180 / pi()));
    }

    private static function dist($p1, $p2)
    {
        return sqrt(
            pow($p1[0] - $p2[0], 2) +
            pow($p1[1] - $p2[1], 2) +
            pow($p1[2] - $p2[2], 2)
        );
    }

    private static function calculateVector($V1, $V2)
    {
        $res = array();
        for ($i = 0; $i < count($V1); $i++) {
            $res[$i] = $V1[$i] - $V2[$i];
        }
        return $res;
    }

    public static function getAngle3XY($P1, $P2, $P3)
    {
        $v = atan2($P3->Y - $P1->Y, $P3->X - $P1->X) -
            atan2($P2->Y - $P1->Y, $P2->X - $P1->X);
        return round($v * (180 / pi()));
    }

    public static function getAngle3YZ($P1, $P2, $P3)
    {
        $v = atan2($P3->Y - $P1->Y, $P3->Z - $P1->Z) -
            atan2($P2->Y - $P1->Y, $P2->Z - $P1->Z);
        return round($v * (180 / pi()));
    }

    public static function getAngle3XZ($P1, $P2, $P3)
    {
        $v = atan2($P3->Z - $P1->Z, $P3->X - $P1->X) -
            atan2($P2->Z - $P1->Z, $P2->X - $P1->X);
        return round($v * (180 / pi()));
    }

    private static function norm($vec)
    {
        $norm = 0;
        $components = count($vec);

        for ($i = 0; $i < $components; $i++)
            $norm += $vec[$i] * $vec[$i];

        return sqrt($norm);
    }

    private static function dot($vec1, $vec2)
    {
        $prod = 0;
        $components = count($vec1);

        for ($i = 0; $i < $components; $i++)
            $prod += ($vec1[$i] * $vec2[$i]);

        return $prod;
    }

    public static function getXRotationsDiff($M1, $M2)
    {
        return self::getXRotation($M1) - self::getXRotation($M2);
    }

    public static function getYRotationsDiff($M1, $M2)
    {
        return self::getYRotation($M1) - self::getYRotation($M2);
    }

    public static function getZRotationsDiff($M1, $M2)
    {
        return self::getZRotation($M1) - self::getZRotation($M2);
    }

    public static function getAngle2XY($A, $B)
    {
        $xDiff = $B->X - $A->X;
        $yDiff = $B->Y - $A->Y;
        return round(atan2($yDiff, $xDiff) * 180.0 / pi());
    }

    public static function getAngle2XZ($A, $B)
    {
        $xDiff = $B->X - $A->X;
        $yDiff = $B->Z - $A->Z;
        return round(atan2($yDiff, $xDiff) * 180.0 / pi());
    }

    public static function getAngle2YZ($A, $B)
    {
        $xDiff = $B->Z - $A->Z;
        $yDiff = $B->Y - $A->Y;
        return round(atan2($yDiff, $xDiff) * (180.0 / pi()));
    }

    public static function avg($a)
    {
        return round(array_sum($a) / count($a), 1);
    }

    public static function med($arr)
    {
        $num = count($arr);
        $middleVal = floor(($num - 1) / 2);
        if ($num % 2) {
            return $arr[$middleVal];
        } else {
            $lowMid = $arr[$middleVal];
            $highMid = $arr[$middleVal + 1];
            return round((($lowMid + $highMid) / 2));
        }
    }

    public static function getShare($arr, $from, $to)
    {
        $count = 0;
        foreach ($arr as $val) {
            if (abs(round($val, 0)) >= $from and abs(round($val, 0)) <= $to)
                $count = $count + 1;
        }
        $all = count($arr);
        $countSeconds = round(($count * 250) / 1000, 1);
        if ($count > 0)
            return round(($count * 100) / $all, 0) . "% - " . $countSeconds . " s";
        return "";
    }

    public static function rangeOfMotion($arr)
    {
        return round(abs(min($arr))) . "° - " . round(abs(max($arr))) . "°";
    }

}
