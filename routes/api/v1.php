<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\BlogController;
use App\Http\Controllers\Api\V1\UserController;

Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::apiResource('/blogs', BlogController::class);
    Route::post('/blogs/blogsBySearch', [BlogController::class, 'blogsBySearch']);
});


Route::middleware('guest')->prefix('v1')->group(function () {
    Route::get('/getBlogs', [BlogController::class, 'getBlogs']);
    Route::post('/searchBlogs', [BlogController::class, 'searchBlogs']);
    Route::get('/blog/{blog}', [BlogController::class, 'viewBlog']);
});