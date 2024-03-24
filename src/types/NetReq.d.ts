declare module NetReq {
    interface Login {
        id: number;
        token: string;
    }

    interface UserList {
        id: string | number;
        type: string;
        username: string;
    }

    interface NewUser {
        id: number;
        username: string;
        password: string;
        type: number;
    }

    interface PostList {
        id: number;
        company: string;
        post: string;
        type: '1' | '2';
        contact: string;
        description: string;
        publisher: string;
    }

    interface QuestionList {
        id: number;
        answer: string;
        options: string;
        question_stem: string;
        tag: string;
        type: string;
    }
}
