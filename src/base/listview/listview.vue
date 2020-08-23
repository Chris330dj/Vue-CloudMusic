<template>
  <scroll
    class="listview"
    ref="listview"
    @scroll="scroll"
    :listen-scroll="listenScroll"
    :probe-type="probeType"
  >
    <ul>
      <li v-for="group in data" class="list-group" :key="group.id" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li
            v-for="item in group.items"
            class="list-group-item"
            :key="item.id"
            @click="selectItem(item)"
          >
            <img v-lazy="item.avatar" class="avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop
    >
      <ul class="shortCutListWrapper">
        <li
          v-for="(item, index) in shortCutList"
          :key="item.id"
          class="item"
          :data-index="index"
          :class="{'current': currentIndex === index}"
        >{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { getData } from "common/js/dom";

const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 20;

export default {
  props: {
    data: {
      type: Array
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    };
  },
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calcGroupHeight();
      }, 20);
    },
    scrollY(newY) {
      // 这里的newY是负数
      const listHeight = this.listHeight;
      // console.log(listHeight);
      // 滚动到顶部时，newY>0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间滚动,判断当前newY属于哪个group区间
      for (let i = 0; i < listHeight.length - 1; i++) {
        let h1 = listHeight[i];
        let h2 = listHeight[i + 1];
        // listHeight里是正数
        if (-newY >= h1 && -newY < h2) {
          this.currentIndex = i;
          // 当前Y值和下一个title之间的距离
          this.diff = h2 + newY;
          return;
        }
      }
      // 滚动到最底部
      this.currentIndex = listHeight.length - 2;
    },
    diff(newV) {
      let fixedTop = newV > 0 && newV < TITLE_HEIGHT ? newV - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
    }
  },
  computed: {
    shortCutList() {
      return this.data.map(group => {
        return group.title;
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) return "";
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  methods: {
    refresh() {
      this.$refs.listview.refresh();
    },
    selectItem(item) {
      this.$emit("select", item);
    },
    onShortcutTouchStart(e) {
      // 实现当手指触摸手机时触发该方法
      let anchorIndex = getData(e.target, "index");
      let firstTouch = e.touches[0];
      this.touch.y0 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;

      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      let delta = ((this.touch.y1 - this.touch.y0) / ANCHOR_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
    scroll(pos) {
      // 在scroll组件中，会用emit传出pos，这里接收
      // 这里的y全是负值
      this.scrollY = pos.y;
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return;
      }
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calcGroupHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: $color-background;

  .list-group {
    .list-group-title {
      height: 20px;
      line-height: 20px;
      padding-left: 12px;
      // margin-bottom: 10px;
      font-size: $font-size-small;
      color: $color-text-d;
      background-color: $color-background-d;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 5px 0;
      margin: 0 5px;
      border-bottom: 1px solid rgb(228, 228, 228);

      &:last-child {
        border: none;
        // margin-bottom: 10px;
      }
    }

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 5px;
    }

    .name {
      margin-left: 20px;
      color: $color-text;
      font-size: $font-size-medium;
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 3px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 95%;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    font-family: Helvetica;

    .shortCutListWrapper {
      width 100%
      height 100%
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .item {
        flex: 1;
        // padding: 2px;
        line-height: 1;
        color: $color-text-d;
        font-size: $font-size-small;
        font-weight: bold;

        &.current {
          color: $color-theme;
        }
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 20px;
      line-height: 20px;
      padding-left: 12px;
      font-size: $font-size-small;
      color: $color-text-d;
      background-color: $color-background-d;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    height: 50%;
    transform: translateY(-50%);
  }
}
</style>