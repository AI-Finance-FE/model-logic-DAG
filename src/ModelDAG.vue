/*
 * @Author: Liangchenkang 
 * @Date: 2023-02-07 14:24:39 
 * @Last Modified by: Liangchenkang
 * @Last Modified time: 2023-07-28 16:23:22
 */
<template>
  <div
    class="DAG-warp"
    ref="dagWrap"
    :class="preview ? 'events-none' : ''"
  >
    <Stencil
      v-if="!preview"
      :graph="graph"
      :dnd="dnd"
      :stencils="stencils"
      :title="title"
    ></Stencil>
    <div class="graph-wrap">
      <div
        id="container"
        ref="container"
      >
      </div>
    </div>
  </div>
</template>
<script>
// antv
import { DagreLayout } from '@antv/layout'
// components
import Stencil from '@/components/Stencil'
// mixins
// !避免代码过度混乱mixin谨慎使用mixin！！！
import createNode from '@/mixins/createNode'
import initGraph from '@/mixins/initGraph'
// config
import { DEFAULT_COLOR } from '@/config/default'
export default {
  name: 'ModelDAG',
  components: { Stencil },
  mixins: [createNode, initGraph],
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    /**
     * 画布背景色
     */
    background: {
      type: Object,
      default() {
        return {}
      }
    },
    /**
     * 画布网格
     */
    grid: {
      type: [Object, Boolean],
      default: false
    },
    /**
     * 基础原子数据
     */
    stencils: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 边的限制关系
     */
    links: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 边的限制关系是否生效
     */
    linksLimit: {
      type: Boolean,
      default: true
    },
    /**
     * 工具栏title
     */
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      graph: {},
      dnd: {}
    }
  },
  computed: {
    graphSize() {
      return {
        height: this.graph.size.options.height,
        width: this.graph.size.options.width
      }
    }
  },
  mounted() {
    /**
     * 初始化画布
     * !此方法来源于mixins/initGraph.js
     */
    this.initGraph()
  },
  methods: {
    /**
    * @param { Object } edge object 边
    * @param { String } color string 颜色
    * @description 设置边以及边两边的链接桩的颜色
    */
    setEdgeAndPortColor(edge, color) {
      edge.setAttrs({
        line: {
          stroke: color
        }
      })
      /**
       * 当前版本暂时不修改连接桩颜色
       * 因为多条边对应同一个连接桩
       */
      // const sourceNode = edge.getSourceNode()
      // const targetNode = edge.getTargetNode()
      // const sourcePortId = edge.getSourcePortId()
      // const targetPortId = edge.getTargetPortId()
      // sourceNode.setPortProp(sourcePortId, 'attrs/inside', {
      //   fill: color
      // })
      // targetNode.setPortProp(targetPortId, 'attrs/inside', {
      //   fill: color
      // })
    },

    /**
     * Methods
     * 以下开始为组件暴露至外部调用方法
     * 以下开始为组件暴露至外部调用方法
     * 以下开始为组件暴露至外部调用方法
     */

    /**
     * 清空画布
     */
    clear() {
      this.graph.clearCells()
    },
    /**
     * 获取画布json
     */
    toGraphJSON() {
      return this.graph.toJSON()
    },
    /**
     * @param { Object } json 导入画布的数据
     * @description 导入画布数据
     */
    fromGraphJSON(json) {
      this.graph.fromJSON(json)
    },
    /**
     * 获取业务数据
     */
    getData() {
      const edges = this.graph.getEdges()
      const nodes = this.graph.getNodes()
      const data = []
      nodes.forEach(
        node => {
          const nodeInfo = {
            index: node.data.label,
            depends: [],
            params: {}
          }
          const nodeResult = data.find(d => d.index === node.data.label) || (data.push(nodeInfo) && nodeInfo)
          // nodeResult = nodeResult && data.push(nodeInfo) && nodeInfo
          edges.filter(
            edge => {
              const targetNode = edge.getTargetNode()
              const sourceNode = edge.getSourceNode()
              targetNode === node && nodeResult.depends.push(sourceNode.data.label)
            }
          )
        }
      )
      return data
    },
    /**
     * @param { Object } edge 边
     * @param { String } status 状态  success | fail
     * @description 设置边的状态 status也可以直接传入颜色设置为边的颜色
     */
    setEdgeStatus(edge, status) {
      let color
      switch (status) {
        case 'success':
          color = DEFAULT_COLOR.green
          break
        case 'fail':
          color = DEFAULT_COLOR.red
          break
        default:
          color = status || DEFAULT_COLOR.gray
          break
      }
      this.setEdgeAndPortColor(edge, color)
    },
    /**
     * @param {Object} cells:
     * {
     *   nodes: node[],
     *   edges: edge[]
     * }
     * node: {
     *   id: '',
     *   label: '',
     *   type: 'begin|model|rhombus'
     * }
     * edge: {
     *   source: 'sourceId',
     *   target: 'targetId',
     *   sourcePosition: '', 边的起始点位于元素的位置 通常为 'left' | 'top'
     *   targetPosition: ''  边的目标点位于元素的位置 通常为 'right' | 'bottom'
     * }
     * @param {Object} options:
     * {
     *   rankdir: 'TB', 布局的方向。T：top（上）；B：bottom（下）；L：left（左）；R：right（右）'TB' | 'BT' | 'LR' | 'RL'
     *   nodesep: 50, 节点间距（px）
     *   ranksep: 50 层间距（px）
     * }
     * @description 根据传入的nodes、edges生成元素，并自动排列
     */
    layout(cells, options = {}) {
      const { nodes = [], edges = [] } = cells
      const { rankdir = 'LR', nodesep = 50, ranksep = 50 } = options

      nodes.forEach(
        node => {
          const groupId = this.stencils?.find(i => i?.items?.find(r => r.id === node.id))?.id || ''
          // !createNode 来源于 mixins/createNode.js
          const nodeEle = this.createNode(
            this.graph,
            {
              type: node.type,
              data: { ...node, groupId }
            }
          )

          // node.id = nodeEle.id
          this.graph.addNode(nodeEle)
        }
      )

      const graphNodes = this.graph.getNodes()

      edges.forEach(
        edge => {
          const sourceNode = graphNodes.find(n => n.data.id === edge.source)
          const targetNode = graphNodes.find(n => n.data.id === edge.target)
          const { sourcePosition = 'left' } = edge
          const { targetPosition = 'right' } = edge
          const edgeEle = this.graph.createEdge({
            source: { cell: sourceNode.id, port: sourceNode.ports.items.find(p => p.group === targetPosition).id },
            target: { cell: targetNode.id, port: targetNode.ports.items.find(p => p.group === sourcePosition).id },
            data: edge?.data || {}
          })
          this.setEdgeAndPortColor(edgeEle, DEFAULT_COLOR.red)
          this.graph.addEdge(edgeEle)
        }
      )
      // const nodes = this.graph.getNodes()
      const graphEdges = this.graph.getEdges()
      const data = {
        nodes: graphNodes.map(node => {
          return {
            id: node.id,
            x: 0,
            y: 0
          }
        }),
        edges: graphEdges.map(edge => {
          return {
            source: edge.source.cell,
            target: edge.target.cell
          }
        })
      }
      const layout = new DagreLayout({
        rankdir, // 可选，默认为图的中心
        // align: 'DR', // 可选
        nodesep, // 可选
        ranksep, // 可选
        controlPoints: true // 可选
      })
      layout.layout(data)
      layout.nodes.forEach(
        layoutNode => {
          const { id, x, y } = layoutNode
          const node = graphNodes.find(n => n.id === id)
          node.position(x, y)
        }
      )
      this.graph.zoomToFit({
        padding: 20
      })
    },
    getCellById(id) {
      return this.graph.getCellById(id)
    }
  }
}
</script>
<style lang="scss" scoped>
.DAG-warp {
  display: flex;
  width: 100%;
  height: 100%;

  .graph-wrap {
    width: 100%;
    height: 100%;

    #container {
      width: 100%;
      height: 100%
    }
  }
}
</style>

<style lang="scss">
@import '@/styles/var.scss';

.port-magnet-available-highlight {
  .outside {
    fill: #cbeecb !important;
    stroke: #cbeecb !important;
  }
}

.port-magnet-available-highlight {
  .inside {
    fill: #17b573 !important;
  }
}

.port-magnet-adsorbed-highlight {
  .outside {
    fill: #b4c4eb !important;
    stroke: #b4c4eb !important;
  }
}

.port-magnet-adsorbed-highlight {
  .inside {
    fill: $--default-color !important;
  }
}

.events-none {
  pointer-events: none;
}
</style>