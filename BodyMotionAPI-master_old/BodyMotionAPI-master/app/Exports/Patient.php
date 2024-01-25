<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithTitle;

class Patient implements FromCollection, ShouldAutoSize, WithStrictNullComparison, WithStyles, WithTitle
{
    protected $data;

    /**
     * Write code on Method
     *
     * @return response()
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Write code on Method
     *
     * @return response()
     */
    public function collection()
    {
        return collect($this->data);
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
          //  1 => ['font' => ['bold' => true]],
            'A' => ['font' => ['bold' => true]],


        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Patient';
    }
}