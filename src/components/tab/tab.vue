<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script>
import MHeader from '@/components/m-header/m-header'
export default {
  
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/styles/variable"
    
    .tab
        background-color $color-sub-background
        display flex
        height 44px
        width 100%
        line-height 44px
        font-size:0
        // z-index 10
      .tab-item
        flex 1
        text-align center
        .tab-link
            padding-bottom .3125rem
            color $color-theme-l
            font-size $font-size-medium
        &.router-link-active
            .tab-link
                color $color-sub-theme
                border-bottom .125rem solid $color-sub-theme
</style>
