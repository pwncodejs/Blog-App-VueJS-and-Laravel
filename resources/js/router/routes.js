import BlogsPage from "../pages/Blogs/BlogsPage.vue";
import AddBlog from "../pages/Blogs/AddBlog.vue";
import EditBlog from "../pages/Blogs/EditBlog.vue";
import ViewBlog from "../pages/Blogs/ViewBlog.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import ForgotPassword from "../pages/ForgotPasswordPage.vue";
import DashboardLayout  from "../components/layouts/Default.vue";
import HomePage from "../pages/HomePage.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    meta: {
      auth: true,
    },
    children: [
      {
          name: "dashboard",
          path: '/',
          component: BlogsPage,
          meta: {
              title: `Dashboard`
          }
      },
   ]
  },
  {
    path: "/",
    component: DashboardLayout,
    meta: {
      auth: true,
    },
    children: [
      {
          name: "blogs",
          path: '/blogs',
          component: BlogsPage,
          meta: {
              title: `Blogs`
          }
      }
   ]
  },
  {
    path: "/",
    component: DashboardLayout,
    meta: {
      auth: true,
    },
    children: [
      {
          name: "blogs.add",
          path: '/add-blog',
          component: AddBlog,
          meta: {
              title: `Blogs`
          }
      }
   ]
  },
  {
    path: "/",
    component: DashboardLayout,
    meta: {
      auth: true,
    },
    children: [
      {
          name: "blogs.edit",
          path: '/edit-blog/:blog_id',
          component: EditBlog,
          meta: {
              title: `Blogs`
          }
      }
   ]
  },
  {
    path: "/",
    component: DashboardLayout,
    meta: {
      guest: true,
    },
    children: [
      {
        name: "blog",
        path: '/blog/:blog_id',
        component: ViewBlog,
        meta: {
            title: `Blog App`
        }
      },
      {
        name: "homepage",
        path: '/',
        component: HomePage,
        meta: {
            title: `Blog App`
        }
      },
      {
        path: "/login",
        component: LoginPage,
        name: "login",
        meta: {
          guest: true,
        },
      },
      {
        path: "/register",
        component: RegisterPage,
        name: "register",
        meta: {
          guest: true,
        },
      },
      {
        path: "/forgot-password",
        component: ForgotPassword,
        name: "forgot_password",
        meta: {
          guest: true,
        },
      },
   ]
  },
];

export default routes;
