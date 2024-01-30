<template>
    <div v-if="blogPopup" id="blogModal" class="modal fade show" tabindex="-1"  style="display:block" aria-modal="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <form @submit.prevent="isEdit ? updateBlogData() : addNewBlog()">
            <div class="modal-header">
                <h5 class="modal-title" v-if="isEdit">Edit Blog</h5>
                <h5 class="modal-title" v-else>Add New Blog</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeBlogModal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="blog-text" class="col-form-label">Blog:</label>
                    <textarea class="form-control" :class="{'is-invalid' : errors.name && errors.name[0]}" id="blog-text" v-model="formData.name"></textarea>
                    <label class="invalid-feedback" v-if="errors.name && errors.name[0]">{{ errors.name && errors.name[0] }}</label>
                </div>
                <div class="mb-3">
                    <label for="blog-priority" class="col-form-label">Priority:</label>
                    <select class="form-control" v-model="formData.priority" :class="{'is-invalid' : errors.priority && errors.priority[0]}">
                        <option value="high">High priority</option>
                        <option value="low">Low priority</option>
                        <option value="middle">Middle priority</option>
                    </select>
                    <label class="invalid-feedback" v-if="errors.priority && errors.priority[0]">{{ errors.priority && errors.priority[0] }}</label>
                </div>
                <div class="mb-3">
                    <label for="blog-status" class="col-form-label">Status:</label>
                    <select class="form-control" v-model="formData.status">
                        <option value="Pending">Pending</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="blog-user" class="col-form-label">Assigned To:</label>
                    <select class="form-control" v-model="formData.assigned_user_id">
                       <option v-for="user in users" :key="user.id" :value="user.id">{{user.name}}</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeBlogModal">Close</button>
                <button type="submit" class="btn btn-primary" :disabled="loader">Save changes</button>
            </div>
            </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits,toRefs  } from "vue";
import { storeToRefs } from "pinia";
import { useBlogStore } from "../../stores/blog";

const store = useBlogStore()
const { handleAddedBlog,handleUpdatedBlog,fetchBlogsByStatus } = store

const loader = ref(false);
const errors = ref({});

const props = defineProps({
    blogPopup: Boolean,
    isEdit:Boolean,
    formData: Object,
    loader: Boolean,
    users: Object,
    errors:Object,
});
const { formData } = toRefs(props);

const emit = defineEmits(["close-blog-modal", "success-message"]);

const closeBlogModal = () => {
  errors.value = '';
  emit("close-blog-modal");
};


const addNewBlog = async() => {
 try
  {
      loader.value = true;
      await handleAddedBlog(formData.value)
      emit("close-blog-modal");
      emit("success-message", "Blog added successfully");
      loader.value = false;
      await fetchBlogsByStatus(selectedStatus.value)
      blogs.value = store.blogs
  }catch(error){
    if (error.response && error.response.status === 422) {
        errors.value = error.response.data.errors;
      }
      loader.value = false;
  }
};

// Update Blog
const updateBlogData = async() => {
   // console.log('Form submitted:', formData.value);
  try
  {
      loader.value = true;
      await handleUpdatedBlog(formData.value)
      emit("close-blog-modal");
      emit("success-message", "Blog updated successfully");
      await fetchBlogsByStatus(selectedStatus.value)
      blogs.value = store.blogs
  }catch(error){
    if (error.response && error.response.status === 422) {
        errors.value = error.response.data.errors;
      }
      loader.value = false;
  }

}


</script>
