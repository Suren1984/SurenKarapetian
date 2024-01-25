<?php

namespace App\Http\Controllers\BodyMotion;

use App\Additional\Configs;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;

class VersionController extends Controller
{
    public function index(){
        $version = Configs::$VERSION;
        return response()->json($version);
    }

    public function download($version){
        $path  = 'https://bodymotion.sensohealthserver.com/public/versions/setup' . $version . ".exe";
        return \redirect()->to($path);
    }
}
