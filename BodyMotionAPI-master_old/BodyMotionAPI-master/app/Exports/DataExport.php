<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class DataExport implements WithMultipleSheets
{
    protected $patient, $data, $dataByTime;

    /**
     * Write code on Method
     *
     * @return response()
     */
    public function __construct($patient, $data, $dataByTime)
    {
        $this->patient = $patient;
        $this->data = $data;
        $this->dataByTime = $dataByTime;
    }


    public function sheets(): array
    {
        $sheets = [];

        $sheets[0] = new Patient($this->patient);
        $sheets[1] = new Data($this->data);
        $sheets[2] = new DataByTime($this->dataByTime);

        return $sheets;
    }
}