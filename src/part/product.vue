<template>
    <div class="h-12 w-full headerSearch flex py-4 px-2">
        <a-input class="w-1/4" v-model="requestData.goodsId" placeholder="请输入商品ID" allow-clear>
            <template #prepend>
                ID查询
            </template>
        </a-input>
        <a-input class="w-1/4" v-model="requestData.goodsName" placeholder="请输入商品ID" allow-clear>
            <template #prepend>
                商品名称
            </template>
        </a-input>
        <a-date-picker class="w-1/4" v-model="requestData.createTime" />
        <a-button type="secondary" @click="getList">搜索</a-button>
        <a-button type="primary" @click="add">添加</a-button>
    </div>
    <a-table :data="list" :pagination="pagination">
        <template #columns>
            <a-table-column title="ID" data-index="goodsId"></a-table-column>
            <a-table-column title="商品名称" data-index="goodsName"></a-table-column>
            <a-table-column title="入库时间" data-index="createTime"></a-table-column>
            <a-table-column title="库存量" data-index="inventory"></a-table-column>
            <a-table-column title="操作">
                <template #cell="{ record }">
                    <a-button @click="look(record)">查看</a-button>
                    <a-button status="warning" @click="edit(record)">编辑</a-button>
                    <a-button status="danger" @click="del(record.goodsId)">删除</a-button>
                </template>
            </a-table-column>
        </template>
    </a-table>

    <!-- 弹出框 -->
    <a-modal v-model:visible="visible" :title="title" @cancel="handleCancel" @before-ok="handleBeforeOk">
        <a-form :model="form">
            <a-form-item label="ID">
                <a-input v-model="form.goodsId" :disabled="buttonStatus === 'look' || buttonStatus === 'edit'" />
            </a-form-item>
            <a-form-item label="商品名称">
                <a-input v-model="form.goodsName" :disabled="buttonStatus === 'look'" />
            </a-form-item>
            <a-form-item label="创建时间">
                <a-date-picker class="w-full" v-model="form.createTime" :disabled="buttonStatus === 'look'" />
            </a-form-item><a-form-item label="库存量">
                <a-input v-model="form.inventory" :disabled="buttonStatus === 'look'" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup>
import { goodsListApi, addApi, editApi, delApi } from "@/api";
import { onMounted, reactive, ref } from "vue";
import { Message } from '@arco-design/web-vue';
// 定义一个值 判断点击的哪个按钮
let buttonStatus = ref(null)
// 对话框title
let title = ref('')
let list = ref([])
let total = ref(0)
let current = ref(1)
let pageSize = ref(10)
// 弹出框相关
const visible = ref(false);
const form = reactive({
    goodsId: '',
    goodsName: '',
    createTime: '',
    inventory: ''
});
// 查看
const look = (e) => {
    buttonStatus.value = 'look'
    title.value = '查看商品'
    for (const key in e) {
        form[key] = e[key] + '';
    }
    visible.value = true;
};
// 添加
const add = () => {
    buttonStatus.value = 'add'
    title.value = '添加商品'
    visible.value = true;
}
// 编辑
const edit = (e) => {
    buttonStatus.value = 'edit'
    title.value = '编辑商品'
    for (const key in e) {
        form[key] = e[key] + '';
    }
    visible.value = true;
}
// 删除
const del = async (id) => {
    let res = await delApi({ id })
    if (res.code === 200) {
        Message.success(res.message)
        getList()
    }
}
const handleBeforeOk = async (done) => {
    if (buttonStatus.value === 'add' || buttonStatus.value === 'edit') {
        for (const key in form) {
            if (!form[key]) {
                Message.warning('请输入完整信息')
                return false
            }
        }
        if (isNaN(Number(form.goodsId)) || isNaN(Number(form.inventory))) {
            Message.warning('商品ID和库存量必须为数字')
            return false
        }
    }
    let res = await (buttonStatus.value === 'add' ? addApi(form) : editApi(form))
    if (res.code === 200) {
        Message.success(res.message)
        done()
        for (const key in form) {
            form[key] = ''
        }
        getList()
    } else if (res.code === 301) Message.warning(res.message)
};
const handleCancel = () => {
    visible.value = false;
    for (const key in form) {
        form[key] = ''
    }
}



onMounted(() => {
    getList()
})
// 分页
const onPageChange = async (page) => {
    current.value = page
    await getList()
}
const pagination = reactive({
    current: current,
    pageSize: pageSize,
    total: total,
    onChange: onPageChange
})
let requestData = reactive({
    page: current,
    pageSize: pageSize,
    createTime: '',
    goodsId: '',
    goodsName: ''
})
// 获取列表数据
const getList = async () => {
    let res = await goodsListApi(requestData)
    if (res.code === 200) {
        list.value = res.data
        total.value = res.total
    }
}


const columns = [
    {
        title: 'ID',
        dataIndex: 'goodsId',
    },
    {
        title: '商品名称',
        dataIndex: 'goodsName',
    },
    {
        title: '入库时间',
        dataIndex: 'createTime',
    },
    {
        title: '库存量',
        dataIndex: 'inventory',
    },
]
</script>
<style>
.headerSearch {
    justify-content: space-between;
    align-items: center;
}

.arco-input-outer {
    width: 25%;
}
</style>