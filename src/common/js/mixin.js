import { mapGetters, mapMutations, mapActions } from "vuex"
import { PlayMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

// 当存在底部播放器时，组件的bottom需要上移
export const playListMixin = {
    computed: {
        ...mapGetters(["playList"])
    },
    mounted() {
        this.handlePlayList(this.playList);
    },
    activated() {
        this.handlePlayList(this.playList);
    },
    watch: {
        playList(newV) {
            this.handlePlayList(newV);
        }
    },
    methods: {
        handlePlayList() {
            throw new Error(':) component must implement handlePlayList method.')
        }
    }
}

// reslove 切换播放模式 stuff
export const playerMixin = {
    computed: {
        iconMode() {
            return this.mode === PlayMode.sequence ?
                "icon-sequence" :
                this.mode === PlayMode.loop ?
                "icon-loop" :
                "icon-random";
        },
        ...mapGetters([
            "playList",
            "sequenceList",
            "currentSong",
            "mode",
            "favoriteList"
        ])
    },
    methods: {
        changeMode() {
            const mode = (this.mode + 1) % 3;
            this.setPlayMode(mode);

            let list = this.sequenceList;
            if (mode === PlayMode.random) {
                list = shuffle(list);
            }
            // 保证当前歌曲没有变(因为歌曲是根据currentIndex来的,但是songlist变了)
            this._resetCurrentIndex(list);
            this.setPlayList(list);
        },
        isFavorite(song) {
            const index = this.favoriteList.findIndex((item) => {
                return item.id === song.id
            })
            return index > -1
        },
        getFavoriteIcon(song) {
            if (this.isFavorite(song)) {
                return 'icon-favorite'
            } else {
                return 'icon-not-favorite'
            }
        },
        toggleFavorite(song) {
            if (this.isFavorite(song)) {
                this.deleteFavoriteList(song)
            } else {
                this.saveFavoriteList(song)
            }
        },
        _resetCurrentIndex(list) {
            let newIndex = list.findIndex(item => {
                return item.id === this.currentSong.id;
            });
            this.setCurrentIndex(newIndex);
        },
        ...mapMutations({
            setPlayingState: "SET_PLAYING",
            setCurrentIndex: "SET_CURRENT_INDEX",
            setPlayMode: "SET_PLAY_MODE",
            setPlayList: "SET_PLAYLIST"
        }),
        ...mapActions([
            'saveFavoriteList',
            'deleteFavoriteList'
        ])
    }
}

// 搜索历史的功能复用
export const searchMixin = {
    data() {
        return {
            query: ""
        }
    },
    computed: {
        ...mapGetters(["searchHistory"])
    },
    methods: {
        onQueryChange(newQuery) {
            this.query = newQuery;
        },
        addQuery(query) {
            this.$refs.searchBox.setQuery(query);
        },
        blurInput() {
            this.$refs.searchBox.blur();
        },
        saveSearch() {
            this.saveSearchHistory(this.query);
        },
        ...mapActions([
            "saveSearchHistory",
            "deleteSearchHistory"
        ])
    }
}