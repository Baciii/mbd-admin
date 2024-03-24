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
}
