<style>
    #nav{position:fixed;  bottom:0;  height:50px;  left:0;  width:100%;  border-top:1px solid #ccc;  background:#fff;  }
    .home{padding-bottom:70px;  }
</style>

<template>
    <Page class="home">

        <keep-alive>
            <router-view />
        </keep-alive>

        <div id="nav" class='flex'>
            <div class='flex-item expand flex center' @click="$router.replace('/index')">index</div>
            <div class='flex-item expand flex center' @click="$router.replace('/user')">user</div>
        </div>

    </Page>
</template>