<template>
  <transition name="list-fade">
    <div class="playlist" v-show="isShow" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" :data="sequenceList" ref="scroll">
          <transition-group ref="list" name="list" tag="ul">
            <li class="item" v-for="(item) in sequenceList" :key="item.id">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到当前列表</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <add-song ref="addSong"></add-song>
      <confirm ref="confirm" text="是否清空当前播放列表" confirmBtnText="清空" @confirm="confirmClear"></confirm>
    </div>
  </transition>
</template>

<script>
import { mapActions } from "vuex";
import Scroll from "base/scroll/scroll";
import Confirm from "base/confirm/confirm";
import AddSong from "components/add-song/add-song"
import { playerMixin } from "common/js/mixin";
import { PlayMode } from "common/js/config";

export default {
  mixins: [playerMixin],
  data() {
    return {
      isShow: false
    };
  },
  computed: {
    modeText() {
      return this.mode === PlayMode.sequence
        ? "顺序播放"
        : this.mode === PlayMode.loop
        ? "单曲循环"
        : "随机播放";
    }
  },
  watch: {
    currentSong(newS, oldS) {
      if (!this.isShow || newS.id === oldS.id) return;
      setTimeout(() => {
        this.scrollToCurrent(newS);
      }, 20);
    }
  },
  methods: {
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return "icon-play";
      }
    },
    scrollToCurrent(curr) {
      const index = this.sequenceList.findIndex(song => {
        return song.id === curr.id;
      });
      this.$refs.scroll.scrollToElement(
        this.$refs.list.$el.children[index],
        300
      );
    },
    deleteOne(item) {
      this.deleteSong(item);
      if (!this.playList.length) {
        this.hide();
      }
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    confirmClear() {
      this.deleteSongList();
      this.hide();
    },
    add(){
      this.$refs.addSong.show()
    },
    show() {
      this.isShow = true;
      setTimeout(() => {
        this.$refs.scroll.refresh();
        this.scrollToCurrent(this.currentSong);
      }, 20);
    },
    hide() {
      this.isShow = false;
    },
    ...mapActions(["deleteSong", "deleteSongList"])
  },
  components: { Scroll, Confirm, AddSong }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';
@import '~common/styles/mixin';

.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.2);

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;
  }

  &.list-fade-enter, &list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-radius: 8px 8px 0 0;
    background-color: $color-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 20px;
          color: $color-theme;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-theme;
        }

        .clear {
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-theme;
          }
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 30px;
        padding: 0 30px 0 30px;
        overflow: hidden;

        &.list-enter-active, &.list-leave-active {
          transition: all 0.1s;
        }

        &.list-enter, &.list-leave-to {
          height: 0;
        }

        .text {
          flex: 1;
          line-height: 20px;
          no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }

        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-medium;
          color: $color-sub-theme;
        }

        .delete {
          padding-left: 5px;
          font-size: $font-size-small;
          color: $color-text;
        }
      }
    }
    .list-operate{
      width 170px
      margin 20px auto 20px auto
      .add{
        display flex
        align-items center
        padding 5px 12px
        border: 1px solid $color-text
        border-radius 100px
        color $color-theme
        .icon-add{
          flex 1
          font-size $font-size-small
          }
          .text{
            text-align center
            font-size $font-size-medium
            }
        }
      }
    .list-close {
      text-align: center;
      line-height: 30px;
      border-radius: 10px;
      background-color: $color-background-d;
      font-size: $font-size-medium-x;
      color: $color-text;
      
    }
  }
}
</style>