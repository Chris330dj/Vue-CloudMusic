<template>
  <div class="loading">
    <img src="./loading.gif" alt="loading img" width="30" height="30" />
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "正在载入..."
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/styles/variable';

.loading {
  width: 100%;
  text-align: center;

  .desc {
    line-height: 20px;
    font-size: $font-size-small;
    color: $color-text-l;
  }
}
</style>