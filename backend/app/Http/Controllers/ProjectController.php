<?php

namespace App\Http\Controllers;

use App\Models\project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::all();
        return response()->json($projects);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'tag' => 'required|array',
            'tag.*' => 'exists:tags,id',
        ]);
        Log::info('ProjectController@store', ['validated' => $validated]);


        if ($request->hasFile('image_url')) {
            $image = $request->file('image_url');
            $filename = 'images/' . uniqid() . '.' . $image->getClientOriginalExtension();

            $image->move(public_path('storage/images_project'), $filename);

            $validated['images_url'] = 'storage/' . $filename;

        }
        Log::info('ProjectController@store', ['validated' => $validated]);

         $project= Project::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'images' => $validated['images_url'],

        ]);


        $project->tag()->sync($validated['tag']);
    }



  
}
