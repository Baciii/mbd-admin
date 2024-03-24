import { request } from '../utils/request';

export const questionList = (): Promise<NetReq.QuestionList[]> => {
    return request({
        method: 'GET',
        url: '/api/questionList'
    });
};

export const addQuestion = (data) => {
    return request({
        method: 'POST',
        url: '/api/addQuestion',
        data
    });
};

export const deleteQuestion = (data) => {
    return request({
        method: 'DELETE',
        url: '/api/deleteQuestion',
        data
    });
};

export const modifyQuestion = (data) => {
    return request({
        method: 'POST',
        url: '/api/modifyQuestion',
        data
    });
};
