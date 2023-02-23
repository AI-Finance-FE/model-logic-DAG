/*
 * @Author: Liangchenkang 
 * @Date: 2023-02-07 14:24:39 
 * @Last Modified by: Liangchenkang
 * @Last Modified time: 2023-02-22 09:31:25
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
import BeginNode from '~/src/components/nodes/Begin.vue'
// config
import { GRID_CONFIG } from '@/config/default'
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
    stencils: {
      type: Array,
      default() {
        return []
      }
    },
    links: {
      type: Array,
      default() {
        return []
      }
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
          groups: {
            right: {
              position: 'right',
              attrs: {
                circle: {
                  magnet: true,
                  stroke: '#8f8f8f',
                  r: 5
                }
              }
            },
            left: {
              position: 'left',
              attrs: {
                circle: {
                  magnet: true,
                  stroke: '#8f8f8f',
                  r: 5
                }
              }
            }
          }
        }
      })
      register({
        shape: 'begin-node',
        width: 180,
        height: 48,
        component: BeginNode,
        ports: {
          groups: {
            right: {
              position: 'right',
              attrs: {
                circle: {
                  magnet: true,
                  stroke: '#8f8f8f',
                  r: 5
                }
              }
            }
          }
        }
      })
    },
    /**
     * 初始化画布
     */
    initGraph() {
      const graph = new Graph({
        container: this.$refs.container,
        autoResize: true,
        scaling: { min: 0.1, max: 16 },
        background: {
          ...this.background
        },
        panning: true,
        mousewheel: true,
        grid: this.grid || GRID_CONFIG,
        highlighting: {
          // 连接桩可以被连接时在连接桩外围围渲染一个包围框
          magnetAvailable: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#fff',
                stroke: '#A4DEB1',
                strokeWidth: 4
              }
            }
          },
          // 连接桩吸附连线时在连接桩外围围渲染一个包围框
          magnetAdsorbed: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#fff',
                stroke: '#31d0c6',
                strokeWidth: 4
              }
            }
          }
        },
        connecting: {
          highlight: true,
          // createEdge() {
          //   return this.createEdge({
          //     attrs: {
          //       line: {
          //         stroke: '#8f8f8f',
          //         strokeWidth: 1
          //       }
          //     }
          //   })
          // },
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
             * 结束节点不能为输出port 
             */
            const targetPortGroup = targetCell.ports.items.find(p => p.id === targetPort)?.group
            if (targetPortGroup === 'right') {
              return
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

            const sourceGroupId = sourceCell.data.groupId
            const targetGroupId = targetCell.data.groupId
            return this.links.some(
              link => {
                return link.source === sourceGroupId && link.target === targetGroupId
              }
            )
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
        width: 100,
        height: 40,
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
       * 监听连线点击
       * 返回线段的输入和输出节点
       */
      graph.on('edge:click', (data) => {
        const sourceNode = data.edge.getSourceNode()
        const targetNode = data.edge.getTargetNode()
        this.$emit('link-click', sourceNode, targetNode)
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
        this.$emit('node-click', inputNodes, outputNodes)
      })
    },

    /**
     * 获取画布json
     */
    toGraphJSON() {
      return this.graph.toJSON()
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
          let nodeResult = data.find(d => d.index === node.data.label)
          const nodeInfo = {
            index: node.data.label,
            depends: [],
            params: {}
          }
          nodeResult = !nodeResult && data.push(nodeInfo) && nodeInfo

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
    }
  }
}
</script>
<style scoped>
.DAG-warp {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>