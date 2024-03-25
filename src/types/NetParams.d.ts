declare module NetParams {
    interface Login {
        username: string;
        password: string;
    }

    interface NewUser {
        username: string;
        password: string;
        type: 0 | 1 | 2 | 3 | '0' | '1' | '2' | '3';
    }

    interface ModifyUser {
        id: number;
        type: 0 | 1 | 2 | 3 | '0' | '1' | '2' | '3';
    }

    interface DeleteUser {
        id: number;
    }

    interface AddPost {
        company: string;
        post: string;
        type: string;
        contact: string;
        description: string;
        publisher: string;
    }

    interface DeletePost {
        id: number;
    }

    interface ModifyPost extends AddPost {
        id: number;
    }

    interface AddInterview {
        company: string;
        post: string;
        isPublic: string;
        content: string;
        publisher: string;
    }

    interface DeleteInterview {
        id: number;
    }

    interface ModifyInterview extends AddInterview {
        id: number;
    }

    interface AddQuestion {
        question_stem: string;
        options: string[];
        answer: string;
        type: string;
        tag: string[];
    }

    interface DeleteQuestion {
        id: number;
    }

    interface ModifyQuestion extends AddQuestion {
        id: number;
    }
}
