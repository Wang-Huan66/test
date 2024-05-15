<template>
    <a-layout class="w-full h-full">
        <a-layout-header class="h-14 flex w-full text-2xl p-5">
            <div class="w-1/5 flex logo">
                <div>LOGO</div>
                <div>
                    <component @click="onCollapse" :is="collapsed ? 'icon-menu-unfold' : 'icon-menu-fold'"></component>
                </div>
            </div>
            <div @click="onLogout">退出</div>
        </a-layout-header>
        <a-layout>
            <a-layout-sider hide-trigger collapsible :collapsed="collapsed">
                <a-menu :defaultOpenKeys="['1']" :defaultSelectedKeys="['0_3']" :style="{ width: '100%' }"
                    @menuItemClick="onClickMenuItem">
                    <a-menu-item v-for="item, index in layout" :key="item.path">
                        <template #icon>
                            <component :is="item.icon"></component>
                        </template>
                        {{ item.title }}
                    </a-menu-item>
                </a-menu>
            </a-layout-sider>
            <a-layout-content class="p-5">
                <RouterView></RouterView>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { layoutApi } from "@/api";
import router from "@/router";
const collapsed = ref(false);
let layout = ref()
const onCollapse = () => {
    collapsed.value = !collapsed.value;
};
const onClickMenuItem = (path) => {
    router.push(path)
}
onMounted(async () => {
    let res = await layoutApi()
    if (res.code === 200) {
        layout.value = res.data
    }
})
const onLogout = () => {
    localStorage.removeItem('userInfo')
    router.push('/login')
}
</script>
<style>
.arco-layout-header {
    justify-content: space-between;
    align-items: center;
    background-color: #4338ca;
    color: #fff;
}

.logo {
    justify-content: space-evenly;
    align-items: center;
}
</style>