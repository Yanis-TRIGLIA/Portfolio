<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::all();
        return response()->json($tags);
    }
    public function show($id)
    {
        $tag = Tag::findOrFail($id);
        return response()->json($tag);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'categories' => 'required|in:Backend,Frontend,Autres',
            'name' => 'required|string|max:255',
            'master_percentage' => 'required|integer|min:0|max:100'
        ]);

        $tag = Tag::create($validated);
        return response()->json($tag, 201);
    }



    public function update(Request $request, $id)
    {
        $tag = Tag::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|max:255',
            'categories' => 'in:Backend,Frontend,Autres',
            'master_percentage' => 'integer|min:0|max:100'
        ]);

        $tag->update($validated);

        return response()->json($tag);
    }


    public function destroy($id)
    {
        $tag = Tag::findOrFail($id);

        $tag->delete();

        return response()->json(['message' => 'Tag supprimée avec succès']);
    }
}
