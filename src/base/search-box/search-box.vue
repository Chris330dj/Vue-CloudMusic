<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="input" type="text" :placeholder="placeholder" v-model="query" ref="query" />
    <i class="icon-dismiss" @click="clear" v-show="query"></i>
  </div>
</template>

<script>
import { debounce } from "common/js/util";

export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  data() {
    return {
      query: ""
    };
  },
  methods: {
    clear() {
      this.query = "";
    },
    setQuery(newQuery) {
      this.query = newQuery;
    },
    blur() {
      this.$refs.query.blur();
    }
  },
  created() {
    this.$watch(
      "query",
      debounce(newQuery => {
        this.$emit("query", newQuery);
      }, 200)
    );
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';

.search-box {
  position: relative;
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0 6px;
  border-radius: 20px;
  background-color: $color-dialog-background;

  .icon-search {
    font-size: 24px;
    color: $color-sub-background;
  }

  .input {
    flex: 1;
    margin: 0 5px;
    line-height: 30px;
    background-color: transparent;
    font-size: $font-size-medium;
    color: $color-text;

    &::placeholder {
      color: $color-text-d;
    }
  }

  .icon-dismiss {
    font-size: 18px;
    color: $color-sub-background;
  }
}
</style>