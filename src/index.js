/*
 * @Author: Liangchenkang
 * @Date: 2023-02-07 14:24:42
 * @Last Modified by: Liangchenkang
 * @Last Modified time: 2023-05-25 16:39:22
 */
import ModelDAG from './ModelDAG.vue'

const flat = (arr, deep) => {
  if (deep > 0) {
    return arr.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? flat(cur, deep - 1) : cur), [])
  }
  return arr.slice()
}
if (!Array.flat) {
  Object.defineProperty(Array.prototype, 'flat', flat)
}

export default ModelDAG
