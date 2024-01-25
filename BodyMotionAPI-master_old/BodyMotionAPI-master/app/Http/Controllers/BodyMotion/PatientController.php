<?php

namespace App\Http\Controllers\BodyMotion;

use App\Additional\Configs;
use App\Http\Controllers\Controller;
use App\Mail\PatientRegistered;
use App\Models\Record;
use App\Models\Patient;
use App\Models\Rehabilitation;
use App\Models\RehabilitationRecord;
use App\Models\Video;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PatientController extends Controller
{
    public function index()
    {
        $nameFilterQuery = strtolower(request()->get('name'));
        $module = strtolower(request()->get('module'));
        if (request()->get('doctor_id') != null)
            $id = strtolower(request()->get('doctor_id'));
        else
            $id = Auth::user()->id;

        return $this->getPatients($id, $module, $nameFilterQuery);
    }

    private function getPatients($user_id, $module = "", $nameFilterQuery = "")
    {
        $patients = Patient::join('records', 'records.patient_id', 'patients.id')->select([
            'patients.*',
            DB::raw('(SELECT MAX(created_at) FROM records WHERE records.patient_id = patients.id) as last_record_date')])
            ->where('patients.doctor_id', '=', $user_id)
            ->where(function ($query) use ($module, $nameFilterQuery) {
                $query->where('records.module', 'like', '%' . $module . '%')
                    ->Where('patients.first_name', 'like', '%' . $nameFilterQuery . '%')
                    ->orWhere('patients.surname', 'like', '%' . $nameFilterQuery . '%');
            })
            ->groupBy('records.patient_id')->orderBy('last_record_date', 'DESC')->get();


        return response()->json($patients);
    }

    public function getPatientsAPI(Request $request){
        $key = $request->post('api_key');
        $id = $request->post('doctor_id');
        $name = $request->post('name') ?? "";

        if ($key == Configs::$API_KEY)
            return $this->getPatients($id, "", $name);
        return response()->json("API KEY ERROR");
    }

    public function indexRecords(Patient $patient)
    {
        $this->authorize('show', $patient);

        $recordsDates = Record::orderBy('created_at', 'desc')
            ->where('patient_id', $patient->id)
            ->get(['id', 'created_at', 'module']);

        return response()->json($recordsDates);
    }

    public function indexRecordsModule(Patient $patient, Request $request)
    {
        $this->authorize('show', $patient);

        $recordsDates = Record::orderBy('created_at', 'desc')
            ->where([['patient_id', $patient->id], ['module', $request->route('module')]])
            ->get(['id', 'created_at', 'module']);

        return response()->json($recordsDates);
    }

    public function indexRehabilitations(Patient $patient)
    {
        $this->authorize('show', $patient);

        $rehabilitations = Rehabilitation::where('patient_id', $patient->id)->get();

        return response()->json($rehabilitations);
    }

    public function show(Patient $patient)
    {
        $this->authorize('show', $patient);

        return response()->json($patient);
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'phoneotype' => 'string|max:255',
            'since' => 'required|integer'
        ]);

        $patient = new Patient();
        $patient->fill($request->all());

        $patient->doctor_id = Auth::id();
        $patient->username = $this->generateUsername($patient->first_name, $patient->surname);
        $patient->save();

        return response()->json([
            "id" => $patient->id,
            "first_name" => $patient->first_name,
            "surname" => $patient->surname,
        ], 200);
    }

    private function generateUsername(string $firstName, string $surname)
    {
        $usernameCandidate = $this->processString($firstName[0] . $surname);

        $patientsWithSameUsernameCount = Patient::where('username', 'LIKE', $usernameCandidate . '%')
            ->whereRaw('CHAR_LENGTH(surname) = ?', [mb_strlen($surname)])
            ->count();

        if ($patientsWithSameUsernameCount == 0) {
            return $usernameCandidate;
        }

        return $usernameCandidate . $patientsWithSameUsernameCount;
    }

    private function processString(string $string)
    {
        $string = iconv('UTF-8', 'ASCII//TRANSLIT', $string);
        $string = preg_replace('/[^a-zA-Z0-9]/', '', $string);
        $string = strtolower($string);

        return $string;
    }

    public function register(Request $request, Patient $patient)
    {
        $this->authorize('register', $patient);

        $request->validate([
            'email' => 'required|string|email|max:255|unique:patients,email'
        ]);

        $patient->fill($request->only('email'));
        $password = Str::random(8);
        $patient->password = bcrypt($password);
        $patient->save();

        $mailData = [
            'username' => $patient->username,
            'password' => $password
        ];
        Mail::to($patient)->send(new PatientRegistered($mailData));

        if (count(Mail::failures()) > 0) {
            return response()->json(["message" => "Error"]);
        } else {
            return response()->json(["message" => "Success"], 500);
        }
    }

    public function update(Request $request, Patient $patient)
    {
        $this->authorize('update', $patient);

        $patient->fill($request->all());
        $patient->save();

        return response()->json(null, 204);
    }

    public function storeRecord(Request $request, Patient $patient)
    {
        $this->authorize('createRecord', $patient);

        $request->validate([
            'file' => 'required|mimes:mp4',
            'data' => 'required|json',
            'filename' => 'required|string',
            'module' => 'required|string'
        ]);

        $filename = $request->filename . '.' . $request->file->getClientOriginalExtension();

        if (Record::where('filename', $filename)->exists()) {
            $error = ValidationException::withMessages([
                'filename' => 'Filename already exists'
            ]);
            throw $error;
        }

        Storage::putFileAs($request->module, $request->file, $filename, 'private');

        $record = new Record();
        $record->filename = $filename;
        $record->data = $request->data;
        $record->patient_id = $patient->id;
        $record->module = $request->module;

        $record->save();

        return response()->json([
            'id' => $record->id
        ], 201);
    }

    public function storeRecordAPI(Request $request){
        $key = $request->post('api_key');
        $id = $request->post('record_id');
        $round = $request->post('round') ?? "";
        $rehab_name = $request->post('rehab_name') ?? "";

        try {
            if ($key == Configs::$API_KEY) {
                $record = new RehabilitationRecord();
                $record->record_id = $id;
                $record->data = $request->post('data');
                $record->round = $round;
                $record->rehab_name = $rehab_name;
                $record->module = "fullbody";

                $record->save();

                return response()->json([
                    'id' => $record->id
                ], 200);
            }
        }catch (\Exception $e){
            return response()->json("Error");
        }
        return response()->json("API KEY ERROR");
    }

    public function storeRecordNoFile(Request $request, Patient $patient)
    {
        $this->authorize('createRecord', $patient);

        $request->validate([
            'data' => 'required|json',
            'module' => 'required|string'
        ]);


        $record = new Record();
        $record->data = $request->data;
        $record->patient_id = $patient->id;
        $record->module = $request->module;

        $record->save();

        return response()->json([
            'id' => $record->id
        ], 200);
    }

    public function storeRehabilitation(Request $request, Patient $patient)
    {
        $this->authorize('createRecord', $patient);

        $request->validate([
            'name' => 'required|string|max:255',
            'name_detailed' => 'required|string|max:255',
            'repeats' => 'required|int|min:1',
            'to_stay' => 'required|int|min:1',
            'filename' => 'required|string',
            'description' => 'string',
        ]);

        $rehabilitation = new Rehabilitation();
        $rehabilitation->fill($request->all());
        $rehabilitation->patient_id = $patient->id;
        $rehabilitation->save();

        return response()->json([
            'id' => $rehabilitation->id
        ], 201);
    }

    public function destroyRehabilitations(Patient $patient)
    {
        $this->authorize('delete', $patient);

        $patient->rehabilitations()->delete();

        return response()->json(null, 204);
    }

    public function destroy(Patient $patient)
    {
        $this->authorize('delete', $patient);

        $patient->delete();

        return response()->json(null, 204);
    }
}
