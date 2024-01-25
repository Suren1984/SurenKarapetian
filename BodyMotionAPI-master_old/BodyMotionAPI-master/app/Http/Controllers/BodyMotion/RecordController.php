<?php

namespace App\Http\Controllers\BodyMotion;

use App\Http\Controllers\Controller;
use App\Models\Record;
use Illuminate\Support\Facades\Storage;

class RecordController extends Controller
{
    public function show(Record $record)
    {
        $this->authorize('show', $record);

        $props = [
            'id',
            'filename',
            'data',
            'module'
        ];

        $requestParameters = request()->all();
        $fieldsParameters = $requestParameters['fields'];
        $fieldsParametersSplit = explode(',', $fieldsParameters);
        $fields = array_intersect($props, $fieldsParametersSplit);

        $recordFields = $record->only($fields);

        return response()->json($recordFields);
    }

    public function showFile(Record $record)
    {
        $this->authorize('show', $record);

        return response()->file(storage_path('app/'.$record->module.'/'.$record->filename));
    }

    public function destroy(Record $record)
    {
        $this->authorize('delete', $record);

        Storage::delete($record->module.'/' . $record->filename);
        $record->delete();

        return response()->json(null, 204);
    }
}
