<template>
  <div class="search">
    <div class="search-box-wrapper">
      <keep-alive>
        <search-box ref="searchBox" @query="onQueryChange"></search-box>
      </keep-alive>
    </div>
    <div class="shortcut-wrapper" v-show="!query.length" ref="shortcutWrapper">
      <scroll ref="shortcut" class="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul class="hotKey-wrapper">
              <li
                v-for="(item, index) in hotSearch"
                :key="index"
                class="item"
                @click="addQuery(item.first)"
              >
                <span>{{item.first}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest :query="query" @listScroll="blurInput" @select="saveSearch" ref="suggest"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空所有历史记录" confirmBtnText="清 空" @confirm="clearSearchHistory"></confirm>
  </div>
</template>

<script>
import SearchBox from "base/search-box/search-box";
import Suggest from "components/suggest/suggest";
import SearchList from "base/search-list/search-list";
import Confirm from "base/confirm/confirm";
import Scroll from "base/scroll/scroll";
import { getHotSearch } from "api/search";
import { ERR_OK } from "api/config";
import { mapActions, mapGetters } from "vuex";
import { playListMixin,searchMixin } from "common/js/mixin";

export default {
  mixins: [playListMixin, searchMixin],
  data() {
    return {
      hotSearch: []
    };
  },
  computed: {
    shortcut() {
      return this.hotSearch.concat(this.searchHistory);
    }
  },
  watch: {
    query(newQ) {
      if (!newQ) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    }
  },
  created() {
    this._getHotSearch();
  },
  methods: {
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";

      // console.log(this.$refs.searchResult,this.$refs.suggest)
      this.$refs.searchResult.style.bottom = bottom;
      this.$refs.suggest.refresh();

      this.$refs.shortcutWrapper.style.bottom = bottom;
      this.$refs.shortcut.refresh();
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    _getHotSearch() {
      getHotSearch().then(res => {
        if (res.status === ERR_OK) {
          this.hotSearch = res.data.result.hots;
        }
      });
    },
    ...mapActions([
      "clearSearchHistory"
    ])
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';

.search {
  .search-box-wrapper {
    margin: 5px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 148px;
    bottom: 0;
    width: 100%;

    .shortcut {
      // position: absolute;
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 15px;

        .title {
          margin-bottom: 10px;
          font-size: $font-size-medium;
          color: $color-highlight-background;
        }

        .hotKey-wrapper {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;

          .item {
            display: inline-block;
            padding: 5px;
            margin: 0 5px 5px 0;
            border: 1px solid $color-theme-d;
            border-radius: 6px;
            font-size: $font-size-medium;
            color: $color-text;
          }
        }
      }

      .search-history {
        position: relative;
        margin: 0 15px;

        .title {
          display: flex;
          align-items: center;
          height: 20px;
          font-size: $font-size-medium;
          color: $color-highlight-background;

          .text {
            flex: 1;
          }

          .clear {
            .icon-clear {
              font-size: $font-size-medium;
            }
          }
        }
      }
    }
  }

  .search-result {
    // position: fixed
    width: 100%;
    top: 148px;
    bottom: 0;
  }
}
</style>