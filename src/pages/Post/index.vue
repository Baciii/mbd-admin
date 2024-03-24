<template>
    <div class="operations">
        <t-input style="width: 232px" v-model="keyword" />
        <t-button @click="search">搜索</t-button>
        <t-button @click="addPostPre">发布岗位</t-button>
    </div>

    <div style="width: 100%">
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
    </div>

    <t-dialog
        header="新增岗位"
        v-model:visible="addPostVisible"
        :onConfirm="onAddPost"
    >
        <t-form ref="ADD_POST_FORM" :rules="postFormRules" :data="addPostForm">
            <t-form-item label="公司" name="company">
                <t-input
                    v-model="addPostForm.company"
                    placeholder="请输入公司名"
                />
            </t-form-item>

            <t-form-item label="岗位" name="post">
                <t-input v-model="addPostForm.post" placeholder="请输入岗位" />
            </t-form-item>

            <t-form-item label="类型" name="type">
                <t-select v-model="addPostForm.type">
                    <t-option key="1" label="校招" value="1" />
                    <t-option key="2" label="实习" value="2" />
                </t-select>
            </t-form-item>

            <t-form-item label="投递方式" name="contact">
                <t-input
                    v-model="addPostForm.contact"
                    placeholder="请输入投递方式"
                />
            </t-form-item>

            <t-form-item label="岗位描述" name="description">
                <t-textarea
                    v-model="addPostForm.description"
                    placeholder="请输入岗位描述"
                />
            </t-form-item>
        </t-form>
    </t-dialog>

    <t-dialog
        header="修改用户"
        v-model:visible="modifyPostVisible"
        :onConfirm="onModifyPost"
    >
        <t-form
            ref="MODIFY_POST_FORM"
            :rules="postFormRules"
            :data="modifyPostForm"
        >
            <t-form-item label="公司" name="company">
                <t-input
                    v-model="modifyPostForm.company"
                    placeholder="请输入公司名"
                />
            </t-form-item>

            <t-form-item label="岗位" name="post">
                <t-input
                    v-model="modifyPostForm.post"
                    placeholder="请输入岗位"
                />
            </t-form-item>

            <t-form-item label="类型" name="type">
                <t-select v-model="modifyPostForm.type">
                    <t-option key="1" label="校招" value="1" />
                    <t-option key="2" label="实习" value="2" />
                </t-select>
            </t-form-item>

            <t-form-item label="投递方式" name="contact">
                <t-input
                    v-model="modifyPostForm.contact"
                    placeholder="请输入投递方式"
                />
            </t-form-item>

            <t-form-item label="岗位描述" name="description">
                <t-textarea
                    v-model="modifyPostForm.description"
                    placeholder="请输入岗位描述"
                />
            </t-form-item>
        </t-form>
    </t-dialog>

    <t-dialog
        header="删除岗位"
        v-model:visible="deletePostVisible"
        :onConfirm="onDeletePost"
    >
        确认删除岗位 {{ deletePostName }} 吗？
    </t-dialog>
</template>

<script lang="tsx" setup>
    import { ref, onMounted } from 'vue';
    import { userStore } from '../../store/index.ts';

    import {
        TableProps,
        MessagePlugin,
        FormInstanceFunctions
    } from 'tdesign-vue-next';
    import {
        postList,
        addPost,
        deletePost,
        modifyPost
    } from '../../api/post.ts';

    const user = userStore();

    const initData = async () => {
        const res = await postList();
        postTableData.value = res;
        filterData.value = res;
        tableLoading.value = false;
        pagination.value.total = res.length;
    };

    onMounted(() => {
        initData();
    });

    /** 搜索 */
    const keyword = ref<string>(null);

    const search = () => {
        const temp = [...postTableData.value];
        if (!keyword.value.trim()) {
            filterData.value = temp;
        } else {
            filterData.value = temp.filter((item) => {
                let result = false;
                if (String(item.id).includes(keyword.value)) {
                    result = true;
                }
                if (item.company.includes(keyword.value)) {
                    result = true;
                }
                if (item.post.includes(keyword.value)) {
                    result = true;
                }

                return result;
            });
        }

        pagination.value.total = filterData.value.length;
    };

    /** Table Config */
    const filterData = ref<TableProps['data']>([]);
    const postTableData = ref<TableProps['data']>([]);
    const tableLoading = ref<boolean>(false);

    const newPage = (url) => {
        window.open(url, '_blank');
    };

    const columns = ref<TableProps['columns']>([
        {
            colKey: 'id',
            title: 'id',
            align: 'center'
        },
        {
            colKey: 'company',
            title: '公司',
            align: 'center'
        },
        {
            colKey: 'post',
            title: '岗位',
            align: 'center'
        },
        {
            colKey: 'type',
            title: '类型',
            align: 'center',
            cell: (h, { row }) => (
                <div>{row.type === '1' ? '校招' : '实习'}</div>
            )
        },
        {
            colKey: 'contact',
            title: '投递方式',
            align: 'center',
            cell: (h, { row }) => (
                <span
                    style={{ color: '#004ace', cursor: 'pointer' }}
                    onClick={() => newPage(row.contact)}
                >
                    {row.contact}
                </span>
            )
        },
        {
            colKey: 'description',
            title: '描述',
            align: 'center',
            width: 300,
            ellipsis: {
                props: {
                    theme: 'default',
                    placement: 'left'
                },
                content: (h, { row }) => {
                    const temp = row.description.split('\n');

                    return (
                        <div>
                            {temp.map((item: string) => (
                                <p>{item}</p>
                            ))}
                        </div>
                    );
                }
            }
        },
        {
            colKey: 'publisher',
            title: '发布人 ID',
            align: 'center'
        },
        {
            title: '操作',
            colKey: 'link',
            align: 'center',
            width: 150,
            cell: (h, { row }) => (
                <div>
                    <t-button
                        variant="text"
                        theme="primary"
                        onClick={() => onModifyPostPre(row)}
                    >
                        修改
                    </t-button>
                    <t-button
                        variant="text"
                        theme="primary"
                        onClick={() => onDeletePostPre(row)}
                    >
                        删除
                    </t-button>
                </div>
            )
        }
    ]);

    const pagination = ref({
        defaultCurrent: 1,
        defaultPageSize: 10,
        total: 0
    });

    /** 发布岗位 */
    const ADD_POST_FORM = ref<FormInstanceFunctions>(null);
    const addPostVisible = ref<boolean>(false);
    const postFormRules = {
        company: [{ required: true, message: '公司必填' }],
        post: [{ required: true, message: '岗位必填' }],
        contact: [{ required: true, message: '投递方式必填' }],
        type: [{ required: true, message: '岗位类型必选' }]
    };
    const addPostForm = ref({
        company: null,
        post: null,
        type: null,
        contact: null,
        description: null,
        publisher: user.id
    });

    const addPostPre = () => {
        ADD_POST_FORM.value.reset();
        addPostVisible.value = true;
    };

    const onAddPost = async () => {
        const result = await (ADD_POST_FORM.value as any).validateOnly();
        if (result === true) {
            await addPost(addPostForm.value);
            MessagePlugin.success({
                content: '发布成功'
            });
            addPostVisible.value = false;
            initData();
        } else {
            MessagePlugin.warning({
                content: '请填写表单必填项'
            });
        }
        console.log(result);
    };

    /** 修改岗位 */
    const MODIFY_POST_FORM = ref<FormInstanceFunctions>(null);
    const modifyPostVisible = ref<boolean>(false);

    const modifyPostForm = ref({
        id: null,
        company: null,
        post: null,
        type: null,
        contact: null,
        description: null,
        publisher: user.id
    });

    const onModifyPostPre = (row) => {
        const { id, company, post, contact, description, type } = row;
        modifyPostForm.value.id = id;
        modifyPostForm.value.company = company;
        modifyPostForm.value.post = post;
        modifyPostForm.value.type = type;
        modifyPostForm.value.contact = contact;
        modifyPostForm.value.description = description;
        modifyPostVisible.value = true;
    };

    const onModifyPost = async () => {
        const result = await (MODIFY_POST_FORM.value as any).validateOnly();
        if (result === true) {
            await modifyPost(modifyPostForm.value);
            MessagePlugin.success({
                content: '修改成功'
            });
            modifyPostVisible.value = false;
            initData();
        } else {
            MessagePlugin.warning({
                content: '请填写表单必填项'
            });
        }
    };

    /** 删除岗位 */
    const deletePostVisible = ref<boolean>(false);
    const deletePostID = ref<number>(null);
    const deletePostName = ref<string>(null);

    const onDeletePostPre = (row) => {
        const { company, post, id } = row;
        deletePostID.value = id;
        deletePostName.value = `${company}-${post}`;
        deletePostVisible.value = true;
    };

    const onDeletePost = async () => {
        try {
            await deletePost({
                id: deletePostID.value
            });
            MessagePlugin.success({
                content: '岗位删除成功'
            });
            deletePostVisible.value = false;
            initData();
        } catch (err) {
            MessagePlugin.error({
                content: '岗位删除失败'
            });
        }
    };
</script>

<style scoped></style>
