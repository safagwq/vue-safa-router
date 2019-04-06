<style>
    .HeaderTemp{position:fixed;  padding-top:20px;  top:0;  height:64px;  width:100%;  background:#233;  color:#fff;  }
    .HeaderTemp-back{position:absolute;  left:0;  bottom:0;  padding:0 16px;  height:44px;  }
</style>


<template>
    <div class='HeaderTemp flex center'>
        <span v-if='back' class='HeaderTemp-back flex center' @click="$router.back()">返回</span>
        <slot />
    </div>
</template>
<script>
    export default{
        props : ['back']
    }
</script>