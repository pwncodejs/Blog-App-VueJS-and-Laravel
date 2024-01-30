<template>
    <BlogForm v-if="!error" :is-edit="isEdit" :loader="loader" :formData="formData" :errors="errors" :key="componentKey" />
    <div v-if="error" class="alert alert-danger"> {{ error }} </div>
</template>

<script setup>

import BlogForm from '../../components/blogs/BlogForm.vue';
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
import { editBlog } from '../../http/blog-api';

const componentKey = ref(0);

const errors = ref({});

const loader = ref(false);

const isEdit = ref(true);

const route = useRoute();
const blog_id = route.params.blog_id

const formData = ref({
    id: blog_id,
    title: "",
    cover_photo: "",
    blog_content: "",
    is_active: 1,
});

const error = ref(null);

onMounted(async () => {
    try {
        const { data } = await editBlog(blog_id);
        formData.value = data.data
        componentKey.value += 1;
    } catch (errors) {
        error.value = errors.response.data.message
        componentKey.value += 1;
    }
});

</script>