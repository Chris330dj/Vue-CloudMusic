<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';
@import '~common/styles/mixin';

.no-result {
  text-align: center;

  .no-result-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    bg-image('no-result');
    background-size: 80px 80px;
  }
  .no-result-text{
    margin-top 15px
    font-size $font-size-medium
    color #c6c6c6
    }
}
</style>