<template>
    <div class="container h-100">
        <div class="row h-100 align-items-center mt-5">
            <div class="col-12 col-md-6 offset-md-3">
                <div class="card shadow sm">
                    <div class="card-body">
                        <h1 class="text-center">Login</h1>
                        <hr />
                        <form action="javascript:void(0)" class="row" method="post" @submit.prevent="handleSubmit">

                            <div class="form-group col-12">
                                <label for="email" class="font-weight-bold"
                                    :class="{ 'is-invalid': errors.username && errors.username[0] }">Username</label>
                                <input type="text" v-model="form.username" name="username" id="username"
                                    class="form-control">
                                <div class="invalid-feedback" v-if="errors.username && errors.username[0]">{{ errors.username
                                    && errors.username[0] }}</div>

                            </div>
                            <div class="form-group col-12 my-2">
                                <label for="password" class="font-weight-bold">Password</label>
                                <input type="password" :class="{ 'is-invalid': errors.password && errors.password[0] }"
                                    v-model="form.password" name="password" id="password" class="form-control">
                                <div class="invalid-feedback" v-if="errors.password && errors.password[0]">{{ errors.password
                                    && errors.password[0] }}</div>
                            </div>
                            <div class="col-12 mb-2">
                                <button type="submit" :disabled="processing" @click="login"
                                    class="btn btn-primary btn-block">
                                    {{ processing ? "Please wait" : "Login" }}
                                </button>

                            </div>
                            <div class="col-12 text-center">
                                <label>Don't have an account? <router-link :to="{ name: 'register' }">Register
                                        Now!</router-link></label>
                            </div>
                            <div class="col-12 text-center mt-4">
                                <label><router-link :to="{ name: 'forgot_password' }">Forgot password?</router-link></label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter()
const store = useAuthStore()
const { isLoggedIn, errors } = storeToRefs(store)
const { handleLogin } = store
const processing = ref(false)

const form = reactive({
    username: '',
    password: ''
})

const handleSubmit = async () => {
    processing.value = true;
    await handleLogin(form)
    console.log(isLoggedIn.value);
    processing.value = false;
    if (isLoggedIn.value) {
        router.push({ name: 'blogs' })
    }
}
</script>