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
              <!-- Include the BlogTable component -->
              <BlogDatatable @show-delete-modal="showDeleteModal" />
            </div>

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
import { ref } from "vue";

import DeleteModal from "../../components/modals/DeleteModal.vue";
import BlogDatatable from "../../components/blogs/BlogDatatable.vue";
import { useBlogStore } from "../../stores/blog";
const store = useBlogStore();
const { handleRemovedBlog } = store;

const successMessage = ref("");

const deletePopup = ref(false);
const deleteBlogId = ref("");

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
};

</script>