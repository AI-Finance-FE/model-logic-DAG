/*
 * @Author: Liangchenkang 
 * @Date: 2023-02-28 09:46:56 
 * @Last Modified by: Liangchenkang
 * @Last Modified time: 2023-05-25 13:00:29
 * @Description: 菱形节点
 */
<template>
  <div class="rhombus-node-warp">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 148 88"
      version="1.1"
      preserveAspectRatio="none"
    >
      <defs>
        <filter
          x="-21.9%"
          y="-27.8%"
          width="143.8%"
          height="177.8%"
          filterUnits="objectBoundingBox"
          id="filter-2"
        >
          <feOffset
            dx="0"
            dy="10"
            in="SourceAlpha"
            result="shadowOffsetOuter1"
          ></feOffset>
          <feGaussianBlur
            stdDeviation="10"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          ></feGaussianBlur>
          <feComposite
            in="shadowBlurOuter1"
            in2="SourceAlpha"
            operator="out"
            result="shadowBlurOuter1"
          ></feComposite>
          <feColorMatrix
            values="0 0 0 0 0   0 0 0 0 0.0911741012   0 0 0 0 0.315104167  0 0 0 0.06 0"
            type="matrix"
            in="shadowBlurOuter1"
          ></feColorMatrix>
          <feBlend
            in="SourceGraphic"
            in2="offOut"
            mode="normal"
          />
        </filter>
      </defs>
      <g
        id="页面-1"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <g
          transform="translate(-1257.000000, -135.000000)"
          fill="#FFFFFF"
          stroke="#89A7F1"
        >
          <g transform="translate(535.000000, 135.768170)">
            <path
              d="M790.361996,1.97688132 C793.862751,0.00770622564 798.137249,0.00770622564 801.638004,1.97688132 L866.458064,38.4381647 C867.781798,39.1827652 868.678405,40.3934237 869.057929,41.7488656 C869.437453,43.1043075 869.299893,44.6045328 868.555292,45.928267 C868.061454,46.8062017 867.335998,47.5316574 866.458064,48.0254956 L801.638004,84.4867791 C798.137249,86.4559541 793.862751,86.4559541 790.361996,84.4867791 L725.541936,48.0254956 C724.218202,47.2808952 723.321595,46.0702367 722.942071,44.7147948 C722.562547,43.3593529 722.700107,41.8591275 723.444708,40.5353934 C723.938546,39.6574587 724.664002,38.932003 725.541936,38.4381647 Z"
              filter="url(#filter-2)"
            ></path>
          </g>
        </g>
      </g>
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        fill="#000000"
        font-size="16"
        style="transform: translateY(5px);"
      >
        {{ label }}
      </text>
    </svg>
    <!-- <p class="label">{{ label }}</p> -->
  </div>
</template>
<script>
export default {
  name: 'RhombusNode',
  inject: ['getNode'],
  data() {
    return {
      label: ''
    }
  },
  mounted() {
    const node = this.getNode()
    const {
      data: { label }
    } = node
    this.label = label
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/var.scss';

.rhombus-node-warp {
  /* position: relative; */

  .label {
    font-size: 16px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
  }
}
</style>