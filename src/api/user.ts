import { request } from '../utils/request';

export const login = (data: NetParams.Login): Promise<NetReq.Login> => {
    return request({
        method: 'POST',
        url: '/api/user/login',
        data
    });
};

export const userList = (): Promise<NetReq.UserList[]> => {
    return request({
        method: 'GET',
        url: '/api/user/userList'
    });
};

export const newUser = (data: NetParams.NewUser): Promise<NetReq.NewUser> => {
    return request({
        method: 'POST',
        url: '/api/user/register',
        data
    });
};

export const modifyUser = (data: NetParams.ModifyUser) => {
    return request({
        method: 'POST',
        url: '/api/user/modify',
        data
    });
};

export const deleteUser = (data: NetParams.DeleteUser) => {
    return request({
        method: 'DELETE',
        url: '/api/user/deleteUser',
        data
    });
};
