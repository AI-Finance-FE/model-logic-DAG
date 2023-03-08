/**
 * nodeType
 */
export const ENodeTypes = {
  model: 'model-node',
  begin: 'begin-node',
  rhombus: 'rhombus-node'
}

/**
 * 默认node尺寸
 */
export const ENodeDefaultSize = {
  model: {
    width: 140,
    height: 80
  },
  begin: {
    width: 140,
    height: 80
  },
  rhombus: {
    width: 160,
    height: 90
  }
}

/**
 * 内置node的默认ports list
 */
export const ENodePorts = {
  model: ['left', 'right'],
  begin: ['right'],
  rhombus: ['left', 'right', 'bottom']
}

export default {
  ENodeTypes,
  ENodePorts,
  ENodeDefaultSize
}