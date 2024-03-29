export const DEFAULT_COLOR = {
  red: '#FF6121',
  green: '#17B573',
  blue: '#5E8BF7',
  gray: '#A9AEB8'
}

/**
 * 网格设置
 */
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

/**
 * 背景色设置
 */
export const BACKGROUND_CONFIG = {
  color: '#EEF1F3'
}

/**
 * 连接桩markup
 */
const portsMarkup = [
  {
    tagName: 'g',
    selector: 'port',
    children: [
      {
        tagName: 'circle',
        selector: 'outside',
        className: 'outside'
      },
      {
        tagName: 'circle',
        selector: 'inside',
        className: 'inside'
      }
    ]
  }
]

/**
 * 连接桩样式
 */
const portsAttrs = {
  outside: {
    magnet: true,
    fill: '#ffffff',
    r: 8,
    stroke: '#E3E6EC',
    strokeWidth: 1
  },
  inside: {
    magnet: true,
    fill: '#E3E6EC',
    r: 3
  }
}

/**
 * 连接桩group
 */
export const PORTS_GROUPS = {
  left: {
    position: 'left',
    markup: portsMarkup,
    attrs: portsAttrs
  },
  right: {
    position: 'right',
    markup: portsMarkup,
    attrs: portsAttrs
  },
  bottom: {
    position: 'bottom',
    markup: portsMarkup,
    attrs: portsAttrs
  },
  top: {
    position: 'top',
    markup: portsMarkup,
    attrs: portsAttrs
  }
}

export default {
  DEFAULT_COLOR,
  GRID_CONFIG,
  BACKGROUND_CONFIG,
  PORTS_GROUPS
}