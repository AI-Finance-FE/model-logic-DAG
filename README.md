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
| preview  | 预览模式  |  Boolean | true \| false | false |
| stencils  | 工具栏元素数据  |  Array[stencil] | - | [] |
| links  | 元素连接线限制关系 | Array[link] | - | [] |
| linksLimit  | 是否开启元素连线关系限制，默认开启，需要传入```links```，存在links中的关系才允许被连线，为```false```时```links```参数无效 | Boolean | - | true |
| background  | 画布背景 | Object | - | {} |
| grid  | 画布网格 | Object | - | {} |

#### stencils示例

```
// item[].type 有以下类型
//   start |   end   |   model  |   rhombus  | logic
// 开始节点 ｜ 结束节点 ｜ 原子能力 ｜ 菱形逻辑节点 ｜ 逻辑节点
[
  {
    groupName: '原子能力',
    id: '1',
    items: [
      {
        label: '人头检测',
        type: 'model' //元素类型 默认为model
      },
      {
        label: '现金检测',
        type: 'model'
      },
      {
        label: '火焰检测',
        type: 'model'
      }
    ]
  },
  {
    groupName: '通用组件',
    id: '2',
    items: [
      {
        label: '逻辑判断',
        type: 'rhombus'
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

| 事件名   |  说明  |  回调参数  |
|  ----  | ----  | ----  |
| link-click  | 点击关系线时触发  |  ({link, sourceNode, targetNode})  |
| node-click  | 点击节点时触发 | ({node, inputNodes, outputNodes}) |
| linked  | 边连接时出发 | ({edge, sourceNode, targetNode}) |

### Methods

#### clear()

<div style="padding:18px 14px;color:#5c6b77;background:rgba(0,0,0,.02);border:1px solid #f0f0f0;margin-bottom: 14px;">clear()</div>

清空画布

#### layout(...)

<div style="padding:18px 14px;color:#5c6b77;background:rgba(0,0,0,.02);border:1px solid #f0f0f0;margin-bottom: 14px;">layout(cellsData: cellsData, options: options)</div>

<div style="border-radius:4px;padding:4px 8px;background:#b5b5b5;display:inline-block;color:white;margin-bottom: 14px;">参数</div>

| 名称   |  类型  |  是否必填  |  可选值  |  默认值  |  描述  |
|  ----  | ----  | ----  | ----  | ----  |  ----  |
| cellsData  | Object  |  是  |   -  |  -       |  需要被展示的元素数据  |
| cellsData.nodes  | Array  |  是  |   -  |  -       |  需要被展示的元素节点数据  |
| cellsData.edges  | Array  |  是  |   -  |  -       |  需要被展示的元素边数据  |
| nodes.id  | String  |  是  |   -  |  -       |  元素节点的ID  |
| nodes.label  | String  |  是  |   -  |  -       |  节点标签文字  |
| nodes.type  | String  |  是  |   'model' \| 'begin' \| 'rhombus'   |  -       |  节点的类型  |
| edge.source  | String  |  是  |   -  |  -       |  边的起始节点ID  |
| edge.target  | String  |  是  |   -  |  -       |  边的目标节点ID  |
| edge.sourcePosition  | String  |  否  |   'left' \| 'top'  |   ```right```     |  边的起始点位于元素的位置   |
| edge.targetPosition  | String  |  否  |   'right' \| 'bottom'  |   ```left```    |  边的目标点位于元素的位置  |

<div style="border-radius:4px;padding:4px 8px;background:#b5b5b5;display:inline-block;color:white;margin-bottom: 14px;">参数示例</div>

```
{
  nodes: [
    {
      id: '原子能力1',
      label: '原子能力1',
      type: 'model' // model为方形元素，通常用于原子能力
    },
    {
      id: '原子能力2',
      label: '原子能力2',
      type: 'model'
    },
    {
      id: '逻辑组件1',
      label: '逻辑组件',
      type: 'rhombus',  // rhombus为菱形元素，通常用于逻辑判断
    }
  ],
  edges: [
    {
      source: 'begin-node',
      target: '原子能力1',
      sourcePosition: 'right',
      targetPosition: 'left'
    },
    {
      source: 'begin-node',
      target: '原子能力2'
    },
    {
      source: '原子能力1',
      target: '逻辑组件1'
    },
    {
      source: '原子能力2',
      target: '逻辑组件1'
    }
  ]
}
```

#### setEdgeStatus()

<div style="padding:18px 14px;color:#5c6b77;background:rgba(0,0,0,.02);border:1px solid #f0f0f0;margin-bottom: 14px;">setEdgeStatus(edge: Edge.Metadata, status: 'success' | 'fail')</div>

设置边的状态

| 名称   |  类型  |  是否必填  |  可选值  |  默认值  |  描述  |
|  ----  | ----  | ----  | ----  | ----  |  ----  |
| edge  |  Object  |  是  |   -  |  -       |  需要被修改的边  |
| status  |  String  |  是  |   success \| fail  |   -   |  状态，也可以直接传入颜色来设置  |

#### toGraphJSON()

<div style="padding:18px 14px;color:#5c6b77;background:rgba(0,0,0,.02);border:1px solid #f0f0f0;margin-bottom: 14px;">toGraphJSON()</div>

获取画布数据，用于还原画布

#### fromGraphJSON(...)

<div style="padding:18px 14px;color:#5c6b77;background:rgba(0,0,0,.02);border:1px solid #f0f0f0;margin-bottom: 14px;">fromGraphJSON(cells: (Node.Metadata | Edge.Metadata)[])</div>

导入画布数据，还原画布

<div style="border-radius:4px;padding:4px 8px;background:#b5b5b5;display:inline-block;color:white;margin-bottom: 14px;">参数</div>

| 名称   |  类型  |  是否必填  |  可选值  |  默认值  |  描述  |
|  ----  | ----  | ----  | ----  | ----  |  ----  |
| cells  |  Array  |  是  |   -  |  -       |  导入画布数据，还原画布,数据来源一般为```toGraphJSON```中获取的数据  |

#### getData()

<div style="padding:18px 14px;color:#5c6b77;background:rgba(0,0,0,.02);border:1px solid #f0f0f0;margin-bottom: 14px;">getData()</div>

获取业务数据

#### getCellById()

<div style="padding:18px 14px;color:#5c6b77;background:rgba(0,0,0,.02);border:1px solid #f0f0f0;margin-bottom: 14px;">getCellById()</div>

根据cell.id获取cell数据