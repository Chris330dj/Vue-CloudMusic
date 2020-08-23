<template>
  <div class="search-list">
    <ul>
      <li v-for="(item, index) in searches" :key="index" class="search-item" @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default: []
    }
  },
  methods:{
    selectItem(item){
      this.$emit('select', item)
    },
    deleteOne(item){
      this.$emit('delete', item)
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';

.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 28px;
    overflow: hidden;

    .text {
      flex: 1;
      color: $color-text;
      font-size: $font-size-medium;
    }

    .icon {
      .icon-delete {
        color: $color-text;
        font-size: $font-size-medium;
      }
    }
  }
}
</style>