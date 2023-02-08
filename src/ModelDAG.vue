/*
 * @Author: Liangchenkang 
 * @Date: 2023-02-07 14:24:39 
 * @Last Modified by: Liangchenkang
 * @Last Modified time: 2023-02-07 17:42:18
 */
<template>
  <div class="DAG-warp">
    <div
      id="stencil-container"
      ref="stencilContainer"
    ></div>
    <div
      id="container"
      ref="container"
    >
      ModelDAG
    </div>
  </div>
</template>
<script>
import { Graph } from '@antv/x6'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Stencil } from '@antv/x6-plugin-stencil'
const commonAttrs = {
  body: {
    fill: '#fff',
    stroke: '#8f8f8f',
    strokeWidth: 1
  }
}
export default {
  name: 'ModelDAG',
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const graph = new Graph({
        container: this.$refs.container,
        width: 800,
        height: 600,
        autoResize: true,
        scaling: { min: 0.1, max: 16 },
        // background: {
        //   color: '#F2F7FA'
        // },
        panning: true,
        mousewheel: true,
        grid: true
        // grid: {
        //   visible: true,
        //   type: 'doubleMesh',
        //   args: [
        //     {
        //       color: '#eee', // 主网格线颜色
        //       thickness: 1 // 主网格线宽度
        //     },
        //     {
        //       color: '#ddd', // 次网格线颜色
        //       thickness: 1, // 次网格线宽度
        //       factor: 4 // 主次网格线间隔
        //     }
        //   ]
        // }
      })

      graph.use(
        new Snapline({
          enabled: true
        })
      )

      const stencil = new Stencil({
        title: '流程原件',
        target: graph,
        search(cell, keyword) {
          return cell.label.indexOf(keyword) !== -1
        },
        placeholder: '输入名称',
        notFoundText: '无匹配',
        collapsable: true,
        stencilGraphWidth: 200,
        stencilGraphHeight: 0,
        groups: [
          {
            name: 'abilities',
            title: '原子能力'
          },
          {
            name: 'logic',
            title: '逻辑关系'
          }
        ]
      })

      const stencilContainer = this.$refs.stencilContainer
      stencilContainer.appendChild(stencil.container)

      const n1 = graph.createNode({
        shape: 'rect',
        x: 40,
        y: 40,
        width: 80,
        height: 40,
        label: '模型1',
        attrs: commonAttrs
      })

      const n2 = graph.createNode({
        shape: 'rect',
        x: 40,
        y: 40,
        width: 80,
        height: 40,
        label: '模型2',
        attrs: commonAttrs
      })

      const n3 = graph.createNode({
        shape: 'rect',
        x: 40,
        y: 40,
        width: 80,
        height: 40,
        label: '关系1',
        attrs: commonAttrs
      })

      const n4 = graph.createNode({
        shape: 'rect',
        x: 40,
        y: 40,
        width: 80,
        height: 40,
        label: '关系2',
        attrs: commonAttrs
      })

      stencil.load([n1, n2], 'abilities')
      stencil.load([n3, n4], 'logic')
    }
  }
}
</script>
<style scoped>
.DAG-warp {
  display: flex;
}

#stencil-container {
  position: relative;
  flex-shrink: 0;
  width: 200px;
}
</style>