import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
    csrfCookie,
    login,
    register,
    logout,
    getUser,
    forgotPassword,
} from "../http/auth-api";


export const useAuthStore = defineStore("authStore", () => {

    const user = ref(null);

    const errors = ref({});

    const isLoggedIn = computed(() => !!user.value);

    const fetchUser = async () => {
        try {
            const { data } = await getUser();
            user.value =   data;
        } catch (error) {
            user.value = null;
        }
    };

    const handleLogin = async (credentials) => {
        await csrfCookie();
        try {
            const response = await login(credentials);
            const { token } = response.data;
            const authToken = ref(token);
            await fetchUser();
            errors.value = {};
        } catch (error) {
            if (error.response && error.response.status === 422) {
                errors.value = error.response.data.errors;
            }
        }
    };

    const handleRegister = async (newUser) => {
        try {
            await register(newUser);
            await handleLogin({
                username: newUser.username,
                password: newUser.password,
            });
        } catch (error) {
            if (error.response && error.response.status === 422) {
                errors.value = error.response.data.errors;
            }
        }
    };

    const handleForgotPassword = async (user) => {
        try {
            await forgotPassword(user);
            errors.value = {};
        } catch (error) {
            if (error.response && error.response.status === 422) {
                errors.value = error.response.data.errors;
            }
            if (error.response && error.response.status === 503) {
                errors.value = error.response.data;
            }
        }
    };

    const handleLogout = async () => {
        await logout();
        user.value = null;
    };

    return {
        user,
        errors,
        isLoggedIn,
        fetchUser,
        handleLogin,
        handleRegister,
        handleLogout,
        handleForgotPassword,
    };

},{
    persist: {
        enabled: true
    }
}
);
