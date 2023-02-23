/*
 * @Author: Liangchenkang 
 * @Date: 2023-02-20 14:06:32 
 * @Last Modified by: Liangchenkang
 * @Last Modified time: 2023-02-21 17:16:20
 * @Description: 工具栏
 */
<template>
  <div
    id="stencil-container"
    ref="stencilContainer"
  >
    <!-- Group -->
    <div
      v-for="(stencilGroup, groupIndex) in stencils"
      :key="groupIndex"
      class="group-wrap"
    >
      <h6 class="group-title">{{ stencilGroup.groupName }}</h6>
      <div class="items-wrap">
        <div
          v-for="(stencil, stencilIndex) in stencilGroup.items"
          :key="stencilIndex"
          class="item"
          @mousedown="startDrag($event, stencilGroup, stencil)"
        >{{ stencil.label }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import * as X6 from '@antv/x6'
const commonAttrs = {
  body: {
    fill: '#fff',
    stroke: '#8f8f8f',
    strokeWidth: 1
  }
}
export default {
  name: 'Stencil',
  props: {
    graph: {
      type: X6.Graph,
      required: true,
      default() {
        return {}
      }
    },
    dnd: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    stencils: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    startDrag(e, stencilGroup, stencil) {
      const type = 'rect'
      const node =
        type === 'rect'
          ? this.graph.createNode({
            shape: 'model-node',
            x: 100,
            y: 100,
            attrs: commonAttrs,
            data: {
              label: stencil.label,
              groupId: stencilGroup.id
            },
            ports: {
              items: [
                {
                  id: 'port_1',
                  group: 'right'
                },
                {
                  id: 'port_2',
                  group: 'left'
                }
              ]
            }
          })
          : this.graph.createNode({
            width: 60,
            height: 60,
            shape: 'circle',
            label: 'Circle',
            attrs: {
              body: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
                fill: '#fff'
              }
            }
          })
      this.dnd.start(node, e)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/var.scss';
#stencil-container {
  position: relative;
  flex-shrink: 0;
  width: 220px;
  border-right: 1px solid #8080805c;
  padding: 14px;

  .group-wrap {
    .group-title {
      padding: 7px;
      font-size: 14px;
      background: $--fair-background;
      margin: 0;
    }

    .items-wrap {
      display: flex;
      flex-wrap: wrap;
      padding: 7px;

      .item {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: pointer;
        width: calc(50% - 7px);
        border: 1px solid $--fair-background;
        height: 42px;
        box-shadow: $--basic-boxShadow;
        border-radius: 4px;

        &:nth-child(2n - 1) {
          margin-right: 7px;
        }

        &:not(:nth-last-child(2)):not(:last-child) {
          margin-bottom: 7px;
        }
      }
    }
  }
}
</style>