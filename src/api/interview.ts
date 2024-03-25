import { request } from '../utils/request';

export const interviewList = (): Promise<NetReq.InterviewList[]> => {
    return request({
        method: 'GET',
        url: '/api/interviewList'
    });
};

export const addInterview = (data: NetParams.AddInterview) => {
    return request({
        method: 'POST',
        url: '/api/addInterview',
        data
    });
};

export const deleteInterview = (data: NetParams.DeleteInterview) => {
    return request({
        method: 'DELETE',
        url: '/api/deleteInterview',
        data
    });
};

export const modifyInterview = (data: NetParams.ModifyInterview) => {
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
