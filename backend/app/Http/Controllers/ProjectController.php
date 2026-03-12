<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('tag')->get();
        return response()->json($projects);
    }

    public function show($id)
    {
        $project = Project::with('tag')->findOrFail($id);
        return response()->json($project);
    }


    public function store(Request $request)
    {

        Log::info('Requête de création de projet reçue : ', $request->all());

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'description' => 'required|string',
            'link_project' => 'nullable|string|max:255',
            'github_project' => 'nullable|string|max:255',
            'image_url' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'tag' => 'required|array',
            'tag.*' => 'exists:tags,id',
        ]);


        if ($request->hasFile('image_url')) {
            $image = $request->file('image_url');
            $filename = 'images_project/' . uniqid() . '.' . $image->getClientOriginalExtension();

            $image->move(public_path('storage/images_project'), $filename);

            $validated['images_url'] = 'storage/' . $filename;
        }

        if (!isset($validated['images_url'])) {
            return response()->json(['error' => 'Image non valide ou manquante.'], 422);
        }


        $project = Project::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'link_project' => $validated['link_project'] ?? null,
            'github_project' => $validated['github_project'] ?? null,
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
            'slug' => 'string|max:255',
            'link_project' => 'nullable|string|max:255',
            'github_project' => 'nullable|string|max:255',
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
            $filename = 'images_project/' . uniqid() . '.' . $image->getClientOriginalExtension();


            $image->move(public_path('storage/images_project'), $filename);
            $validated['images'] = "storage/{$filename}";
        }


        $project->update($validated);
        if (isset($validated['tag'])) {
            $project->tag()->sync($validated['tag']);
        }

        return response()->json($project->load('tag'));
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);


        if ($project->images && file_exists(public_path($project->images))) {
            unlink(public_path($project->images));
        }

        $project->tag()->detach();
        $project->delete();

        return response()->json(['message' => 'Projet supprimé avec succès']);
    }
}
