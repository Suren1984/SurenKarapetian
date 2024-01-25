<?php

namespace App\Http\Controllers\BodyMotion;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Record;
use App\Modules\Dystonia;
use App\Modules\Gait;
use App\Modules\Posture;
use App\Modules\Spine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RecordTablesController extends Controller
{
    public function index(Record $record)
    {
        $this->authorize('show', $record);
        switch ($record->module){
            case 'dystonia':
                $dystonia = new Dystonia();
                return response()->json($dystonia->getTable($record->data));
            case 'spine':
                $spine = new Spine();
                return response()->json($spine->getTable($record->data));
            case 'posture':
                $posture = new Posture();
                return response()->json($posture->getTable($record->data));
            case 'gait':
                $gait = new Gait();
                return response()->json($gait->getTable($record->data));
        }
        return response()->json("");
    }

    public function getData(Record $record){
        return $record->data;
    }
}
