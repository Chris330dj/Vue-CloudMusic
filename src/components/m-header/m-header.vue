<template>
  <div class="m-header">
      <div class="icon"></div>
      <h1 class="text">Song of Bloom</h1>
      <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
      </router-link>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/styles/variable"
    @import "~common/styles/mixin"
    
    .m-header
        position: relative
        height: 44px
        width: 100%
        text-align: center
        background-color : $color-sub-background
        color $color-theme-l
        font-size 0
        // z-index 10
        .icon
            display inline-block
            vertical-align top
            margin-top .375rem
            width 1.875rem
            height 2rem
            margin-right .5625rem
            bg-image('logo3')
            background-size 1.875rem 2rem
        .text
            display inline-block
            vertical-align top
            line-height 44px
            font-size $font-size-large
        .mine
            position absolute
            top 0
            left 0
            .icon-mine
                display block
                padding 12px 20px
                font-size 20px
                color $color-theme-l
</style>