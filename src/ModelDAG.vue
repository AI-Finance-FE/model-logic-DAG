/*
 * @Author: Liangchenkang 
 * @Date: 2023-02-07 14:24:39 
 * @Last Modified by: Liangchenkang
 * @Last Modified time: 2023-03-03 16:01:49
 */
<template>
  <div
    class="DAG-warp"
    ref="dagWrap"
  >
    <Stencil
      :graph="graph"
      :dnd="dnd"
      :stencils="stencils"
      :title="title"
    ></Stencil>
    <div
      id="container"
      ref="container"
    >
    </div>
  </div>
</template>
<script>
// antv
import { Graph } from '@antv/x6'
import { Snapline } from '@antv/x6-plugin-snapline'
import { register } from '@antv/x6-vue-shape'
import { Dnd } from '@antv/x6-plugin-dnd'
import { Selection } from '@antv/x6-plugin-selection'
// node
import ModelNode from '@/components/nodes/Model'
import BeginNode from '~/src/components/nodes/Begin'
import RhombusNode from '~/src/components/nodes/Rhombus'
// config
import { GRID_CONFIG, BACKGROUND_CONFIG, PORTS_GROUPS, DEFAULT_COLOR } from '@/config/default'
// components
import Stencil from '@/components/Stencil'
export default {
  name: 'ModelDAG',
  components: { Stencil },
  props: {
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
    this.registerNodes()
    this.initGraph()
  },
  methods: {
    handleMyEvent(data) {
      console.log(data)
    },
    /**
     * 注册所有自定义节点
     */
    registerNodes() {
      //注册原子节点
      register({
        shape: 'model-node',
        width: 180,
        height: 48,
        // component: {
        //   render: h => h(ModelNode, {
        //     on: {
        //       // 监听 ModelNode组件触发的事件，获取传递出来的数据
        //       myEvent: (data) => {
        //         this.handleMyEvent(data)
        //       }
        //     }
        //   })
        // }
        component: ModelNode,
        ports: {
          groups: PORTS_GROUPS
        }
      })

      //注册开始节点
      register({
        shape: 'begin-node',
        width: 180,
        height: 48,
        component: BeginNode,
        ports: {
          groups: PORTS_GROUPS
        }
      })

      //注册菱形节点
      register({
        shape: 'rhombus-node',
        width: 160,
        height: 90,
        component: RhombusNode,
        ports: {
          groups: PORTS_GROUPS
        }
      })
    },
    /**
     * 初始化画布
     */
    initGraph() {
      this.initHighlighter()

      const graph = new Graph({
        container: this.$refs.container,
        autoResize: true,
        scaling: { min: 0.1, max: 16 },
        background: {
          ...BACKGROUND_CONFIG,
          ...this.background
        },
        panning: true,
        mousewheel: true,
        grid: this.grid || GRID_CONFIG,
        highlighting: {
          // 连接桩可以被连接时在连接桩外围围渲染一个包围框
          magnetAvailable: {
            name: 'availableHighlight'
          },
          // 连接桩吸附连线时在连接桩外围围渲染一个包围框
          magnetAdsorbed: {
            name: 'adsorbedHighlight',
            args: {
              attrs: {
                strokeWidth: 1,
                stroke: 'blue'
              }
            }
          }
        },
        connecting: {
          highlight: true,
          createEdge() {
            return this.createEdge({
              attrs: {
                line: {
                  stroke: DEFAULT_COLOR.gray,
                  strokeWidth: 2
                }
              }
            })
          },
          router: 'er',
          connector: 'rounded',
          allowBlank: false,
          allowMulti: false,
          allowLoop: false,
          allowNode: false,
          allowEdge: false,
          validateConnection: ({
            sourceCell,
            targetCell,
            targetPort
          }) => {
            /**
             * 元素左、上的连接桩为输入点
             * 元素右、下的连接桩为输出点
             */
            /**
             * 结束节点不能为输出port 
             */
            const targetPortGroup = targetCell.ports.items.find(p => p.id === targetPort)?.group
            if (targetPortGroup === 'right' || targetPortGroup === 'bottom') {
              return false
            }
            /**
             * 开始节点为开始
             */
            if (sourceCell.shape === 'begin-node') {
              return true
            }

            /**
             * 结束节点为开始
             */
            if (targetCell.shape === 'begin-node') {
              return false
            }

            if (this.linksLimit) {
              const sourceGroupId = sourceCell.data.groupId
              const targetGroupId = targetCell.data.groupId
              return this.links.some(
                link => {
                  return link.source === sourceGroupId && link.target === targetGroupId
                }
              )
            }
            return true
          }
        }
      })
      this.graph = graph

      //启用对齐线
      graph.use(
        new Snapline({
          enabled: true
        })
      )

      //启用框选功能
      graph.use(
        new Selection({
          enabled: true,
          multiple: true,
          rubberband: true,
          movable: true,
          showNodeSelectionBox: true,
          modifiers: ['alt']
        })
      )

      //启用DND
      const dnd = new Dnd({
        target: graph,
        // 这样放置到画布上的节点 ID 和 dnd start 传入的 node ID 一致
        getDragNode: (node) => node.clone({ keepId: true }),
        getDropNode: (node) => node.clone({ keepId: true })
      })
      this.dnd = dnd

      graph.addNode({
        shape: 'begin-node',
        x: 40,
        y: this.graphSize.height / 2,
        width: 140,
        height: 80,
        data: {
          label: '开始',
          type: 'begin-node'
        },
        ports: {
          items: [
            {
              id: 'port_1',
              group: 'right'
            }
          ]
        }
      })

      /**
       * 监听边的连接建立时
       */
      graph.on('edge:connected', ({ edge }) => {
        // 线被连上时设置线和两边链接桩为校验未通过的颜色
        this.setEdgeAndPortColor(edge, DEFAULT_COLOR.red)
      })

      /**
       * 监听连线点击
       * 返回线段的输入和输出节点
       */
      graph.on('edge:click', (data) => {
        const { edge } = data
        const sourceNode = data.edge.getSourceNode()
        const targetNode = data.edge.getTargetNode()
        this.$emit('link-click', { edge, sourceNode, targetNode })
      })

      /**
       * 监听点击节点
       * 返回数据为被点击节点的所有输入节点list以及输出节点list
       */
      graph.on('node:click', ({ node }) => {
        const clickNodeId = node.id
        const edges = graph.getEdges()
        const inputNodes = []
        const outputNodes = []
        /**
         * 通过所有边的遍历
         * 得到与点击节点所有有连接关系的节点
         * 将节点分为输入和输出两组返回
         */
        edges.forEach(
          edge => {
            const sourceNode = edge.getSourceNode()
            const targetNode = edge.getTargetNode()
            sourceNode.id === clickNodeId && outputNodes.push(targetNode)
            targetNode.id === clickNodeId && inputNodes.push(sourceNode)
          }
        )
        this.$emit('node-click', { node, inputNodes, outputNodes })
      })
    },

    /**
     * 初始化高亮器
     */
    initHighlighter() {
      const availableHighlight = {
        highlight(cellView, magnet) {
          magnet.parentElement.classList.add('port-magnet-available-highlight')
        },

        unhighlight(cellView, magnet) {
          magnet.parentElement.classList.remove('port-magnet-available-highlight')
        }
      }

      const adsorbedHighlight = {
        highlight(cellView, magnet, options) {
          magnet.parentElement.classList.add('port-magnet-adsorbed-highlight')
        },

        unhighlight(cellView, magnet) {
          magnet.parentElement.classList.remove('port-magnet-adsorbed-highlight')
        }
      }
      Graph.registerHighlighter('availableHighlight', availableHighlight, true)
      Graph.registerHighlighter('adsorbedHighlight', adsorbedHighlight, true)
    },

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
     * 以下开始为组件暴露至外部调用方法
     * 以下开始为组件暴露至外部调用方法
     * 以下开始为组件暴露至外部调用方法
     */

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
    }
  }
}
</script>
<style lang="scss" scoped>
.DAG-warp {
  display: flex;
  width: 100%;
  height: 100%;
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
</style>