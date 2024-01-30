<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div v-if="successMessage" class="alert alert-success" role="alert">
                    {{successMessage}}
                </div>
                <div class="card shadow-sm">
                    <div class="card-header">
                        <h3>Blogs List</h3>
                    </div>
                    <div class="card-body">
                        <!-- Add Blog Button -->
                        <button class="btn btn-secondary mb-3"  @click="OpenModal()">Add Blog</button>
                        <div v-if="modalPopup" id="blogModal" class="modal fade show" tabindex="-1"  style="display:block" aria-modal="true">
                            <div class="modal-dialog">
                              <div class="modal-content">
                                <form @submit.prevent="addNewBlog">
                                <div class="modal-header">
                                  <h5 class="modal-title" v-if="isEdit">Edit Blog</h5>
                                  <h5 class="modal-title" v-else>Add New Blog</h5>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="CloseModal"></button>
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
                                        <label class="invalid-feedback" v-if="errors.priority && errors.priority[0]">{{errors.priority && errors.priority[0]}}</label>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="CloseModal">Close</button>
                                  <button type="submit" class="btn btn-primary" :disabled="loader">Save changes</button>
                                </div>
                               </form>
                              </div>
                            </div>
                          </div>
                         <DataTable :data="data" class="display"  ref="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Blog</th>
                                    <th>Priority</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                        </DataTable>


                          <div v-if="deletePopup" id="deleteBlogModal" class="modal fade show" tabindex="-1"  style="display:block" aria-modal="true">
                            <div class="modal-dialog">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h5 class="modal-title">Delete Blog</h5>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="hideDeleteModal"></button>
                                </div>
                                <div class="modal-body">
                                  <p>Are you sure want to delete this blog ?</p>
                                </div>
                                <div class="modal-footer">
                                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="hideDeleteModal">No</button>
                                  <button type="button" class="btn btn-primary" @click="confirmDelete">Yes</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                </div>
            </div>
        </div>

    </div>

</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { allBlogs, editBlog, removeBlog } from '../../http/blog-api.js';
import DeleteModal  from "../../components/modals/DeleteModal.vue"
import { useBlogStore } from "../../stores/blog";
const store = useBlogStore()
const { handleAddedBlog } = store
const { fetchAllBlogs } = store
const blogs = ref([])

const modalPopup= ref(false)
const errors = ref({});
const successMessage = ref('');
const loader = ref(false)

const isEdit = ref(false)
const blogId = ref('');

const deletePopup = ref(false);
const deleteBlogId = ref('')

//Datatable
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';

DataTable.use(DataTablesCore);


const columns = [
  { data: 'ID' },
  { data: 'Blog' },
  { data: 'Priority' },
  { data: 'Actions', orderable: false, searchable: false, },
];

// Get all blogs
onMounted(async () => {
    const { data } = await allBlogs()
 //  await fetchAllBlogs()
    blogs.value = data.data
    // Initialize the DataTable

    // Transform the fetched data into the format expected by DataTables
    let tableData = [];
    blogs.value.forEach((blog) => {
      tableData.push([
        blog.id,
        blog.name,
        blog.priority,
        `<button class="btn btn-success btn-sm" @click="blogEdit(${blog.id})">Edit</button>
        <button class="btn btn-danger btn-sm" @click="blogDelete(${blog.id})">Delete</button>`,
      ]);
    });
    // Initialize the DataTable
    const dt = table.value.dt;
    dt.clear().rows.add(tableData).draw();


  });


const formData = ref({
    name:'',
    priority:''
})

const OpenModal = () => {
    modalPopup.value = true;
}

const CloseModal = () => {
    modalPopup.value = false;
}

// Add new blog
const addNewBlog = async() => {
  //  console.log('Form submitted:', formData.value);
  try
  {
      loader.value = true;
      await handleAddedBlog(formData.value)
      modalPopup.value = false;
      successMessage.value =  'Blog added successfully';
      loader.value = false;
      formData.value.name = '';
      formData.value.priority = '';

  }catch(error){
    if (error.response && error.response.status === 422) {
        errors.value = error.response.data.errors;
      }
      loader.value = false;
  }

}

// Edit the blog
const blogEdit = async(id) => {
    alert();
    isEdit.value = true;
    modalPopup.value = true;
    const { data } = await editBlog(id)
    formData.value = data.data
}

// Delete the blog
const blogDelete = (id) => {
    deletePopup.value = true;
    deleteBlogId.value = id;
}

// Function to hide the modal
const hideDeleteModal = () => {
    deletePopup.value = false;
    deleteBlogId.value = '';

  };

const confirmDelete = async() => {
    await removeBlog(deleteBlogId.value);
    deletePopup.value = false;
    const { data } = await allBlogs()
    blogs.value = data.data
}


</script>

<style>
@import 'bootstrap';
@import 'datatables.net-bs5';
@import 'datatables.net-dt';
</style>