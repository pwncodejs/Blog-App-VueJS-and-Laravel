<template>
    <div>

        <!-- Search input field -->
        <div class="mb-3 mt-3">
            <input type="search" class="form-control float-end" id="search" v-model="params.search" style="width: 250px"
                autocomplete="none" placeholder="Search" />
        </div>


        <div class="table-responsive col-12">
            <!-- <vue3-datatable :rows="rows" :columns="cols" :loading="loading" :search="search"> </vue3-datatable> -->
            <vue3-datatable :pageSizeOptions="pageSizeOptions" :rows="rows" :columns="cols" :loading="loading"
                :totalRows="total_rows" :isServerMode="true" :pageSize="params.pagesize" :page="params.page"
                :search="params.search" @change="changeServer">

                <template #cover_photo="data">
                    <img :src=data.value.cover_photo width="200px" height="150px">
                </template>

                <template #blog_content="data">
                    <div v-html="data.value.blog_content" class="blog_content"></div>
                </template>

                <template #is_active="data">
                    <span class="badge" :class="data.value.is_active ? 'bg-success' : 'bg-warning'">
                        {{ data.value.is_active ? 'active' : 'inactive' }}
                    </span>
                </template>

                <template #action="data">
                    <div class="flex gap-4">
                        <router-link :to="{ path: 'edit-blog/' + data.value.id }" class="btn btn-primary btn-sm">
                            Edit</router-link>
                        &nbsp;&nbsp;
                        <button class="btn btn-danger btn-sm" @click="showDeleteModal(data.value.id)">
                            Delete
                        </button>
                    </div>
                </template>

            </vue3-datatable>

        </div>

    </div>
</template>
<style scoped>
.blog_content {
    padding: 4px;
    width: 415px;
    height: 150px;
    background-color: #eeeeee;
    border: none;
    cursor: pointer;
    overflow: auto;
}
</style>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { useBlogStore } from "../../stores/blog";
import Vue3Datatable from '@bhplugin/vue3-datatable';
import '@bhplugin/vue3-datatable/dist/style.css';
import { storeToRefs } from "pinia";

const store = useBlogStore();

const { blogs, blog_meta } = storeToRefs(store);
const { fetchAllBlogs } = store;

const loading = ref(true);
const total_rows = ref(0);

const pageSizeOptions = [3, 5, 10, 50, 100]

const params = reactive({
    page: 1,
    pagesize: 3,
    search: '',
    column_filters: [],
});
const rows = ref(null);

const cols =
    ref([
        { field: 'title', title: 'Title', },
        { field: 'cover_photo', title: 'Cover Photo' },
        { field: 'blog_content', title: 'Body' },
        { field: 'is_active', title: 'Status' },
        { field: 'action', title: 'Action' },
    ]) || [];

onMounted(async () => {
    getBlogs();
});

let controller;
let timer;
const filterBlogs = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        getBlogs();
    }, 300);
};
const getBlogs = async () => {
    try {
        // cancel request if previous request still pending before next request fire
        if (controller) {
            controller.abort();
        }
        controller = new AbortController();

        loading.value = true;

        await fetchAllBlogs(params);

        /* let blog_data = blogs.value.map((blog) => {
            const { id, created_at, user_id, ...rest } = blog;
            return { ...rest, action: 'some_action_value' };
        });
 */
        rows.value = blogs.value;
        total_rows.value = blog_meta.value.total

    } catch { }

    loading.value = false;
};
const changeServer = (data) => {

    params.page = data.current_page;
    params.pagesize = data.pagesize;
    params.column_filters = data.column_filters;
    params.search = data.search;

    if (data.change_type === 'search') {
        filterBlogs();
    } else {
        getBlogs();
    }
};

const emit = defineEmits(["show-delete-modal"]);

const showDeleteModal = (id) => {
    emit("show-delete-modal", id);
};

</script>