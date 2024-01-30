<template>
    <BlogForm
    :is-edit="isEdit"
    :loader="loader"
    :formData="formData"
    :errors="errors"
/>

</template>

<script setup>

import BlogForm from '../../components/blogs/BlogForm.vue';
import { computed, onMounted, ref } from "vue";
import { editBlog } from '../../http/blog-api';

const errors = ref({});

const loader = ref(false);

const isEdit = ref(false);

const formData = ref({
  title: "",
  cover_photo: "",
  blog_content: "",
  is_active: 1,
});

</script>