<template>
    <div class="operations">
        <t-input style="width: 232px" v-model="keyword" />
        <t-button @click="search">搜索</t-button>
        <t-button
            @click="newUserVisible = true"
            :disabled="!(permission === '0')"
            >新增用户</t-button
        >
    </div>

    <t-space direction="vertical">
        <!-- 当数据为空需要占位时，会显示 cellEmptyContent -->
        <t-table
            row-key="index"
            :data="filterData"
            :columns="columns"
            :stripe="false"
            :bordered="false"
            :hover="false"
            :table-layout="'fixed'"
            :size="'small'"
            :pagination="pagination"
            :show-header="true"
            :loading="tableLoading"
            cell-empty-content="-"
            resizable
            lazy-load
        >
        </t-table>
    </t-space>

    <t-dialog
        header="新增用户"
        v-model:visible="newUserVisible"
        :onConfirm="onNewUser"
    >
        <t-form
            ref="NEW_USER_FORM"
            :rules="newUserFormRules"
            :data="newUserForm"
        >
            <t-form-item label="用户名" name="username">
                <t-input
                    v-model="newUserForm.username"
                    placeholder="请输入用户名"
                />
            </t-form-item>

            <t-form-item label="密码" name="password">
                <t-input
                    v-model="newUserForm.password"
                    placeholder="请输入密码"
                />
            </t-form-item>

            <t-form-item label="用户类型" name="type">
                <t-select v-model="newUserForm.type">
                    <t-option key="0" label="超级管理员" value="0" />
                    <t-option key="1" label="普通管理员" value="1" />
                    <t-option key="2" label="后台展示临时用户" value="2" />
                    <t-option key="3" label="普通用户" value="3" />
                </t-select>
            </t-form-item>
        </t-form>
    </t-dialog>

    <t-dialog
        header="修改用户"
        v-model:visible="modifyUserVisible"
        :onConfirm="onModifyUser"
    >
        <t-form>
            <t-form-item label="用户名" name="username">
                {{ modifyUserForm.username }}
            </t-form-item>

            <!-- <t-form-item label="密码" name="password">
                <t-input
                    v-model="modifyUserForm.password"
                    placeholder="请输入密码"
                />
            </t-form-item> -->

            <t-form-item label="用户类型" name="type">
                <t-select v-model="modifyUserForm.type">
                    <t-option key="0" label="超级管理员" value="0" />
                    <t-option key="1" label="普通管理员" value="1" />
                    <t-option key="2" label="后台展示临时用户" value="2" />
                    <t-option key="3" label="普通用户" value="3" />
                </t-select>
            </t-form-item>
        </t-form>
    </t-dialog>

    <t-dialog
        header="删除用户"
        v-model:visible="deleteUserVisible"
        :onConfirm="onDeleteUser"
    >
        确认删除用户 {{ deleteUserUsername }} 吗？
    </t-dialog>
</template>

<script lang="tsx" setup>
    import { ref, onMounted } from 'vue';
    import { userStore } from '../../store/index.ts';

    import { TableProps, MessagePlugin } from 'tdesign-vue-next';
    import {
        CheckCircleFilledIcon,
        SmileIcon,
        Fingerprint2Icon,
        AssignmentUserIcon
    } from 'tdesign-icons-vue-next';

    import { userList, newUser, modifyUser, deleteUser } from '../../api/user';

    const user = userStore();
    const permission = ref(user.type);

    /** 搜索 */
    const keyword = ref<string>('');
    const filterData = ref<TableProps['data']>([]);
    const search = () => {
        const temp = [...userTableData.value];
        if (!keyword.value.trim()) {
            filterData.value = temp;
        } else {
            filterData.value = temp.filter((item) => {
                let result = false;
                if (String(item.id).includes(keyword.value)) {
                    result = true;
                }
                if (item.username.includes(keyword.value)) {
                    result = true;
                }

                return result;
            });
        }

        pagination.value.total = filterData.value.length;
    };

    /** Table Config */
    const statusNameListMap = {
        '0': {
            label: '超级管理员',
            theme: 'success',
            icon: <CheckCircleFilledIcon />
        },
        '1': {
            label: '普通管理员',
            theme: 'success',
            icon: <AssignmentUserIcon />
        },
        '2': {
            label: '后台展示临时用户',
            theme: 'warning',
            icon: <Fingerprint2Icon />
        },
        '3': {
            label: '普通用户',
            theme: 'primary',
            icon: <SmileIcon />
        }
    };

    const columns = ref<TableProps['columns']>([
        {
            colKey: 'id',
            title: 'id',
            align: 'center',
            width: 200
        },
        {
            colKey: 'type',
            title: '用户类型',
            align: 'center',
            width: 250,
            // filter: {
            //     type: 'multiple',
            //     resetValue: [],
            //     list: [
            //         { label: 'All', checkAll: true },
            //         { label: '超级管理员', value: '0' },
            //         { label: '普通管理员', value: '1' },
            //         { label: '后台展示临时用户', value: '2' },
            //         { label: '普通用户', value: '3' }
            //     ]
            // },

            cell: (h, { row }) => {
                return (
                    <t-tag
                        shape="round"
                        theme={statusNameListMap[row.type].theme}
                        variant="light-outline"
                    >
                        {statusNameListMap[row.type].icon}
                        {statusNameListMap[row.type].label}
                    </t-tag>
                );
            }
        },
        {
            colKey: 'username',
            title: '用户名',
            align: 'center'
        },
        {
            title: '操作',
            colKey: 'link',
            align: 'center',
            width: 300,
            cell: (h, { row }) => (
                <div>
                    <t-button
                        variant="text"
                        theme="primary"
                        disabled={!(permission.value === '0')}
                        onClick={() => onModifyUserPre(row)}
                    >
                        修改
                    </t-button>
                    <t-button
                        variant="text"
                        theme="primary"
                        disabled={!(permission.value === '0')}
                        onClick={() => onDeleteUserPre(row)}
                    >
                        删除
                    </t-button>
                </div>
            )
        }
    ]);

    const tableLoading = ref<boolean>(false);
    const userTableData = ref<TableProps['data']>([]);

    const pagination = ref({
        defaultCurrent: 1,
        defaultPageSize: 20,
        total: 0
    });

    const initData = async () => {
        tableLoading.value = true;
        const res = await userList();
        userTableData.value = res;
        filterData.value = res;
        tableLoading.value = false;
        pagination.value.total = res.length;
    };

    onMounted(async () => {
        initData();
    });

    /** 新增用户 */
    const NEW_USER_FORM = ref(null);
    const newUserVisible = ref(false);
    const newUserForm = ref<NetParams.NewUser>({
        username: null,
        password: null,
        type: '3'
    });

    const newUserFormRules = {
        username: [{ required: true, message: '用户名必填' }],
        password: [{ required: true, message: '密码必填' }]
    };

    const onNewUser = async () => {
        const result = await (NEW_USER_FORM.value as any).validateOnly();
        if (result === true) {
            await newUser(newUserForm.value);

            newUserVisible.value = false;
            initData();
        } else {
            MessagePlugin.warning({
                content: '请填写表单必填项'
            });
        }
        console.log(result);
    };

    /** 修改用户 */
    const modifyUserVisible = ref(false);
    const modifyUserForm = ref({
        id: null,
        username: null,
        type: null
    });

    const onModifyUserPre = (row: any) => {
        modifyUserVisible.value = true;
        const { id, username, type } = row;

        modifyUserForm.value.id = id;
        modifyUserForm.value.username = username;
        modifyUserForm.value.type = type;
    };

    const onModifyUser = async () => {
        const { id, type } = modifyUserForm.value;
        try {
            await modifyUser({
                id,
                type
            });
            MessagePlugin.success({
                content: '修改成功'
            });
            modifyUserVisible.value = false;
            initData();
        } catch (err) {
            console.error(err);
        }
    };

    /** 删除用户 */
    const deleteUserID = ref(null);
    const deleteUserUsername = ref(null);
    const deleteUserVisible = ref(false);

    const onDeleteUserPre = (row) => {
        deleteUserVisible.value = true;
        deleteUserID.value = row.id;
        deleteUserUsername.value = row.username;
    };

    const onDeleteUser = async () => {
        deleteUserVisible.value = false;
        try {
            await deleteUser({
                id: deleteUserID.value
            });
            MessagePlugin.success({
                content: '用户删除成功'
            });
            initData();
        } catch (err) {
            MessagePlugin.error({
                content: '用户删除失败'
            });
        }
    };
</script>
