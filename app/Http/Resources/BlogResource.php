<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,
            'title' => $this->title,
            'cover_photo' => $this->cover_photo,
            'blog_content' => $this->blog_content,
            'user_id' => $this->user_id,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->format('M d')
        ];
    }
}
