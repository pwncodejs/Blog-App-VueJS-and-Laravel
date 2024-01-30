import { ref, computed } from "vue";
import { defineStore } from "pinia";
import {
  allBlogs,
  createBlog,
  updateBlog,
  removeBlog,
  blogsByStatus,
  getBlogs,
} from "../http/blog-api";

export const useBlogStore = defineStore("blogStore", () => {
  const blogs = ref([]);
  const selectedStatus = ref("All"); // To store the selected status

  const uncompletedBlogs = computed(() =>
    blogs.value.filter((blog) => !blog.is_completed)
  );

  const fetchBlogsByStatus = async (status) => {
    selectedStatus.value = status;
    if (status === "All") {
      fetchAllBlogs();
    } else {
      const { data } = await blogsByStatus(status);
      blogs.value = data.data;
    }
  };

  const fetchAllBlogs = async () => {
    const { data } = await allBlogs();
    blogs.value = data.data;
  };

  const handleAddedBlog = async (newBlog) => {
    const { data: createdBlog } = await createBlog(newBlog);
    blogs.value.unshift(createdBlog.data);
  };

  const handleUpdatedBlog = async (blog) => {
    const { data: updatedBlog } = await updateBlog(blog.get("id"), blog);
  };

  const handleRemovedBlog = async (blog_id) => {
    await removeBlog(blog_id);
    const index = blogs.value.findIndex((item) => item.id === blog_id);
    blogs.value.splice(index, 1);
  };

  const getAllBlogs = async () => {
      const { data } = await getBlogs();
      blogs.value = data.data
  }

  return {
    blogs,
    uncompletedBlogs,
    selectedStatus,
    fetchAllBlogs,
    handleAddedBlog,
    handleUpdatedBlog,
    handleRemovedBlog,
    fetchBlogsByStatus,
    getAllBlogs,
  };
});
