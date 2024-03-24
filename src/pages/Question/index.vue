<template>
    <div class="operations">
        <t-input style="width: 232px" v-model="keyword" />
        <t-button @click="search">搜索</t-button>
        <t-button @click="addQuestionPre">发布面试题</t-button>
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
            cell-empty-content=""
            resizable
            lazy-load
        >
            <template #options="{ row }">
                <t-tag-input
                    :value="
                        JSON.parse(row.options).map(
                            (item, index) =>
                                `${mapNumberToLetter(index)}:  ${item}`
                        )
                    "
                    :min-collapsed-num="0"
                    tips=""
                    readonly
                    placeholder=""
                    style="text-align: left"
                />
            </template>

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

            <template #answer="{ row }">
                <t-button variant="text" theme="primary">
                    「 {{ row.answer }} 」
                </t-button>
            </template>
        </t-table>
    </div>

    <t-dialog
        header="发布面试题"
        v-model:visible="addQuestionVisible"
        :onConfirm="onAddQuestion"
    >
        <t-form
            ref="ADD_QUESTION_FORM"
            :rules="questionFormRules"
            :data="addQuestionForm"
        >
            <t-form-item label="题干" name="question_stem">
                <t-input
                    v-model="addQuestionForm.question_stem"
                    placeholder="请输入题干"
                />
            </t-form-item>

            <t-form-item label="选项" name="options">
                <t-tag-input
                    v-model="addQuestionForm.options"
                    clearable
                    :min-collapsed-num="0"
                    :max="26"
                    placeholder="请输入题目选项（Enter键确认）"
                >
                    <template #valueDisplay="{ value, onClose }">
                        <t-tag
                            v-for="(item, index) in value"
                            :key="index"
                            closable
                            style="margin-right: 4px"
                            @close="() => onClose(index)"
                        >
                            <span>{{ mapNumberToLetter(index) }}</span>
                            <span>:&nbsp;&nbsp;{{ item }}</span>
                        </t-tag>
                    </template>
                </t-tag-input>
            </t-form-item>

            <t-form-item label="答案" name="answer">
                <t-select v-model="addQuestionForm.answer">
                    <t-option
                        v-for="(item, index) in addQuestionForm.options"
                        :key="index"
                        :label="mapNumberToLetter(index)"
                        :value="mapNumberToLetter(index)"
                    />
                </t-select>
            </t-form-item>

            <t-form-item label="类型" name="type">
                <t-input
                    v-model="addQuestionForm.type"
                    placeholder="请输入题目类型"
                />
            </t-form-item>

            <t-form-item label="标签" name="tag">
                <t-tagInput
                    placeholder="请输入题目标签（Enter键确认）"
                    v-model="addQuestionForm.tag"
                />
            </t-form-item>
        </t-form>
    </t-dialog>

    <t-dialog
        header="修改面试题"
        v-model:visible="modifyQuestionVisible"
        :onConfirm="onModifyQuestion"
    >
        <t-form
            ref="MODIFY_QUESTION_FORM"
            :rules="questionFormRules"
            :data="modifyQuestionForm"
        >
            <t-form-item label="题干" name="question_stem">
                <t-input
                    v-model="modifyQuestionForm.question_stem"
                    placeholder="请输入题干"
                />
            </t-form-item>

            <t-form-item label="选项" name="options">
                <t-tag-input
                    v-model="modifyQuestionForm.options"
                    clearable
                    :min-collapsed-num="0"
                    :max="26"
                    placeholder="请输入题目选项（Enter键确认）"
                >
                    <template #valueDisplay="{ value, onClose }">
                        <t-tag
                            v-for="(item, index) in value"
                            :key="index"
                            closable
                            style="margin-right: 4px"
                            @close="() => onClose(index)"
                        >
                            <span>{{ mapNumberToLetter(index) }}</span>
                            <span>:&nbsp;&nbsp;{{ item }}</span>
                        </t-tag>
                    </template>
                </t-tag-input>
            </t-form-item>

            <t-form-item label="答案" name="answer">
                <t-select v-model="modifyQuestionForm.answer">
                    <t-option
                        v-for="(item, index) in modifyQuestionForm.options"
                        :key="index"
                        :label="mapNumberToLetter(index)"
                        :value="mapNumberToLetter(index)"
                    />
                </t-select>
            </t-form-item>

            <t-form-item label="类型" name="type">
                <t-input
                    v-model="modifyQuestionForm.type"
                    placeholder="请输入题目类型"
                />
            </t-form-item>

            <t-form-item label="标签" name="tag">
                <t-tagInput
                    placeholder="请输入题目标签（Enter键确认）"
                    v-model="modifyQuestionForm.tag"
                />
            </t-form-item>
        </t-form>
    </t-dialog>

    <t-dialog
        header="删除面试题"
        v-model:visible="deleteQuestionVisible"
        :onConfirm="onDeleteQuestion"
    >
        确认删除岗位 (id: {{ deleteQuestionID }}) 吗？
    </t-dialog>
</template>

<script lang="tsx" setup>
    import { onMounted, ref } from 'vue';

    import {
        questionList,
        addQuestion,
        deleteQuestion,
        modifyQuestion
    } from '../../api/question';
    import { TableProps, MessagePlugin } from 'tdesign-vue-next';
    import { mapNumberToLetter } from '../../utils/index.ts';

    const initData = async () => {
        const res = await questionList();

        questionTableData.value = res;
        filterData.value = res;
        tableLoading.value = false;
        pagination.value.total = res.length;
    };

    onMounted(() => {
        initData();
    });

    /** search */
    const keyword = ref(null);

    const search = () => {};

    /** Table Config */
    const filterData = ref<TableProps['data']>([]);
    const questionTableData = ref<TableProps['data']>([]);
    const tableLoading = ref(false);

    const columns = ref<TableProps['columns']>([
        {
            colKey: 'id',
            title: 'id',
            align: 'center',
            width: 100
        },
        {
            colKey: 'question_stem',
            title: '题干',
            align: 'center',
            ellipsis: true
        },
        {
            colKey: 'options',
            align: 'center',
            title: '选项'
        },
        {
            colKey: 'answer',
            title: '答案',
            align: 'center',
            width: 100
        },
        {
            colKey: 'tag',
            title: '标签',
            align: 'center'
        },
        {
            colKey: 'type',
            title: '类型',
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
                        onClick={() => onModifyQuestionPre(row)}
                    >
                        修改
                    </t-button>
                    <t-button
                        variant="text"
                        theme="primary"
                        onClick={() => onDeleteQuestionPre(row)}
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

    /** 发布面试题 */
    const ADD_QUESTION_FORM = ref(null);

    const addQuestionVisible = ref(false);
    const questionFormRules = {
        question_stem: [{ required: true, message: '题干必填' }],
        options: [{ required: true, message: '选项必填' }],
        answer: [{ required: true, message: '答案必填' }],
        type: [{ required: true, message: '类型必填' }]
    };

    const addQuestionForm = ref({
        question_stem: null,
        options: [],
        answer: null,
        type: null,
        tag: []
    });

    const addQuestionPre = () => {
        ADD_QUESTION_FORM.value.reset();
        addQuestionVisible.value = true;
    };

    const onAddQuestion = async () => {
        const result = await (ADD_QUESTION_FORM.value as any).validateOnly();
        if (result === true) {
            await addQuestion(addQuestionForm.value);
            MessagePlugin.success({
                content: '发布成功'
            });
            addQuestionVisible.value = false;
            initData();
        } else {
            MessagePlugin.warning({
                content: '请填写表单必填项'
            });
        }
    };

    /** 修改面试题 */
    const MODIFY_QUESTION_FORM = ref(null);

    const modifyQuestionVisible = ref(false);

    const modifyQuestionForm = ref({
        id: null,
        question_stem: null,
        options: [],
        answer: '',
        type: null,
        tag: []
    });

    const onModifyQuestionPre = (row) => {
        const { id, question_stem, options, answer, type, tag } = row;

        modifyQuestionForm.value.id = id;
        modifyQuestionForm.value.question_stem = question_stem;
        modifyQuestionForm.value.options = JSON.parse(options);

        modifyQuestionForm.value.type = type;
        modifyQuestionForm.value.tag = JSON.parse(tag);
        modifyQuestionForm.value.answer = answer;
        modifyQuestionVisible.value = true;
    };

    const onModifyQuestion = async () => {
        const result = await (MODIFY_QUESTION_FORM.value as any).validateOnly();
        if (result === true) {
            await modifyQuestion(modifyQuestionForm.value);
            MessagePlugin.success({
                content: '发布成功'
            });

            modifyQuestionVisible.value = false;
            initData();
        } else {
            MessagePlugin.warning({
                content: '请填写表单必填项'
            });
        }
    };

    /** 删除面试题 */
    const deleteQuestionVisible = ref(false);
    const deleteQuestionID = ref(null);

    const onDeleteQuestionPre = (row) => {
        deleteQuestionID.value = row.id;
        deleteQuestionVisible.value = true;
    };

    const onDeleteQuestion = async () => {
        try {
            await deleteQuestion({
                id: deleteQuestionID.value
            });
            MessagePlugin.success({
                content: '面试题删除成功'
            });
            deleteQuestionVisible.value = false;
            initData();
        } catch (err) {
            MessagePlugin.error({
                content: '面试题删除成功'
            });
        }
    };
</script>

<style scoped></style>
