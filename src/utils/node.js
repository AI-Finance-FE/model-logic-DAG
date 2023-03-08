/**
 * node相关方法
 */

/**
 * 
 * @param {String|Number} id
 * @param {String} type
 * @description 获取内置node ports
 * @returns 
 */
import { ENodePorts } from '@/enums/node'
export const getNodeDefaultPorts = (id, type) => {
  const getPortsItem = (direction) => {
    return {
      id: `${direction}-${id}`,
      group: direction
    }
  }
  return ENodePorts[type].map(getPortsItem)
}