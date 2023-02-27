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
    ></ModelDAG>
    <!-- <button @click="handleExport">导出</button> -->
  </div>
</template>
<script>
import ModelDAG from '@/'
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
      ],
      links: [
        {
          target: '2',
          source: '1'
        }
      ]
    }
  },
  methods: {
    handleExport() {
      console.log(this.$refs.modelDAG.getData())
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
