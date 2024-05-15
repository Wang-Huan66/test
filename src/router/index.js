import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/index",
      name: "index",
      component: () => import("@/views/index.vue"),
      redirect: "/index/index",
      children: [
        {
          path: "index",
          name: "index",
          component: () => import("@/part/index.vue"),
        },
        {
          path: "product",
          name: "product",
          component: () => import("@/part/product.vue"),
        },
      ],
    },
  ],
});

// 路由守卫
router.beforeEach((to, from, next) => {
  let userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo) {
    if (to.path === "/" || to.path === "/login") {
      next("/index");
    } else {
      next();
    }
  } else {
    if (to.path === "/" || to.path === "/login") {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
