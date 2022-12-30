<template>
  <h3 class="title-box">todos</h3>
  <Index />
</template>

<script>
import Index from '@/components/Index.vue'

export default {
  name: 'App',
  components: {
    Index
  }
}
</script>

<style lang="scss" scoped>
.title-box {
  font-size: 36px;
  margin-top: 0px;
  margin-bottom: 10px;
}
</style>
