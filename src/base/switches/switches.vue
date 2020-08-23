<template>
  <div class="switches">
    <li
      class="switch-item"
      v-for="(item, index) in switches"
      :key="index"
      :class="{'active':currentIndex === index}"
      @click="switchItem(index)"
    >
      <span>{{item.name}}</span>
    </li>
  </div>
</template>

<script>
export default {
  props: {
    switches: {
      type: Array
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem(index){
      this.$emit('switch', index)
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';

.switches {
  display: flex;
  align-items: center;
  width: 240px;
  margin: 0 auto;

  .switch-item {
    flex: 1;
    box-sizing border-box;
    height 32px
    padding: 8px;
    margin: 0 20px;
    text-align: center;
    font-size: $font-size-medium;
    color: $color-text;
    // border-bottom: 2px solid transparent;

    &.active {
      border-bottom: 2px solid $color-sub-theme;
    }
  }
}
</style>