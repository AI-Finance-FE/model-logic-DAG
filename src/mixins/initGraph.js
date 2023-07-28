/**
 * 注册节点初始化画布
 */
// antv
import { register } from '@antv/x6-vue-shape'
import { Graph } from '@antv/x6'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Dnd } from '@antv/x6-plugin-dnd'
import { Selection } from '@antv/x6-plugin-selection'
// node
import ModelNode from '@/components/nodes/Model'
import BeginNode from '~/src/components/nodes/Begin'
import EndNode from '~/src/components/nodes/End'
import RhombusNode from '~/src/components/nodes/Rhombus'
// config
import { GRID_CONFIG, BACKGROUND_CONFIG, PORTS_GROUPS, DEFAULT_COLOR } from '@/config/default'
export default {
  methods: {
    initGraph() {
      this.registerNodes()
      this.newGraph()
      this.initHighlighter()
    },
    /**
     * 初始化画布
     */
    newGraph() {
      const graph = new Graph({
        container: this.$refs.container,
        autoResize: true,
        scaling: { min: 0.1, max: 16 },
        background: {
          ...BACKGROUND_CONFIG,
          ...this.background
        },
        panning: true,
        mousewheel: {
          enabled: true,
          factor: 1.1
        },
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
          validateConnection: ({ sourceCell, targetCell, targetPort, sourcePort }) => {
            /**
             * 元素左、上的连接桩为输入点
             * 元素右、下的连接桩为输出点
             */
            /**
             * 结束节点不能为输出port
             */
            const targetPortGroup = targetCell.ports.items.find(p => p.id === targetPort)?.group
            const sourcePortGroup = sourceCell.ports.items.find(p => p.id === sourcePort)?.group
            if (targetPortGroup === 'right' || targetPortGroup === 'bottom') {
              return false
            }

            /**
             * 开始节点不能为输入port
             */
            if (sourcePortGroup === 'left' || targetPortGroup === 'top') {
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
              console.log(sourceCell, targetCell)
              const sourceGroupId = sourceCell.data.groupId
              const targetGroupId = targetCell.data.groupId
              console.log(sourceGroupId, targetGroupId)
              return this.links.some(link => {
                return link.source === sourceGroupId && link.target === targetGroupId
              })
            }
            return true
          }
        }
      })
      this.graph = graph
      // 启用对齐线
      graph.use(
        new Snapline({
          enabled: true
        })
      )

      // 启用框选功能
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
        getDragNode: node => node.clone({ keepId: true }),
        getDropNode: node => node.clone({ keepId: true })
      })
      this.dnd = dnd

      // !createNode 来源于 mixins/createNode.js
      const beginNode = this.createNode(graph, {
        type: 'begin',
        data: {
          id: 'begin-node'
        },
        x: 40,
        y: this.graphSize.height / 2 - 40
      })
      graph.addNode(beginNode)

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
      graph.on('edge:click', data => {
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
        edges.forEach(edge => {
          const sourceNode = edge.getSourceNode()
          const targetNode = edge.getTargetNode()
          sourceNode.id === clickNodeId && outputNodes.push(targetNode)
          targetNode.id === clickNodeId && inputNodes.push(sourceNode)
        })
        this.$emit('node-click', { node, inputNodes, outputNodes })
      })

      graph.on('edge:connected', ({ isNew, edge }) => {
        if (isNew) {
          const source = edge.getSourceCell()
          const target = edge.getTargetCell()
          this.$emit('linked', { edge, sourceNode: source, targetNode: target })
        }
      })

      // 添加边工具
      graph.on('edge:mouseenter', ({ cell }) => {
        cell.addTools([
          {
            name: 'button-remove',
            args: { distance: '50%' }
          }
        ])
      })

      // 删除边工具
      graph.on('edge:mouseleave', ({ cell }) => {
        if (cell.hasTool('button-remove')) {
          cell.removeTool('button-remove')
        }
      })

      // 添加节点工具
      graph.on('node:mouseenter', ({ node }) => {
        node.addTools([
          {
            name: 'button-remove',
            args: { x: 10, y: 10 }
          }
        ])
      })
      // 删除节点工具
      graph.on('node:mouseleave', ({ node }) => {
        if (node.hasTool('button-remove')) {
          node.removeTool('button-remove')
        }
      })
    },
    /**
     * 初始化高亮器
     * 用于连接桩高亮
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
     * 注册所有自定义节点
     */
    registerNodes() {
      //注册原子节点
      register({
        shape: 'model-node',
        component: ModelNode,
        ports: {
          groups: PORTS_GROUPS
        }
      })

      //注册开始节点
      register({
        shape: 'begin-node',
        component: BeginNode,
        ports: {
          groups: PORTS_GROUPS
        }
      })

      //注册结束节点
      register({
        shape: 'end-node',
        component: EndNode,
        ports: {
          groups: PORTS_GROUPS
        }
      })

      //注册菱形节点
      register({
        shape: 'rhombus-node',
        component: RhombusNode,
        ports: {
          groups: PORTS_GROUPS
        }
      })
    }
  }
}
