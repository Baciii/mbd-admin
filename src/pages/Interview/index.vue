<template>
    <div class="operations">
        <t-input style="width: 232px" v-model="keyword" />
        <t-button @click="search">搜索(公司or岗位)</t-button>
        <t-button @click="addInterviewPre">发布面经</t-button>
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
</template>

<script setup lang="tsx">
    import { ref, onMounted } from 'vue';
    import {
        interviewList,
        addInterview,
        deleteInterview,
        modifyInterview
    } from '../../api/interview';
    import {
        TableProps,
        MessagePlugin,
        FormInstanceFunctions
    } from 'tdesign-vue-next';

    const initData = async () => {
        const res = await interviewList();
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
            colKey: 'isPublic',
            title: '是否公开',
            align: 'center',
            cell: (h, { row }) => (
                <div>{row.isPublic === '1' ? '公开' : '私密'}</div>
            )
        },
        {
            colKey: 'content',
            title: '面经',
            align: 'center',
            width: 300,
            ellipsis: {
                props: {
                    theme: 'default',
                    placement: 'left'
                },
                content: (h, { row }) => {
                    const temp = row.content.split('\n');

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

    /** 发布面经 */
    const addInterviewPre = () => {};

    /** 修改面经 */

    /** 删除面经 */
</script>

<style scoped></style>
