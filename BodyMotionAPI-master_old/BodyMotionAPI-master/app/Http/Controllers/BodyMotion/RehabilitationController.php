<?php

namespace App\Http\Controllers\BodyMotion;

use App\Http\Controllers\Controller;
use App\Models\Rehabilitation;
use App\Models\RehabilitationRecord;

class RehabilitationController extends Controller
{
    public function getRehab($recordId){
        return response()->json(RehabilitationRecord::where("record_id", $recordId)->orderBy("created_at", 'DESC')->get());
    }

    public function destroy(Rehabilitation $rehabilitation)
    {
        $this->authorize('delete', $rehabilitation);

        $rehabilitation->delete();

        return response()->json(null, 204);
    }
}
