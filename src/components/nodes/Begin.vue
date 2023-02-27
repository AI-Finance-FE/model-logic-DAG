/*
 * @Author: Liangchenkang 
 * @Date: 2023-02-20 16:29:57 
 * @Last Modified by: Liangchenkang
 * @Last Modified time: 2023-02-27 09:38:30
 * @Description: 开始节点
 */

<template>
  <div class="begin-node">
    <span>开始</span>
  </div>
</template>
<script>
export default {
  name: 'Begin'
}
</script>
<style lang="scss" scoped>
@import '@/styles/var.scss';

.begin-node {
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
