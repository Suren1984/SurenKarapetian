<?php

namespace App\Http\Controllers\DystoniaTreatment;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Rehabilitation;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function indexRehabilitations()
    {
        $patient = auth()->guard('patients_api')->user();
        $rehabilitations = Rehabilitation::where('patient_id', $patient->id)->get();

        return response()->json($rehabilitations);
    }
}
