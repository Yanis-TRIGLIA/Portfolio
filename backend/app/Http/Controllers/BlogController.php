<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use SebastianBergmann\CodeCoverage\Report\Xml\blog as Xmlblog;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::with('tag')->get();
        return response()->json($blogs);
    }

    public function show($id)
    {
        $blog = blog::with('tag')->findOrFail($id);
        return response()->json($blog);
    }


    public function store(Request $request)
    {

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'content' => 'required|string',
            'cover' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'tag' => 'required|array',
            'tag.*' => 'exists:tags,id',
            'meta_title' => 'string|max:255',
            'meta_description' => 'string|max:255',

        ]);


        if ($request->hasFile('cover')) {
            $image = $request->file('cover');
            $filename = 'cover_blog/' . uniqid() . '.' . $image->getClientOriginalExtension();

            $image->move(public_path('storage/cover_blog'), $filename);

            $validated['cover'] = 'storage/' . $filename;
        }


        $blog = Blog::create($validated);

        $blog->tag()->sync($validated['tag']);


        return response()->json([
            'message' => 'Post créé avec succès',
            'blog' => $blog
        ], 201);
    }



    public function update(Request $request, $id)
    {

        $blog = Blog::findOrFail($id);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'slug' => 'string|max:255',
            'content' => 'string',
            'cover' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'tag' => 'array',
            'tag.*' => 'exists:tags,id',
            'meta_title' => 'string|max:255',
            'meta_description' => 'string|max:255',

        ]);


        if ($request->hasFile('cover')) {
            Log::info('Mise à jour de l\'image pour le blog ID: ' . $id);

            if ($blog->cover && file_exists(public_path($blog->cover))) {
                unlink(public_path($blog->cover));
            }

            $image = $request->file('cover');
            $filename = 'cover_blog/' . uniqid() . '.' . $image->getClientOriginalExtension();

            $image->move(public_path('storage/cover_blog'), $filename);

            $validated['cover'] = 'storage/' . $filename;
            Log::info('Image mise à jour : ' . $validated['cover']);
        }



        $blog->update($validated);
        if (isset($validated['tag'])) {
            $blog->tag()->sync($validated['tag']);
        }

        return response()->json([
            'message' => 'Post mise à jour avec succès',
            'blog' => $blog
        ], 201);
    }


    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);

        if ($blog->cover && file_exists(public_path($blog->cover))) {
            unlink(public_path($blog->cover));
        }

        $blog->delete();
        $blog->tag()->detach();
        return response()->json(['message' => 'La post à était supprimé avec succès']);
    }
}
