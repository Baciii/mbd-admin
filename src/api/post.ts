import { request } from '../utils/request';

export const postList = (): Promise<NetReq.PostList[]> => {
    return request({
        method: 'GET',
        url: '/api/getPost'
    });
};

export const addPost = (data: NetParams.AddPost) => {
    return request({
        method: 'POST',
        url: '/api/addPost',
        data
    });
};

export const deletePost = (data: NetParams.DeletePost) => {
    return request({
        method: 'DELETE',
        url: '/api/deletePost',
        data
    });
};

export const modifyPost = (data: NetParams.ModifyPost) => {
    return request({
        method: 'POST',
        url: '/api/modifyPost',
        data
    });
};
