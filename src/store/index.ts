import { defineStore } from 'pinia';

export const userStore = defineStore('user', {
    persist: true,
    state: () => {
        return {
            id: null,
            username: null,
            type: null
        };
    },

    actions: {
        setID(id) {
            this.id = id;
        },

        setUsername(username) {
            this.username = username;
        },

        setType(type) {
            this.type = type;
        }
    }
});
