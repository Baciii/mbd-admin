<script setup lang="ts">
    import Nav from '../../components/Nav/index.vue';
</script>

<template>
    <div id="main">
        <Nav />
        <div id="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<style scoped>
    #main {
        position: relative;
    }

    #content {
        padding: 45px;
        width: calc(100vw - 248px);
        min-height: calc(100vh - 16px);
        margin-left: 240px;
        margin-top: 8px;
        background-color: #fff;
    }
</style>
