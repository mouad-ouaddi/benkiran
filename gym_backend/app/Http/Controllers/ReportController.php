<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    /**
     * Display a listing of the reports.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $reports = Report::with('utilisateur')->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $reports,
        ]);
    }
    
    /**
     * Store a newly created report in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string',
            'utilisateur_id' => 'required|integer|exists:utilisateurs,id',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }
        
        $report = Report::create([
            'titre' => $request->titre,
            'contenu' => $request->contenu,
            'utilisateur_id' => $request->utilisateur_id,
        ]);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Report created successfully',
            'data' => $report,
        ], 201);
    }
    
    /**
     * Display the specified report.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $report = Report::with('utilisateur')->find($id);
        
        if (!$report) {
            return response()->json([
                'status' => 'error',
                'message' => 'Report not found',
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $report,
        ]);
    }
    
    /**
     * Update the report with admin response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function respond(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'reponse' => 'required|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }
        
        $report = Report::find($id);
        
        if (!$report) {
            return response()->json([
                'status' => 'error',
                'message' => 'Report not found',
            ], 404);
        }
        
        $report->reponse = $request->reponse;
        $report->save();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Response added successfully',
            'data' => $report,
        ]);
    }
    
    /**
     * Remove the specified report from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $report = Report::find($id);
        
        if (!$report) {
            return response()->json([
                'status' => 'error',
                'message' => 'Report not found',
            ], 404);
        }
        
        $report->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Report deleted successfully',
        ]);
    }
}
