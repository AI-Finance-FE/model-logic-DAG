/*
 * @Author: Liangchenkang 
 * @Date: 2023-02-20 14:05:05 
 * @Last Modified by: Liangchenkang
 * @Last Modified time: 2023-02-20 16:37:42
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
.model-node {
  box-sizing: border-box;
  background-color: white;
  display: flex;
  align-items: center;
  font-size: 12px;
  width: 180px;
  height: 48px;
  padding: 12px;
  box-shadow: 0 -1px 4px 0 rgb(209 209 209 / 50%),
    1px 1px 4px 0 rgb(217 217 217 / 50%);
  border-radius: 2px;
}
</style>