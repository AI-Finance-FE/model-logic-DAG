export const GRID_CONFIG = {
  visible: true,
  type: 'doubleMesh',
  args: [
    {
      color: '#eee', // 主网格线颜色
      thickness: 1 // 主网格线宽度
    },
    {
      color: '#ddd', // 次网格线颜色
      thickness: 1, // 次网格线宽度
      factor: 4 // 主次网格线间隔
    }
  ]
}