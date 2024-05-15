import { defineStore } from "pinia";
import router from "@/router";
export const useStore = defineStore("status", {
  state: () => ({
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || undefined,
  }),
  getters: {},
  actions: {
    setStatus(status) {
      this.userInfo = status;
      localStorage.setItem("userInfo", JSON.stringify(status));
      router.push('/index/index')
    },
  },
});
