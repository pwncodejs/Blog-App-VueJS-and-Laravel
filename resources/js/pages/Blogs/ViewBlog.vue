<template>
    <div class="container">
        <div v-if="error" class="alert alert-warning">Blog Not Found</div>
        <div class="row" v-else>
            <div class="col-8 blog-content">
                <h1 class="mb-4">{{ blog.title }}</h1>
                <h3 style="color: gray;">{{ blog.created_at }}</h3>
                <div class="blog-img">
                    <img :src="img_url + blog.cover_photo" class="mb-4">
                </div>
                <div v-html="blog.blog_content" width="500px" height="300px"></div>
            </div>
            <div class="col-4 related-blog px-4">
                <h3 style="text-align: center;" class="mb-4">Related Blog</h3>
                <div v-for="blog in related_blog" :key="blog.id">
                    <div
                        class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                        <div class="col-auto d-none d-lg-block img-div">
                            <img :src="img_url + blog.cover_photo">
                        </div>
                        <div class="col p-4 d-flex flex-column position-static">
                            <strong class="d-inline-block mb-2 text-primary">{{ blog.title }}</strong>
                            <div class="mb-1 text-muted">{{ blog.created_at }}</div>
                            <div class="mb-1 text-muted bg-light" v-html="blog.blog_content.slice(0, 500)"></div>
                            <a href="javascript:void(0)" @click="handleViewBlog(blog.id)" class="stretched-link">Continue
                                reading</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { viewBlog } from "../../http/blog-api"
import { useRoute } from "vue-router";

const route = useRoute()

const blog_id = ref(null)

blog_id.value = route.params.blog_id;

const blog = ref({});

const related_blog = ref({})

const error = ref(null)

const img_url = import.meta.env.VITE_FILE_URL

onMounted(async () => {
    await renderBlog()
})

const renderBlog = async () => {
    try {
        const { data } = await viewBlog(blog_id.value);

        blog.value = data.blog

        related_blog.value = data.related_blogs

    } catch (errors) {
        error.value = 'Blog Not Found'
    }
}
const handleViewBlog = async (id) => {
    blog_id.value = id
    await renderBlog()
}
</script>
<style scoped>
.vl {
    border-left: 6px solid rgb(0, 128, 128);
    min-height: 500px;
}

.related-blog img {
    max-height: 250px;
    max-width: 330px;
    width: 330px;
}

.blog-img {
    display: flex;
    width: 600px;
    height: 400px;
    line-height: 100px;
    justify-content: left;
    align-items: left;
    border-radius: 6px;
    border: 1px solid #dce2ee;
    overflow: hidden;
    word-wrap: break-word;
}

.blog-img img {
    width: 600px;
    height: 400px;
}

.img-div {
    display: flex;
    width: 330px;
    height: 250px;
    line-height: 100px;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    overflow: hidden;
    word-wrap: break-word;
}
</style>