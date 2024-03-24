<template>
    <div class="box">
        <t-menu
            theme="light"
            v-model="active"
            style="height: calc(100vh); position: fixed; top: 0px"
        >
            <template #logo>
                <img
                    height="28"
                    src="https://tdesign.gtimg.com/site/baseLogo-light.png"
                    alt="logo"
                />
            </template>
            <t-menu-item
                v-for="item in navList"
                :key="item.id"
                :value="item.id"
                @click="routerJump(item.id)"
            >
                <template #icon>
                    <t-icon :name="item.icon" />
                </template>
                {{ item.name }}
            </t-menu-item>
        </t-menu>
    </div>
</template>

<script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';

    const router = useRouter();
    const route = useRoute();

    const active = ref<string>(null);

    onMounted(() => {
        active.value = route.path.replace('/content/', '');
    });

    interface NavListI {
        name: string;
        id: string;
        icon: string;
    }

    const navList: NavListI[] = [
        {
            name: '用户管理',
            id: 'user',
            icon: 'usergroup'
        },
        {
            name: '岗位管理',
            id: 'post',
            icon: 'city-15'
        },
        {
            name: '面试题管理',
            id: 'question',
            icon: 'questionnaire'
        },
        {
            name: '面经管理',
            id: 'interview',
            icon: 'wave-right'
        },
        {
            name: '资料管理',
            id: 'study',
            icon: 'book'
        },
        {
            name: '登录页',
            id: 'login',
            icon: 'login'
        }
    ];

    const routerJump = (id: string) => {
        router.push({
            name: id
        });
    };
</script>
