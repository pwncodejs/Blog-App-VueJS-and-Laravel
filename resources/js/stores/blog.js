import { ref } from "vue";
import { defineStore } from "pinia";
import {
    allBlogs,
    createBlog,
    updateBlog,
    removeBlog,
    getBlogs,
} from "../http/blog-api";

export const useBlogStore = defineStore("blogStore", () => {

    const blogs = ref([]);
    const blog_meta  = ref([]);
    //Get All the Blogs
    const fetchAllBlogs = async (params) => {
        const { data } = await allBlogs(params);
        blogs.value = data.data;
        blog_meta.value = data.meta
    };

    const handleAddedBlog = async (newBlog) => {
        const { data: createdBlog } = await createBlog(newBlog);
        blogs.value.unshift(createdBlog.data);
    };

    const handleUpdatedBlog = async (blog) => {
        await updateBlog(blog.get("id"), blog);
    };

    const handleRemovedBlog = async (blog_id) => {
        await removeBlog(blog_id);
        const index = blogs.value.findIndex((item) => item.id === blog_id);
        blogs.value.splice(index, 1);
    };

    const getAllBlogs = async () => {
        const { data } = await getBlogs();
        blogs.value = data.data;
    };

    return {
        blogs,
        blog_meta,
        fetchAllBlogs,
        handleAddedBlog,
        handleUpdatedBlog,
        handleRemovedBlog,
        getAllBlogs,
    };
});
