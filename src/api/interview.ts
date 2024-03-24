import { request } from '../utils/request';

export const interviewList = (): Promise<NetReq.InterviewList[]> => {
    return request({
        method: 'GET',
        url: '/api/interviewList'
    });
};

export const addInterview = (data) => {
    return request({
        method: 'POST',
        url: '/api/addInterview',
        data
    });
};

export const deleteInterview = (data) => {
    return request({
        method: 'DELETE',
        url: '/api/deleteInterview',
        data
    });
};

export const modifyInterview = (data) => {
    return request({
        method: 'POST',
        url: '/api/modifyInterview',
        data
    });
};

export const myInterview = (params) => {
    return request({
        method: 'GET',
        url: '/api/myInterview',
        params
    });
};
