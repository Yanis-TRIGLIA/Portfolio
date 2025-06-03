<?php

namespace App\Http\Controllers;

use App\Models\project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use SebastianBergmann\CodeCoverage\Report\Xml\Project as XmlProject;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::all();
        return response()->json($projects);
    }


    public function store(Request $request)
    {

        Log::info('Requête de création de projet reçue : ', $request->all());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'tag' => 'required|array',
            'tag.*' => 'exists:tags,id',
        ]);


        if ($request->hasFile('image_url')) {
            $image = $request->file('image_url');
            $filename = 'images/' . uniqid() . '.' . $image->getClientOriginalExtension();

            $image->move(public_path('storage/images_project'), $filename);

            $validated['images_url'] = 'storage/' . $filename;
        }

        if (!isset($validated['images_url'])) {
            return response()->json(['error' => 'Image non valide ou manquante.'], 422);
        }


        $project = Project::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'images' => $validated['images_url'],

        ]);


        $project->tag()->sync($validated['tag']);

        Log::info('Projet créé : ', $project->toArray());


        return response()->json([
            'message' => 'Projet créé avec succès',
            'project' => $project
        ], 201);
    }


    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'string',
            'image_url' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'tag' => 'array',
            'tag.*' => 'exists:tags,id',
        ]);

        if ($request->hasFile('image_url')) {
            if ($project->images && file_exists(public_path($project->images))) {
                unlink(public_path($project->images));
            }

            $image = $request->file('image_url');
            $filename = 'images/' . uniqid() . '.' . $image->getClientOriginalExtension();

            $image->move(public_path('storage/images'), $filename);
            $validated['image_url'] = 'storage/' . $filename;
        }


        $project->update($validated);
        if(isset($validated['tag'])) {
            $project->tag()->sync($validated['tag']);
        } 

        return response()->json($project->load('tag'));
    }
}
