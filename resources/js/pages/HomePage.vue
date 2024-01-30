<template>
    <main class="px-4 py-3 text-center container" style="min-height: 50vh;">
        <h1 class="display-5 fw-bold">Stay Organized, be productive</h1>
        <div class="row mt-2">
            <div class="col-12 mx-auto">
                <input type="search" class="form-control" id="search" autocomplete="none" placeholder="Search"
                    v-model="searchQuery" @input="filterBlogsBySearch" />
            </div>
        </div>
        <div class="row mb-2">
            <div v-if="filteredBlogs.length" class="col-md-6" v-for="blog in filteredBlogs" :key="blog.id">
                <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                    <div class="col-auto d-none d-lg-block img-div">
                        <img :src="blog.cover_photo">
                    </div>
                    <div class="col p-4 d-flex flex-column position-static">
                        <strong class="d-inline-block mb-2 text-primary">{{ blog.title }}</strong>
                        <div class="mb-1 text-muted">{{ blog.created_at }}</div>
                        <div class="mb-1 text-muted bg-light" v-html="blog.blog_content.slice(0, 500)"></div>
                        <router-link :to="{ path: '/blog/' + blog.id }" class="stretched-link">Continue
                            reading</router-link>
                    </div>
                </div>
            </div>
            <div v-else>
                <h3 class="no-blogs-title">No Blogs Yet</h3>
                <p class="no-blogs-message">It looks like there are no blogs posted yet. Why not be the first to share your
                    thoughts, experiences, or insights?</p>
                <router-link :to="{ name: 'login' }" class="start-blogging-button">Start Blogging Now</router-link>
            </div>

        </div>
        <div class="pagination mt-3 d-block" v-if="totalPages">
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
    </main>
</template>

<script setup>
import { useBlogStore } from '../stores/blog';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed } from 'vue';
import { searchBlogs } from '../http/blog-api'


const store = useBlogStore();

const { getAllBlogs } = store;
const { blogs } = storeToRefs(store)

//load all active blogs
onMounted(async () => {
    await getAllBlogs()
    blogs.value = store.blogs;
})

// Search blog
const searchQuery = ref("");
// Filter blogs by search query
const filterBlogsBySearch = async () => {
    const query = searchQuery.value.toLowerCase();

    const { data } = await searchBlogs({ search: query });
    blogs.value = data.data;
};

// Pagingnation
const itemsPerPage = ref(4); // Number of items to display per page
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

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");

input[type="search"] {
    display: block;
    margin: 30px auto !important;
    padding: 18px 94px !important;
    background: white url("../assets/search-icon.svg") no-repeat 30px center;
    background-size: 55px 71px;
    font-size: 16px !important;
    border: none;
    border-radius: 25px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 5px 22px 2px, rgba(0, 0, 0, 0.3) 0px 3px 2px -3px;
}

img {
    max-height: 300px;
    width: 531px;
}

.img-div {
    display: flex;
    width: 531px;
    height: 300px;
    line-height: 100px;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    overflow: hidden;
    word-wrap: break-word;
}

.no-blogs-title {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
}

.no-blogs-message {
    font-size: 16px;
    color: #666;
    margin-bottom: 20px;
}

.start-blogging-button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    text-decoration: none;
}
</style>