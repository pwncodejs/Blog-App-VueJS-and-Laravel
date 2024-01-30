<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div v-if="successMessage" class="alert alert-success" role="alert">
          {{ successMessage }}
        </div>
        <div class="card shadow-sm">
          <div class="card-header">
            <div class="row">
              <div class='col-6'>
                <h3>Blogs List</h3>
              </div>
              <div class="col-6">
                <router-link :to="{ name: 'blogs.add' }" style="width: 150px" class="btn btn-warning mb-3 float-end">Add
                  New</router-link>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="mb-3 mt-3 col-9">
                <label for='show' class="form-check-inline">Show</label>
                <select id="show" @change="showPerPage" class="form-control form-check-inline" style="width: 50px;">
                  <option v-for="option in options" :value="option">{{ option }}</option>
                </select>
              </div>
              <!-- Search input field -->
              <div class="mb-3 mt-3 col-3">
                <input type="search" class="form-control float-end" id="search" v-model="searchQuery"
                  @input="filterBlogsBySearch" style="width: 250px" autocomplete="none" placeholder="Search" />
              </div>

            </div>
            <!-- Include the BlogTable component -->
            <BlogTable :filteredBlogs="filteredBlogs" :currentPage="currentPage" :totalPages="totalPages"
              :prevPage="prevPage" :nextPage="nextPage" :gotoPage="gotoPage" @show-delete-modal="showDeleteModal" />

            <!-- Delete Modal Component -->
            <DeleteModal :deletePopup="deletePopup" @hide-delete-modal="hideDeleteModal"
              @confirm-delete="confirmDelete" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import {
  blogsBySearch,
} from "../../http/blog-api.js";
import DeleteModal from "../../components/modals/DeleteModal.vue";
import BlogTable from "../../components/blogs/BlogTable.vue";
import { useBlogStore } from "../../stores/blog";
const store = useBlogStore();
const { fetchAllBlogs, handleRemovedBlog } = store;

const blogs = ref([]);
const options = [5, 10, 25]

const successMessage = ref("");

const deletePopup = ref(false);
const deleteBlogId = ref("");

// Get all blogs
onMounted(async () => {
  await fetchAllBlogs();
  blogs.value = store.blogs;
});


// Function to Delete the blog
const showDeleteModal = (id) => {
  deletePopup.value = true;
  deleteBlogId.value = id;
};

// Function to hide the modal
const hideDeleteModal = () => {
  deletePopup.value = false;
  deleteBlogId.value = "";
};

const confirmDelete = async () => {
  await handleRemovedBlog(deleteBlogId.value);
  deletePopup.value = false;
  successMessage.value = "Blog Deleted Successfully";
  filteredBlogs();
};


// Search blog
const searchQuery = ref("");
// Filter blogs by search query
const filterBlogsBySearch = async () => {
  const query = searchQuery.value.toLowerCase();

  const { data } = await blogsBySearch({ search: query });
  blogs.value = data.data;

};

//showperpage records
const showPerPage = (e) => {
  itemsPerPage.value = e.target.value
}

// Pagingnation
const itemsPerPage = ref(5); // Number of items to display per page
const currentPage = ref(1); // Current page number

const filteredBlogs = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return blogs.value.slice(startIndex, endIndex);
});

const totalPages = computed(() =>
  Math.ceil(blogs.value.length / itemsPerPage.value)
);

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const gotoPage = (page) => {
  currentPage.value = page;
};

</script>