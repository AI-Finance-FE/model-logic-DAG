/**
 * 创建NODE
 */
import { ENodeTypes, ENodeDefaultSize } from '@/enums/node'
import { getNodeDefaultPorts } from '@/utils/node'
export default {
  methods: {
    /**
     * 
     * @param {Object} graph 
     * @param {Object} nodeData 
     * nodeData:
     * @param {String} type
     * @param {Number} width
     * @param {Number} height
     * @param {Number} x
     * @param {Number} y
     * @param {String} id
     * @param {Object} data
     * @returns {Object} node
     * @description 创建node
     */
    createNode(graph, nodeData) {
      const { data, type, width = ENodeDefaultSize[type].width, height = ENodeDefaultSize[type].height, x = 0, y = 0 } = nodeData
      const { id } = data
      const shape = ENodeTypes[type]
      const ports = getNodeDefaultPorts(id, type)
      return graph.createNode({
        shape,
        width,
        height,
        x,
        y,
        data: data,
        ports: ports
      })
    }
  }
}