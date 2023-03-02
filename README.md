# model-logic-DAG

这是一个可用于模型、服务链式调用配置的DAG工具

## Install

```
npm i model-logic-dag --save
```

## Usage

在页面中使用

.vue file:

```
<ModelDAG
  ref="modelDAG"
  :stencils="stencils"
  :links="links"
></ModelDAG>
```

```js
import ModelDAG from 'model-logic-dag'
export default {
  components: { ModelDAG }
}
```

### Attributes

|  参数   |  说明  |  类型  |  可选值  |  默认值  |  
|  ----  | ----  | ----  | ----  | ----  |
| stencils  | 工具栏元素数据  |  Array[stencil] | - | [] |
| links  | 元素连接线限制关系 | Array[link] | - | [] |
| linksLimit  | 是否开启元素连线关系限制，默认开启，需要传入```links```，存在links中的关系才允许被连线，为```false```时```links```参数无效 | Boolean | - | true |
| background  | 画布背景 | Object | - | {} |
| grid  | 画布网格 | Object | - | {} |

#### stencils示例

```
[
  {
    groupName: '原子能力',
    id: '1',
    items: [
      {
        label: '人头检测'
      },
      {
        label: '现金检测'
      },
      {
        label: '火焰检测'
      }
    ]
  },
  {
    groupName: '通用组件',
    id: '2',
    items: [
      {
        label: '逻辑判断'
      }
    ]
  }
]
```

#### links示例

```
[
  {
    target: '2',
    source: '1'
  }
]
```
一组```link```包含一个```source```和一个```target```，当关系存在于```links```中时，连线关系才可以被建立，否则无法连接元素

### Events

| 事件名   |  说明  |  会调参数  |
|  ----  | ----  | ----  |
| link-click  | 点击关系线时触发  |  (sourceNode, targetNode)  |
| node-click  | 点击节点时触发 | (inputNodes, outputNodes) |

### Methods

| 方法名   |  说明  |  参数  |
|  ----  | ----  | ----  |
| toGraphJSON  | 获取画布数据，用于还原画布  |  - |
| getData  | 获取业务数据 | - |
| setEdgeStatus  | 设置边的状态 | (edge: 边, status: 'success' \| 'fail') 也可以直接传入颜色来设置 |
