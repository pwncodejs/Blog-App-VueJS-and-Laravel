<template>
    <div class="container">
        <form @submit.prevent="isEdit ? updateBlogData() : addNewBlog()" enctype="multipart/form-data">
            <div class="row mt-6">
                <div class="col-2">
                    <h3>{{ isEdit ? 'Update Blog' : 'Create Blog' }}</h3>
                </div>
                <div class="col-4">
                    <Toggle v-model="formData.is_active" true-value="1" false-value="0"></Toggle>
                </div>
                <div class="col-6">
                    <button type="submit" :disabled="loader" class="btn btn-warning mb-3 float-end">
                        {{ loader ? "Please wait" : (isEdit ? 'Update Blog' : 'Save Blog') }}
                    </button>
                    <router-link :to="{ name: 'dashboard' }"
                        class="me-3 btn btn-outline-secondary mb-3 float-end">Back</router-link>
                </div>

                <div v-if="successMessage" class="alert alert-success" role="alert">
                    {{ successMessage }}
                </div>

            </div>
            <div class="row">
                <div class="col-md-9 px-3">
                    <div class="card shadow">
                        <div class="card-body">
                            <div class="mb-3">
                                <label for="task-text" class="col-form-label">Title:</label>
                                <input class="form-control" :class="{ 'is-invalid': errors.title && errors.title[0] }"
                                    id="title" v-model="formData.title">
                                <label class="invalid-feedback" v-if="errors.title && errors.title[0]">{{ errors.title &&
                                    errors.title[0] }}</label>
                            </div>
                            <div class="mb-3">
                                <label for="task-text" class="col-form-label"
                                    :class="{ 'is-invalid': errors.blog_content && errors.blog_content[0] }">Body:</label>
                                <QuillEditor contentType="html" theme="snow" toolbar="full"
                                    v-model:content="formData.blog_content" />
                                <label class="invalid-feedback" v-if="errors.blog_content && errors.blog_content[0]">{{
                                    errors.blog_content && errors.blog_content[0] }}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 px-3">
                    <div class="card shadow">
                        <div class="card-body">
                            <label for="file" class="col-form-label"
                                :class="{ 'is-invalid': errors.cover_photo && errors.cover_photo[0] }">Upload Blog Cover
                                Photo</label>
                            <input type="file" id="file" class="form-control" accept="image/*" @change="onFileChange" />
                            <label class="invalid-feedback" v-if="errors.cover_photo && errors.cover_photo[0]">{{
                                errors.cover_photo && errors.cover_photo[0] }}</label>
                            <div id="preview" class="mt-4">
                                <img :src="item.imageUrl" height="auto" width="100%" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
<style>
.ql-container {
    min-height: 250px !important;
}
</style>

<script setup>
import Toggle from '@vueform/toggle'
import { ref, defineProps, toRefs } from "vue";
import { useBlogStore } from '../../stores/blog';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useRouter } from 'vue-router';
import image from '../../assets/Image_not_available.png'

const store = useBlogStore()
const { handleAddedBlog, handleUpdatedBlog } = store

const loader = ref(false);
const errors = ref({});

const successMessage = ref(null)

const props = defineProps({
    blogPopup: Boolean,
    isEdit: Boolean,
    formData: Object,
    loader: Boolean,
    users: Object,
    errors: Object,
});

const { formData } = toRefs(props);
const router = useRouter()

//Add new blog
const addNewBlog = async () => {
    try {
        loader.value = true;

        const form_data = new FormData();
        form_data.append('title', formData.value.title);
        form_data.append('blog_content', formData.value.blog_content);
        form_data.append('is_active', formData.value.is_active);
        form_data.append('cover_photo', document.getElementById('file').files[0]); // Add the file

        await handleAddedBlog(form_data)
        loader.value = false;
        successMessage.value = 'Blog Created succesfully redirecting to blogs page.....'

        errors.value = {}

        setTimeout(() => {
            router.push({ name: 'blogs' })
        }, 1200)

    } catch (error) {
        if (error.response && error.response.status === 422) {
            errors.value = error.response.data.errors;
        }
        loader.value = false;
    }
};

// Update Blog
const updateBlogData = async () => {

    try {
        loader.value = true;

        const form_data = new FormData();
        form_data.append("_method", "put");
        form_data.append('id', formData.value.id);
        form_data.append('title', formData.value.title);
        form_data.append('blog_content', formData.value.blog_content);
        form_data.append('is_active', formData.value.is_active);

        if (document.getElementById('file').files[0])
            form_data.append('cover_photo', document.getElementById('file').files[0]); // Add the file

        await handleUpdatedBlog(form_data)

        loader.value = false;
        successMessage.value = 'Blog updated succesfully redirecting to blogs page.....'

        errors.value = {}

        setTimeout(() => {
            router.push({ name: 'blogs' })
        }, 1200)

    } catch (error) {
        if (error.response && error.response.status === 422) {
            errors.value = error.response.data.errors;
        }
        loader.value = false;
    }

}

const item = ref({
    image: null,
    imageUrl: props.isEdit ? import.meta.env.VITE_FILE_URL + formData.value.cover_photo : image
})

//Image preview
const onFileChange = (e) => {
    const image = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = j => {
        item.value.imageUrl = j.target.result;
    };
}

</script>
<style src="@vueform/toggle/themes/default.css"></style>
