<template>
  <div>
    <div class="table-responsive">
      <table id="blog_table" class="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Cover photo</th>
            <th>Blog content</th>
            <th>Status</th>
            <th width='14%'>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredBlogs.length" v-for="blog in filteredBlogs" :key="blog.id">
            <td>{{ blog.title }}</td>
            <td>
              <img :src=blog.cover_photo width="200px" height="150px">
            </td>
            <td>
              <details>
                <summary v-html="blog.blog_content.slice(0, 300)"></summary>
                <div v-html="blog.blog_content"></div>
              </details>
            </td>
            <td>
              <span class="badge" :class="blog.is_active ? 'bg-success' : 'bg-warning'">
                {{ blog.is_active ? 'active' : 'inactive' }}
              </span>

            </td>
            <td>
              <router-link :to="{ path: 'edit-blog/' + blog.id }" class="btn btn-primary btn-sm"> Edit</router-link>
              &nbsp;&nbsp;
              <button class="btn btn-danger btn-sm" @click="showDeleteModal(blog.id)">
                Delete
              </button>
            </td>
          </tr>
          <tr v-else>
            <td colspan="5" class="text-center">
              <span class="alert-info">No

                blog available</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination mt-3 d-block float-end" v-if="totalPages">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
          <a class="page-link" href="#" @click.prevent="gotoPage(page)">{{
            page
          }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
details>summary {
  padding: 4px;
  width: 500px;
  height: 150px;
  background-color: #eeeeee;
  border: none;
  cursor: pointer;
}
</style>
<script setup>
import { defineProps, toRefs } from "vue";
const props = defineProps({
  filteredBlogs: Array,
  currentPage: Number,
  totalPages: Number,
  prevPage: Function,
  nextPage: Function,
  gotoPage: Function,
});

const { filteredBlogs, currentPage, totalPages, prevPage, nextPage, gotoPage } =
  toRefs(props);

const emit = defineEmits(["show-delete-modal"]);

const showDeleteModal = (id) => {
  emit("show-delete-modal", id);
};
</script>