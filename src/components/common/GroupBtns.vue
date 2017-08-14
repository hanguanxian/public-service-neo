<template>
    <div style="margin: 15px 0;">
        <el-button v-for="(button, index) in childBtns"
             :key="index"
             @click="button.event">{{ button.name }}</el-button>
    </div>
</template>

<script>

    export default {
        props: ['childBtns'],
        data: function(){
            return {
            }
        },
        computed: {
        },
        methods: {

        }
    }
</script>
