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
            'content' => 'required|json',
            'read_time' => 'required|integer|min:1',
            // allow up to 5MB here; ensure php.ini upload_max_filesize/post_max_size >= 5M
            'cover' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'tag' => 'required|array',
            'tag.*' => 'exists:tags,id',
            'meta_title' => 'string|max:255',
            'meta_description' => 'string|max:255',

        ]);


        if ($request->hasFile('cover')) {
            $image = $request->file('cover');
            $name = uniqid() . '.' . $image->getClientOriginalExtension();
            $dir = public_path('storage/cover_blog');

            if (!file_exists($dir)) {
                mkdir($dir, 0755, true);
            }

            // Check PHP upload validity and provide detailed debug info on failure
            if (! $image->isValid()) {
                $err = $image->getError();
                Log::error('Cover upload invalid. Error code: ' . $err);
                return response()->json([
                    'message' => 'The cover failed to upload.',
                    'debug' => [
                        'is_valid' => false,
                        'error_code' => $err,
                        'client_name' => $image->getClientOriginalName(),
                        'size' => $image->getSize(),
                        'upload_max_filesize' => ini_get('upload_max_filesize'),
                        'post_max_size' => ini_get('post_max_size'),
                    ],
                ], 422);
            }

            try {
                $image->move($dir, $name);
                $validated['cover'] = 'storage/cover_blog/' . $name;
            } catch (\Exception $e) {
                Log::error('Cover upload failed: ' . $e->getMessage());
                return response()->json([
                    'message' => 'The cover failed to upload.',
                    'debug' => [
                        'exception' => $e->getMessage(),
                        'client_name' => $image->getClientOriginalName(),
                        'size' => $image->getSize(),
                        'upload_max_filesize' => ini_get('upload_max_filesize'),
                        'post_max_size' => ini_get('post_max_size'),
                    ],
                ], 422);
            }
        }


        $blog = Blog::create($validated);

        $blog->tag()->sync($validated['tag']);


        return response()->json([
            'message' => 'Post créé avec succès',
            'blog' => $blog
        ], 201);
    }


    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
        ]);

        $image = $request->file('image');
        $name = uniqid() . '.' . $image->getClientOriginalExtension();
        $dir = public_path('storage/blog_images');

        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }

        try {
            $image->move($dir, $name);
        } catch (\Exception $e) {
            Log::error('Blog image upload failed: ' . $e->getMessage());
            return response()->json(['message' => 'Image upload failed'], 422);
        }

        return response()->json([
            'success' => 1,
            'file' => [
                'url' => asset('storage/blog_images/' . $name),
            ],
        ]);
    }



    public function update(Request $request, $id)
    {

        $blog = Blog::findOrFail($id);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'slug' => 'string|max:255',
            'content' => 'json',
            'read_time' => 'integer|min:1',
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
