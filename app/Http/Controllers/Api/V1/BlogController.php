<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBlogRequest;
use App\Http\Requests\UpdateBlogRequest;
use App\Http\Resources\BlogResource;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;

class BlogController extends Controller
{

    function __construct()
    {
        $this->authorizeResource(Blog::class, 'blog');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        return BlogResource::collection(Blog::where(function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->latest()
            ->get());
    }

    public function allBlogs(Request $request)
    {

        $user = auth()->user();
        return BlogResource::collection(
            Blog::where('user_id', $user->id)
                ->where(function ($q) use ($request) {
                    $q->when($request->search, function ($query) use ($request) {
                        $query->where('title', 'LIKE', "%$request->search%");
                        $query->orwhere('blog_content', 'LIKE', "%$request->search%");
                        $query->orwhere('cover_photo', 'LIKE', "%$request->search%");
                    });
                })
                ->latest()
                ->paginate($request->pagesize)
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBlogRequest $request)
    {
        $file = $request->file('cover_photo');

        $filename = $file->getClientOriginalName();

        $file->storePubliclyAs('public/' . $request->user()->username, $filename);

        $img_url = 'storage/' . $request->user()->username . '/' . $filename;

        $request->request->add(['cover_photo' => $img_url]); //add request

        $blog = $request->user()->blogs()->create($request->input());

        return BlogResource::make($blog);
    }

    /**
     * Display the specified resource.
     */
    public function show(Blog $blog)
    {
        return BlogResource::make($blog);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blog $blog)
    {
        return BlogResource::make($blog);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBlogRequest $request, Blog $blog)
    {
        $file = $request->file('cover_photo');

        if ($file) {

            $filename = $file->getClientOriginalName();

            $file->storePubliclyAs('public/' . $request->user()->username, $filename);

            $img_url = 'storage/' . $request->user()->username . '/' . $filename;

            $request->request->add(['cover_photo' => $img_url]); //add request
        }

        $blog->update($request->input());

        return BlogResource::make($blog);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blog $blog)
    {
        $blog->delete();

        return response()->noContent();
    }

    public function blogsBySearch()
    {
        $user = auth()->user();
        $json = file_get_contents('php://input');
        $search = json_decode($json);
        return BlogResource::collection(Blog::where('user_id', $user->id)
            ->where(function ($query) use ($search) {
                $query->where('title', 'LIKE', "%$search->search%");
                $query->orwhere('blog_content', 'LIKE', "%$search->search%");
                $query->orwhere('cover_photo', 'LIKE', "%$search->search%");
            })
            ->latest()
            ->get());
    }

    public function getBlogs()
    {
        return BlogResource::collection(Blog::with('user')
            ->where('is_active', 1)
            ->latest()
            ->get());
    }

    public function searchBlogs()
    {
        $json = file_get_contents('php://input');
        $search = json_decode($json);
        return BlogResource::collection(Blog::where(function ($query) use ($search) {
            $query->where('title', 'LIKE', "%$search->search%");
            $query->orwhere('blog_content', 'LIKE', "%$search->search%");
            $query->orwhere('cover_photo', 'LIKE', "%$search->search%");
        })
            ->where('is_active', 1)
            ->latest()
            ->get());
    }

    public function viewBlog($blog)
    {

        $blog = Blog::find($blog);

        $related_blog = Blog::inRandomOrder()
            ->whereNotIn('id', [$blog->id])
            ->limit(2)
            ->get();

        // Return the primary blog along with related blogs
        return response()->json([
            'blog' => new BlogResource($blog),
            'related_blogs' => BlogResource::collection($related_blog)
        ]);
    }
}
