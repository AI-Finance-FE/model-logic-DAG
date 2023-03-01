/*
 * @Author: Liangchenkang 
 * @Date: 2023-02-20 14:06:32 
 * @Last Modified by: Liangchenkang
 * @Last Modified time: 2023-03-01 14:23:19
 * @Description: 工具栏
 */
<template>
  <div
    id="stencil-container"
    ref="stencilContainer"
  >
    <h1 class="title">{{ title }}</h1>
    <!-- Group -->
    <div
      v-for="(stencilGroup, groupIndex) in stencilsData"
      :key="groupIndex"
      class="group-wrap"
    >
      <h6 class="group-title">
        <div class="left">
          <span class="line"></span>
          {{ stencilGroup.groupName }}
        </div>
        <span
          v-if="stencilGroup.items.length > 6"
          class="triangle"
          :class="stencilGroup.expand ? 'expand' : ''"
          @click="toggleExpand(stencilGroup)"
        ></span>
      </h6>
      <div
        class="items-wrap"
        :class="stencilGroup.expand ? 'expand' : ''"
      >
        <div
          v-for="(stencil, stencilIndex) in stencilGroup.items"
          v-show="(!stencilGroup.expand && stencilIndex <= 5) || stencilGroup.expand"
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
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      stencilsData: []
    }
  },
  mounted() {
    this.stencilsData = JSON.parse(JSON.stringify(this.stencils))
  },
  methods: {
    startDrag(e, stencilGroup, stencil) {
      const node = stencil.label === '逻辑判断' ? this.graph.createNode({
        shape: 'rhombus-node',
        width: 160,
        height: 90,
        data: {
          label: stencil.label,
          groupId: stencilGroup.id
        },
        ports: {
          items: [
            {
              id: 'port_1',
              group: 'left'
            },
            {
              id: 'port_2',
              group: 'right'
            },
            {
              id: 'port_3',
              group: 'bottom'
            }
          ]
        }
      }) : this.graph.createNode({
        shape: 'model-node',
        width: 140,
        height: 80,
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
      this.dnd.start(node, e)
    },
    toggleExpand(stencilGroup) {
      this.$set(stencilGroup, 'expand', !stencilGroup.expand)
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
  padding: 24px 20px;
  overflow-y: auto;
  box-sizing: content-box;
  background-color: #ffffff;

  .title {
    font-size: 18px;
    font-weight: 600;
    color: #232426;
    margin: 0;
    margin-bottom: 24px;
  }

  .group-wrap {
    box-shadow: 0px 4px 8px 0px rgba(0, 23, 80, 0.06);
    border-radius: 8px;
    border: 1px solid #e3e6ec;
    padding: 10px;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    .group-title {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      background: $--fair-background;
      margin: 0;
      height: 34px;
      border-radius: 8px;
      padding: 8px 0;
      margin-bottom: 10px;

      .left {
        display: flex;
        height: 100%;
        align-items: center;

        .line {
          background-color: #2a60e6;
          width: 3px;
          height: 100%;
          margin-right: 13px;
        }
      }

      .triangle {
        width: 5px;
        height: 10px;
        background-color: #9ca8bb;
        clip-path: polygon(0 0, 0% 100%, 100% 50%);
        margin-right: 10px;
        cursor: pointer;
        transition: all 0.3s linear;
      }

      .expand {
        transform: rotate(90deg);
      }
    }

    .items-wrap {
      display: flex;
      flex-wrap: wrap;
      transition: max-height 0.3s linear;

      .item {
        background: #fbfbfb;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: pointer;
        width: calc(50% - 7px);
        border: 1px solid $--fair-background;
        height: 56px;
        // box-shadow: $--basic-boxShadow;
        border-radius: 8px;

        &:nth-child(2n - 1) {
          margin-right: 7px;
        }

        &:not(:nth-last-child(2)):not(:last-child) {
          margin-bottom: 7px;
        }
      }
    }

    .expand {
      max-height: 9999px;
    }
  }
}
</style>