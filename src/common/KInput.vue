<template>
  <div>
    <Input :placeholder="placeholder" v-model="msg" @on-blur="blur()"></Input>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        msg:this.model[this.type],
        m: this.model,
        v: this.model[this.type]
      }
    },
    props: {
      clearable: String,
      placeholder: String,
      model: Object,
      type: String
    },
    methods:{
      blur(){
        this.model[this.type] = this.msg;
      }
    }
  }
</script>
<style>
</style>
