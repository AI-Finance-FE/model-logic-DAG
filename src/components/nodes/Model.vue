/*
 * @Author: Liangchenkang 
 * @Date: 2023-02-20 14:05:05 
 * @Last Modified by: Liangchenkang
 * @Last Modified time: 2023-02-27 09:38:47
 * Description: 画布基础模型元素框
 */
<template>
  <div class="model-node">
    <p>{{ label }}</p>
  </div>
</template>
<script>
export default {
  name: 'ModelNode',
  inject: ['getNode'],
  data() {
    return {
      label: ''
    }
  },
  mounted() {
    const node = this.getNode()
    const {
      data: { label }
    } = node
    this.label = label
    // node.on('change:data', ({ current }) => {
    //   const { label } = current
    //   this.label = label
    // })
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/var.scss';

.model-node {
  box-sizing: border-box;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $--node-fontSize;
  width: 100%;
  height: 100%;
  box-shadow: $--node-boxShadow;
  border-radius: 8px;
  border: 1px solid $--default-borderColor;
}
</style>