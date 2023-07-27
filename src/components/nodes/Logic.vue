/*
 * @Author: Liangchenkang 
 * @Date: 2023-07-27 10:44:26 
 * @Last Modified by:   Liangchenkang 
 * @Last Modified time: 2023-07-27 10:44:26 
 */

<template>
  <div class="logic-node">
    <p>{{ label }}</p>
  </div>
</template>
<script>
export default {
  name: 'LogicNode',
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

.logic-node {
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