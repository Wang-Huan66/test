<template>
    <div class="flex h-full">
        <div class="w-2/3 h-full bg-indigo-600"></div>
        <div class="w-1/3 h-full flex" style="justify-content: center;align-items: center;">
            <div class="w-3/5 h-2/6 flex flex-wrap"
                style="align-items: center;flex-direction: column;justify-content: space-evenly;">
                <div class="font-bold text-2xl">欢迎回来</div>
                <div class="text-base text-slate-300 title flex w-full"
                    style="flex-direction: row;align-items: center;">
                    <span class="flex-1 bg-slate-300"></span>
                    <div class="flex-1 mx-1">账号密码登录</div>
                    <span class="flex-1 bg-slate-300"></span>
                </div>
                <a-form ref="formRef" :model="form" class="w-full" @submit="handleSubmit">
                    <a-form-item field="username" label="用户"
                        :rules="[{ required: true, message: '请输入用户名' }, { minLength: 5, message: '用户名最少为5位' }]"
                        :validate-trigger="['change', 'input']">
                        <a-input v-model="form.username" placeholder="用户名">
                            <template #prefix>
                                <icon-user />
                            </template>
                        </a-input>
                    </a-form-item>
                    <a-form-item field="password" label="密码"
                        :rules="[{ required: true, message: '请输入用密码' }, { minLength: 5, message: '密码最短为6位' }]"
                        :validate-trigger="['change', 'input']">
                        <a-input-password v-model="form.password" placeholder="密码">
                            <template #prefix>
                                <icon-lock />
                            </template>
                        </a-input-password>
                    </a-form-item>
                    <a-button type="primary" html-type="submit" shape="round" class="w-full">登录</a-button>

                </a-form>

            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, } from "vue";
import { LoginApi } from "@/api/index";
import { Message } from '@arco-design/web-vue';
import router from "@/router";
import { useStore } from "@/stores";
const store = useStore()
let formRef = ref(null)
const form = reactive({
    username: '',
    password: '',
})

const handleSubmit = async ({ values, errors }) => {
    if (!errors) {
        let res = await LoginApi(form)
        if (res.code === 200) {
            Message.success(res.message)
            store.setStatus({ token: res.token, role: res.role })
        } else {
            Message.error(res.message)
            formRef.value.resetFields()
        }
    }
}
</script>
<style>
.title span {
    height: 1px;
    width: 100%;
    background-color: #ccc;
}
</style>