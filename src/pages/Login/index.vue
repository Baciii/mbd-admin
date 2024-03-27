<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
            fill="#0099ff"
            fill-opacity="1"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
    </svg>
    <div class="user">
        <i class="fa fa-user"></i>
        <div class="head">account login</div>
    </div>
    <div class="container">
        <div class="box login">
            <div class="form-content">
                <div class="avtar">
                    <div class="pic">
                        <img src="../../assets/header.png" alt="" />
                    </div>
                </div>
                <h1>Welcome back</h1>
                <form action="#" class="form">
                    <div>
                        <i class="fa fa-user-o"></i>
                        <input
                            v-model="username"
                            type="text"
                            placeholder="USERNAME"
                        />
                    </div>
                    <div>
                        <input
                            v-model="password"
                            type="password"
                            placeholder="PASSWORD"
                        />
                    </div>
                    <div class="btn">
                        <t-button @click="onLogin">login</t-button>
                    </div>
                </form>
                <p class="btn-something">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { login } from '../../api/user';
    import { useRouter } from 'vue-router';
    import { MessagePlugin } from 'tdesign-vue-next';
    import { userStore } from '../../store/index.ts';

    const user = userStore();

    const router = useRouter();

    const username = ref<string>(null);
    const password = ref<string>(null);

    const onLogin = async () => {
        try {
            const res = await login({
                username: username.value,
                password: password.value
            });
            const { id: ID, username: USERNAME, type, token } = res;
            if (['0', '1', '2'].includes(type)) {
                localStorage.setItem('TOKEN', token);

                /** 设置全局 id/username */
                user.setID(ID);
                user.setUsername(USERNAME);
                user.setType(type);

                MessagePlugin.success({
                    content: '登录成功'
                });

                router.push({
                    name: 'user'
                });
            } else {
                MessagePlugin.error({
                    content: '用户权限不足，无法登录'
                });
            }
        } catch (err) {
            console.log(err);
        }
    };
</script>

<style scoped>
    @import './index.css';
</style>
