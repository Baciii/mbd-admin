import { request } from '../utils/request';

export const questionList = (): Promise<NetReq.QuestionList[]> => {
    return request({
        method: 'GET',
        url: '/api/questionList'
    });
};

export const addQuestion = (data: NetParams.AddQuestion) => {
    return request({
        method: 'POST',
        url: '/api/addQuestion',
        data
    });
};

export const deleteQuestion = (data: NetParams.DeleteQuestion) => {
    return request({
        method: 'DELETE',
        url: '/api/deleteQuestion',
        data
    });
};

export const modifyQuestion = (data: NetParams.ModifyQuestion) => {
    return request({
        method: 'POST',
        url: '/api/modifyQuestion',
        data
    });
};

export const questionTypeList = (): Promise<NetReq.QuestionTypeList[]> => {
    return request({
        method: 'GET',
        url: '/api/questionTypeList'
    });
};
