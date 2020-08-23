<template>
  <transition>
    <div class="confirm" @click.stop="hide" v-show="isShow">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div @click="confirm" class="operate-btn">{{confirmBtnText}}</div>
            <div @click="cancel" class="operate-btn">{{cancelBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "Hi"
    },
    confirmBtnText: {
      type: String,
      default: "确 定"
    },
    cancelBtnText: {
      type: String,
      default: "取 消"
    }
  },
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    cancel() {
      this.hide();
      this.$emit("cancel");
    },
    confirm() {
      this.hide();
      this.$emit("confirm");
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';

.confirm {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 998;
  background-color: rgba(0, 0, 0, 0.2);

  &.confirm-enter-active {
    animation: confirm-fadein 0.3s;

    .confirm-content {
      animation: confirm-zoom 0.3s;
    }
  }

  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;

    .confirm-content {
      width: 270px;
      border-radius: 5px;
      background: $color-theme-l;

      .text {
        padding: 12px 15px;
        line-height: 22px;
        text-align: center;
        font-size: $font-size-medium-x;
        color: $color-text;
      }

      .operate {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: $font-size-medium-x;

        .operate-btn {
          flex: 1;
          line-height: 22px;
          padding: 12px 0;
          border-top: 1px solid $color-background-d;
          color: $color-text-d;

          &:first-child {
            border-right: 1px solid $color-background-d;
            color: #c61951;
          }
        }
      }
    }
  }
}
</style>