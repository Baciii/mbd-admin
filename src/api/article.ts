import { request } from '../utils/request';

export const articleList = (): Promise<any[]> => {
    return request({
        method: 'GET',
        url: '/api/articleList'
    });
};

export const addArticle = (data) => {
    return request({
        method: 'POST',
        url: '/api/addArticle',
        data
    });
};

export const deleteArticle = (data) => {
    return request({
        method: 'DELETE',
        url: '/api/deleteArticle',
        data
    });
};

export const modifyArticle = (data) => {
    return request({
        method: 'POST',
        url: '/api/modifyArticle',
        data
    });
};
