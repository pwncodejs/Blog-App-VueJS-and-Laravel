<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <router-link :to="{ name: 'dashboard' }" class="navbar-brand">Blog </router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item" v-if="isLoggedIn">
                            <router-link :to="{ name: 'blogs.add' }" class="nav-link">Create Blog <span
                                    class="sr-only"></span></router-link>
                        </li>

                    </ul>
                    <ul class="navbar-nav d-flex" v-if="!isLoggedIn">
                        <li class="nav-item">
                            <router-link :to="{ name: 'login' }"
                                class="nav-link btn btn-outline-secondary gap-3 px-4">Login</router-link>
                        </li>
                        <li class="nav-item px-3">
                            <router-link :to="{ name: 'register' }"
                                class="nav-link btn btn-outline-secondary px-4 gap-3">Register</router-link>
                        </li>
                    </ul>
                    <div class="d-flex" v-if="isLoggedIn">
                        <ul class="navbar-nav">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {{ isLoggedIn ? user.name : '' }}
                                </a>
                                <div class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                                    <a class="dropdown-item" href="javascript:void(0)" @click="logout">Logout</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
        <main class="mt-4">
            <router-view></router-view>
        </main>
    </div>
</template>

<script setup>

import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const router = useRouter()
const store = useAuthStore()

const { user, isLoggedIn } = storeToRefs(store);

const logout = async () => {
    await store.handleLogout()
    router.push({ name: 'homepage' })
}

</script>