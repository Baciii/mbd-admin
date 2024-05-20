<template>
    <div class="operations">
        <t-input style="width: 232px" v-model="keyword" />
        <t-button @click="search">搜索</t-button>
        <t-button @click="addInterviewPre">发布文章</t-button>
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
            <template #tag="{ row }">
                <t-tag-input
                    :value="JSON.parse(row.tag)"
                    :min-collapsed-num="0"
                    tips=""
                    readonly
                    placeholder=""
                    style="text-align: left"
                />
            </template>
        </t-table>
    </div>

    <t-dialog
        header="新增面经"
        v-model:visible="addInterviewVisible"
        :onConfirm="onAddInterview"
    >
        <t-form
            ref="ADD_INTERVIEW_FORM"
            :rules="interviewFormRules"
            :data="addInterviewForm"
        >
            <t-form-item label="标题" name="title">
                <t-input
                    v-model="addInterviewForm.title"
                    placeholder="请输入文章标题"
                />
            </t-form-item>

            <t-form-item label="标签" name="tag">
                <t-tagInput
                    placeholder="请输入文章标签（Enter键确认）"
                    v-model="addInterviewForm.tag"
                />
            </t-form-item>

            <t-form-item label="文章内容" name="content">
                <t-textarea
                    v-model="addInterviewForm.content"
                    placeholder="文章内容"
                />
            </t-form-item>
        </t-form>
    </t-dialog>

    <t-dialog
        header="修改面经"
        v-model:visible="modifyInterviewVisible"
        :onConfirm="onModifyInterview"
    >
        <t-form
            ref="MODIFY_INTERVIEW_FORM"
            :rules="interviewFormRules"
            :data="modifyInterviewForm"
        >
            <t-form-item label="标题" name="title">
                <t-input
                    v-model="modifyInterviewForm.title"
                    placeholder="请输入文章标题"
                />
            </t-form-item>

            <t-form-item label="标签" name="tag">
                <t-tagInput
                    placeholder="请输入文章标签（Enter键确认）"
                    v-model="modifyInterviewForm.tag"
                />
            </t-form-item>

            <t-form-item label="文章内容" name="content">
                <t-textarea
                    v-model="modifyInterviewForm.content"
                    placeholder="文章内容"
                />
            </t-form-item>
        </t-form>
    </t-dialog>

    <t-dialog
        header="删除岗位"
        v-model:visible="deleteInterviewVisible"
        :onConfirm="onDeleteInterview"
    >
        确认删除文章 (id: {{ deleteInterviewID }}) 吗？
    </t-dialog>
</template>

<script setup lang="tsx">
    import { ref, onMounted } from 'vue';
    import { userStore } from '../../store/index.ts';

    import {
        interviewList,
        addInterview,
        deleteInterview,
        modifyInterview
    } from '../../api/interview';

    import {
        articleList,
        addArticle,
        deleteArticle,
        modifyArticle
    } from '../../api/article';

    import {
        TableProps,
        MessagePlugin,
        FormInstanceFunctions
    } from 'tdesign-vue-next';

    const user = userStore();
    const initData = async () => {
        const res = await articleList();
        interviewTableData.value = res;
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
        const temp = [...interviewTableData.value];
        if (!keyword.value?.trim()) {
            filterData.value = temp;
        } else {
            filterData.value = temp.filter((item) => {
                let result = false;
                if (String(item.id).includes(keyword.value)) {
                    result = true;
                }
                if (item.content.includes(keyword.value)) {
                    result = true;
                }

                return result;
            });
        }

        pagination.value.total = filterData.value.length;
    };

    /** Table Config */
    const filterData = ref<TableProps['data']>([]);
    const interviewTableData = ref<TableProps['data']>([]);
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
            colKey: 'title',
            title: '文章标题',
            align: 'center'
        },
        {
            colKey: 'content',
            title: '文章内容',
            align: 'center',
            width: 300,
            ellipsis: {
                props: {
                    theme: 'default',
                    placement: 'left'
                },
                content: (h, { row }) => {
                    const temp = row.content.split('\n');
                    console.log(temp);
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
            colKey: 'tag',
            title: '标签',
            align: 'center'
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
                        onClick={() => onModifyInterviewPre(row)}
                    >
                        修改
                    </t-button>
                    <t-button
                        variant="text"
                        theme="primary"
                        onClick={() => onDeleteInterviewPre(row)}
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

    /** 发布文章 */
    const ADD_INTERVIEW_FORM = ref(null);
    const addInterviewVisible = ref<boolean>(false);

    const interviewFormRules = {
        title: [{ required: true, message: '文章标题必填' }],
        content: [{ required: true, message: '文章内容必填' }]
    };

    // TODO: Pinia 状态管理 publisher
    const addInterviewForm = ref({
        title: null,
        tag: [],
        content: null,
        publisher: user.id
    });

    const addInterviewPre = () => {
        addInterviewVisible.value = true;
    };

    const onAddInterview = async () => {
        const result = await (ADD_INTERVIEW_FORM.value as any).validateOnly();
        if (result === true) {
            // await addInterview(addInterviewForm.value);
            await addArticle(addInterviewForm.value);
            MessagePlugin.success({
                content: '发布成功'
            });
            addInterviewVisible.value = false;
            initData();
        } else {
            MessagePlugin.warning({
                content: '请填写表单必填项'
            });
        }
    };

    /** 修改面经 */
    const MODIFY_INTERVIEW_FORM = ref(null);
    const modifyInterviewVisible = ref(false);
    const modifyInterviewForm = ref({
        id: null,
        tag: [],
        title: null,
        content: null,
        publisher: user.id
    });

    const onModifyInterviewPre = (row) => {
        const { id, title, tag, content } = row;
        modifyInterviewVisible.value = true;
        modifyInterviewForm.value.id = id;
        modifyInterviewForm.value.title = title;
        modifyInterviewForm.value.tag = JSON.parse(tag);

        modifyInterviewForm.value.content = content;
    };

    const onModifyInterview = async () => {
        const result = await (
            MODIFY_INTERVIEW_FORM.value as any
        ).validateOnly();
        if (result === true) {
            await modifyArticle(modifyInterviewForm.value);
            MessagePlugin.success({
                content: '修改成功'
            });
            modifyInterviewVisible.value = false;
            initData();
        } else {
            MessagePlugin.warning({
                content: '请填写表单必填项'
            });
        }
    };

    /** 删除面经 */
    const deleteInterviewVisible = ref(false);
    const deleteInterviewID = ref(null);

    const onDeleteInterviewPre = (row) => {
        deleteInterviewID.value = row.id;
        deleteInterviewVisible.value = true;
    };

    const onDeleteInterview = async () => {
        try {
            await deleteArticle({
                id: deleteInterviewID.value
            });
            MessagePlugin.success({
                content: '文章删除成功'
            });
            deleteInterviewVisible.value = false;
            initData();
        } catch (err) {
            MessagePlugin.error({
                content: '文章删除失败'
            });
        }
    };
</script>

<style scoped></style>
