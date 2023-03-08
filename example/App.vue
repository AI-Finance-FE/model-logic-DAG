<template>
  <div
    id="App"
    style="border:1px solid #8080805c"
  >
    <ModelDAG
      ref="modelDAG"
      :stencils="stencils"
      :links="links"
      title="现金违规放置检测"
      linksLimit
      @node-click="handleNodeClick"
    ></ModelDAG>
    <button @click="handleExport">导出</button>
  </div>
</template>
<script>
import ModelDAG from '@/'
// import ModelDAG from './../lib'
// import ModelDAG from 'model-logic-DAG'
export default {
  name: 'App',
  components: { ModelDAG },
  data() {
    return {
      stencils: [
        {
          groupName: '原子能力',
          id: '1',
          items: [
            {
              label: '人头检测',
              id: 1,
              type: 'model'
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
      ],
      links: [
        {
          target: '2',
          source: '1'
        },
        {
          target: '1',
          source: '2'
        }
      ]
    }
  },
  methods: {
    handleExport() {
      const cellsData = {
        nodes: [
          // push
          // {
          //   id: 'begin-node',
          //   label: '开始',
          //   type: 'begin'
          // },
          {
            id: '原子能力1',
            label: '原子能力1',
            type: 'model'
          },
          {
            id: '原子能力2',
            label: '原子能力2',
            type: 'model'
          },
          {
            id: '逻辑组件1',
            label: '逻辑组件',
            type: 'rhombus',
          }
        ],
        edges: [
          {
            source: 'begin-node',
            target: '原子能力1'
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
      // this.$refs.modelDAG.fromGraphJSON(data)
      this.$refs.modelDAG.layout(cellsData)
      // console.log(this.$refs.modelDAG.toGraphJSON())
    },
    handleNodeClick({ node }) {
      console.log(node)
    }
  }
}
</script>
<style lang="scss">
body {
  margin: 0 !important;
}

#App {
  width: 100%;
  height: 100vh;
}
</style>
