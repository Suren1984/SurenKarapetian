<?php

namespace App\Http\Controllers\BodyMotion\Calculate;

use App\Http\Controllers\BodyMotion\Calculate\Objects\StepData;
use App\Http\Controllers\BodyMotion\Calculate\Objects\VariationsData;

class StepStride
{
    private $leftFoot = array();
    private $rightFoot = array();
    private $footPosition = array();
    private $accuracy = 25;
    private $interval = 50;
    private $stepDatasLeft = array();
    private $stepDatasRight = array();
    private $variationsDataLeft = array();
    private $variationsDataRight = array();

    public function AddData($data)
    {
        array_push($this->leftFoot, $data[Helpers::$JOINTS["LeftAnkle"]]->real);
        array_push($this->rightFoot, $data[Helpers::$JOINTS["RightAnkle"]]->real);

        $variationsDataLeft = new VariationsData();
        $variationsDataLeft->knee = $data[Helpers::$JOINTS["LeftKnee"]]->real;
        $variationsDataLeft->ankle = $data[Helpers::$JOINTS["LeftAnkle"]]->real;
        $variationsDataLeft->hip = $data[Helpers::$JOINTS["LeftHip"]]->real;
        array_push($this->variationsDataLeft, $variationsDataLeft);

        $variationsDataRight = new VariationsData();
        $variationsDataRight->knee = $data[Helpers::$JOINTS["RightKnee"]]->real;
        $variationsDataRight->ankle = $data[Helpers::$JOINTS["RightAnkle"]]->real;
        $variationsDataRight->hip = $data[Helpers::$JOINTS["RightHip"]]->real;
        array_push($this->variationsDataRight, $variationsDataRight);

        $leftFootY = $this->leftFoot[count($this->leftFoot) - 1]->Y;
        $rightFootY = $this->rightFoot[count($this->rightFoot) - 1]->Y;

        if ($leftFootY >= $rightFootY - $this->accuracy && $leftFootY <= $rightFootY + $this->accuracy) {
            array_push($this->footPosition, "Both");
        } else {
            if ($leftFootY > $rightFootY) {
                array_push($this->footPosition, "Right");
            } else {
                array_push($this->footPosition, "LEFT");
            }
        }

        $this->stepDatasLeft = array();
        $this->stepDatasRight = array();
        $this->Calculate("Right");
        $this->Calculate("Left");
    }

    public function get()
    {
        return $this->variationsDataLeft;
    }

    public function GetStepLength($side)
    {
        $stepDatas = $side == "Left" ? $this->stepDatasLeft : $this->stepDatasRight;
        if (count($stepDatas) > 0) {
            $sum = array();
            foreach ($stepDatas as $stepData) {
                array_push($sum, $stepData->length);
            }
            return Helpers::avg($sum) / 10;
        }
        return 0;
    }

    public function GetStepTime($side)
    {
        $stepDatas = $side == "Left" ? $this->stepDatasLeft : $this->stepDatasRight;
        if (count($stepDatas) > 0) {
            $sum = array();
            foreach ($stepDatas as $stepData) {
                array_push($sum, $stepData->time);
            }
            return Helpers::avg($sum);
        }
        return 0;
    }

    public function GetStepWidth($side)
    {
        $stepDatas = $side == "Left" ? $this->stepDatasLeft : $this->stepDatasRight;
        if (count($stepDatas) > 0) {
            $sum = array();
            foreach ($stepDatas as $stepData) {
                array_push($sum, $stepData->width);
            }
            return Helpers::avg($sum) / 10;
        }
        return 0;
    }

    public function GetHipVariation($side)
    {
        $vDatas = $side == "Left" ? $this->variationsDataLeft : $this->variationsDataRight;
        if (count($vDatas) > 0) {
            $sum = array();
            foreach ($vDatas as $vData) {
                array_push($sum, $vData->hip->Y);
            }
            return round((abs(max($sum)) - abs(min($sum))) / 10, 2);
        }
        return 0;
    }

    public function GetAnkleVariation($side)
    {
        $vDatas = $side == "Left" ? $this->variationsDataLeft : $this->variationsDataRight;
        if (count($vDatas) > 0) {
            $sum = array();
            foreach ($vDatas as $vData) {
                array_push($sum, $vData->ankle->Y);
            }
            return round((abs(max($sum)) - abs(min($sum))) / 10, 2);
        }
        return 0;
    }

    public function GetKneeVariation($side)
    {
        $vDatas = $side == "Left" ? $this->variationsDataLeft : $this->variationsDataRight;
        if (count($vDatas) > 0) {
            $sum = array();
            foreach ($vDatas as $vData) {
                array_push($sum, $vData->knee->Y);
            }
            return round((abs(max($sum)) - abs(min($sum))) / 10, 2);
        }
        return 0;
    }

    public function GetStrideLength($side)
    {
        if (count($this->stepDatasLeft) >= 2) {
            $stride = 0;
            $strides = 0;
            if ($stride == "Left") {
                $strides = (int)floor((double)count($this->stepDatasLeft) / 2);
                for ($i = 0; $i < $strides * 2; $i += 2) {
                    try {
                        $stride += ($this->stepDatasLeft[$i]->length + $this->stepDatasRight[$i + 1]->length) / 10;
                    } catch (\Exception $e) {

                    }
                }
            } else {
                $strides = (int)floor((double)count($this->stepDatasRight) / 2);
                for ($i = 0; $i < $strides * 2; $i += 2) {
                    try {
                        $stride += ($this->stepDatasRight[$i]->length + $this->stepDatasLeft[$i + 1]->length) / 10;
                    } catch (\Exception $e) {

                    }
                }
            }
            return round($stride / $strides, 2);
        }
        return 0;
    }

    public function GetStrideTime($side)
    {
        if (count($this->stepDatasLeft) >= 2) {
            $stride = 0;
            $strides = 0;
            if ($stride == "Left") {
                $strides = (int)floor((double)count($this->stepDatasLeft) / 2);
                for ($i = 0; $i < $strides * 2; $i += 2) {
                    try {
                        $stride += ($this->stepDatasLeft[$i]->time + $this->stepDatasRight[$i + 1]->time) / 10;
                    } catch (\Exception $e) {

                    }
                }
            } else {
                $strides = (int)floor((double)count($this->stepDatasRight) / 2);
                for ($i = 0; $i < $strides * 2; $i += 2) {
                    try {
                        $stride += ($this->stepDatasRight[$i]->time + $this->stepDatasLeft[$i + 1]->time) / 10;
                    } catch (\Exception $e) {

                    }
                }
            }
            return round($stride / $strides, 2);
        }
        return 0;
    }

    public function GetStepAssymetry()
    {
        if (count($this->stepDatasLeft) > 0 && count($this->stepDatasRight) > 0) {
            $sum = array();
            foreach ($this->stepDatasLeft as $stepData) {
                array_push($sum, $stepData->length);
            }
            $avgLeft = Helpers::avg($sum);

            $sum = array();
            foreach ($this->stepDatasRight as $stepData) {
                array_push($sum, $stepData->length);
            }
            $avgRight = Helpers::avg($sum);

            return round(abs(($avgLeft - $avgRight) / 10), 2);
        }
        return 0;
    }

    public function GetStrideAssymetry()
    {
        return $this->GetStrideLength("Left") - $this->GetStrideLength("Right");
    }

    public function GetCadence()
    {
        if (count($this->stepDatasLeft) > 0 && count($this->stepDatasRight) > 0) {
            $millis = count($this->footPosition) * $this->interval;
            $steps = count($this->stepDatasLeft) + count($this->stepDatasRight);
            return 60000 * $steps / $millis;
        }
        return 0;
    }

    public function GetDoubleSupportTime()
    {
        if (count($this->stepDatasLeft) > 0 && count($this->stepDatasRight) > 0) {
            $both = 0;
            foreach ($this->footPosition as $footPosition){
                if ($footPosition == "Both")
                    $both += 1;
            }
            return round((double)$both * $this->interval / 1000, 2);
        }
        return 0;
    }

    public function GetSwingTime()
    {
        if (count($this->stepDatasLeft) > 0 && count($this->stepDatasRight) > 0) {
            $swings = 0;
            foreach ($this->footPosition as $footPosition){
                if ($footPosition != "Both")
                    $swings += 1;
            }
            return round((double)$swings * $this->interval / 1000, 2);
        }
        return 0;
    }

    public function Calculate($side)
    {
        $stepInitial = false;
        $stepDoing = false;
        $initialStepData = array(0, 0, 0);
        $stepTimeMS = 0;
        $i = 0;

        foreach ($this->footPosition as $position) {
            if (!$stepDoing) {
                if ($position == "Both")
                    $stepInitial = true;
                if ($position == $side && $stepInitial) {
                    $stepDoing = true;
                    $stepInitial = false;
                    $initialStepData = $side == "Left" ? $this->leftFoot[$i] : $this->rightFoot[$i];
                }
            }

            if ($stepDoing) {
                if ($position == "Both") {
                    $stepDoing = false;
                    $currentFootData = $side == "Left" ? $this->leftFoot[$i] : $this->rightFoot[$i];
                    $distance = sqrt(pow($currentFootData->X - $initialStepData->X, 2) +
                        pow($currentFootData->Z - $initialStepData->Z, 2));

                    $stepData = new StepData();
                    $stepData->length = round(abs($distance), 2);
                    $stepData->width = round(abs($currentFootData->X - $initialStepData->X), 2);
                    $stepData->time = round($stepTimeMS / 1000, 2);

                    if ($side == "Left")
                        array_push($this->stepDatasLeft, $stepData);
                    else
                        array_push($this->stepDatasRight, $stepData);

                    $stepTimeMS = 0;
                } else {
                    $stepTimeMS = $stepTimeMS + $this->interval;
                }
            }
        }
    }
}