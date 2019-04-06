<template>
    <Page class="about">

        <HeaderTemp back='true'>news list</HeaderTemp>

        <router-link class='link flex acenter' :to=" '/content?id='+id " v-for='id in 20'>test{{id}}</router-link>
    </Page>
</template>
