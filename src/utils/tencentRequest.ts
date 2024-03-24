import axios from 'axios';
import { addPost } from '../api/post.js';

const service = axios.create({
    baseURL: 'https://join.qq.com',
    timeout: 30000
});

function request(config) {
    return service(config);
}

export const tencentTest = (id) => {
    return request({
        method: 'GET',
        url: '/api/v1/jobDetails/getJobDetailsByPidAndId',
        params: {
            timestamp: +new Date(),
            pid: 1,
            id
        }
    });
};

const arr = [
    101, 102, 103, 104, 105, 106, 107, 112, 114, 137, 144, 176, 177, 178, 179,
    180, 191, 194, 221, 232, 233, 236, 237, 238, 255, 256, 257, 262
];
const result = [];
arr.forEach(async (item) => {
    const { data } = await tencentTest(item);
    const { title, request } = data;

    result.push({
        company: '腾讯',
        post: title,
        type: '1',
        contact: `https://join.qq.com/post_detail.html?pid=1&id=${item}&tid=2`,
        description: request,
        publisher: 1
    });
});
