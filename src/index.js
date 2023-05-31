/*
 * @Author: Liangchenkang
 * @Date: 2023-02-07 14:24:42
 * @Last Modified by: Liangchenkang
 * @Last Modified time: 2023-05-31 09:36:47
 */
import ModelDAG from './ModelDAG.vue'

function flat(depth = 1) {
return depth > 0
  ? this.reduce((acc, val) => acc.concat(Array.isArray(val) ? val.flat(depth - 1) : val), [])
  : Array.from(this);
}

// 将 flat 方法添加到 Array.prototype 上
if (!Array.prototype.flat) {
Object.defineProperty(Array.prototype, 'flat', {
  value: flat,
  writable: true,
  configurable: true
});
}

export default ModelDAG
