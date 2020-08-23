<template>
  <div class="song-list">
    <ul>
      <li
        @click="selectItem(song, index)"
        v-for="(song, index) in songs"
        :key="song.id"
        class="item"
      >
        <span class="count" :class="getRankCLs(index)">{{index + 1}}</span>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: ()=>{}
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer} - ${song.album}`;
    },
    selectItem(song, index) {
      return this.$emit("select", song, index);
    },
    getRankCLs(index) {
      if (index <= 2 && this.rank) {
        return `rank`;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/styles/variable';
@import '~common/styles/mixin';

.song-list {
  .item {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 60px;
    border-bottom: 1px solid rgb(228, 228, 228);

    .count {
      flex: 0 0 50px;
      width: 50px;
      text-align: center;
      color: $color-theme-d;

      &.rank {
        color: $color-sub-theme;
      }
    }

    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        no-wrap();
        color: $color-text;
      }

      .desc {
        no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>