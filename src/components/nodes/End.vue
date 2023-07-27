/*
 * @Author: Liangchenkang 
 * @Date: 2023-07-27 09:54:17 
 * @Last Modified by: Liangchenkang
 * @Last Modified time: 2023-07-27 10:00:17
 */

<template>
  <div class="end-node">
    <span>结束</span>
  </div>
</template>
<script>
export default {
  name: 'End'
}
</script>
<style lang="scss" scoped>
@import '@/styles/var.scss';

.end-node {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  font-size: $--node-fontSize;
  background: $--default-color;
  box-shadow: $--node-boxShadow;
  border-radius: 8px;
  color: #ffffff;
}
</style>
