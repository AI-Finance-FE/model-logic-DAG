/**
 * nodeType
 */
export const ENodeTypes = {
  model: 'model-node',
  logic: 'logic-node',
  begin: 'begin-node',
  end: 'end-node',
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
  logic: {
    width: 100,
    height: 60
  },
  begin: {
    width: 140,
    height: 80
  },
  end: {
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
  logic: ['left', 'right'],
  begin: ['right'],
  end: ['left'],
  rhombus: ['left', 'right', 'bottom']
}

export default {
  ENodeTypes,
  ENodePorts,
  ENodeDefaultSize
}
