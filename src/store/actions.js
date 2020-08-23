import * as types from './mutation-types'
import { PlayMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from 'common/js/cache'
import { cp } from 'shelljs'

function findIndex(list, currSong) {
    return list.findIndex(item => {
        return item.id === currSong.id;
    })
}

// ？
export const selectPlay = function({ commit, state }, { list, index }) {
    commit(types.SET_SEQUENCE_LIST, list)
        // 如果是随机播放,这个list(顺序)和index就不是匹配的
        // 要重新注入list以及修改index
    if (state.mode === PlayMode.random) {
        let randomList = shuffle(list);
        commit(types.SET_PLAYLIST, randomList);
        let newIndex = findIndex(randomList, list[index])
        commit(types.SET_CURRENT_INDEX, newIndex)
    } else {
        commit(types.SET_PLAYLIST, list)
        commit(types.SET_CURRENT_INDEX, index)
    }
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

// 列表循环播放
export const sequencePlay = function({ commit }, { list }) {
    commit(types.SET_PLAY_MODE, PlayMode.sequence)
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAYLIST, list)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

// 随机播放
export const randomPlay = function({ commit }, { list }) {
    commit(types.SET_PLAY_MODE, PlayMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

// 插入单曲
export const insertSong = function({ commit, state }, song) {
    // 浅拷贝导致会在mutation外(action中)修改对应的state 
    let playList = state.playList.slice();
    let sequenceList = state.sequenceList.slice();
    let currentIndex = state.currentIndex;

    // 请开始你的表演
    // 记录当前在播歌曲
    let currentSong = playList[currentIndex];
    // 查找原始歌单中是否存在当前待插歌曲
    let fpIndex = findIndex(playList, song);
    // 插入歌曲(放在当前播放歌曲的后面,播放选中歌曲)
    currentIndex++

    // 处理playlist中的情况
    playList.splice(currentIndex, 0, song)
        // 如果包含插入的单曲
    if (fpIndex > -1) {
        // (已存在)单曲在当前单曲前
        if (fpIndex < currentIndex) {
            playList.splice(fpIndex, 1)
            currentIndex--
        } else {
            // (已存在)单曲在当前单曲后
            playList.splice(fpIndex + 1, 1)
        }
    }
    // 处理sequencelist中的情况
    let currentSIndex = findIndex(sequenceList, currentSong) + 1; // 待插位置
    let fsIndex = findIndex(sequenceList, song);
    sequenceList.splice(currentSIndex, 0, song)

    // 存在
    if (fsIndex > -1) {
        if (fsIndex < currentSIndex) {
            sequenceList.splice(fsIndex, 1)
        } else {
            sequenceList.splice(fpIndex + 1, 1)
        }
    }
    commit(types.SET_PLAYLIST, playList)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

// 保存/更改searchHistory状态
export const saveSearchHistory = function({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function({ commit }) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 删除sequencelist中的歌曲
export const deleteSong = function({ commit, state }, song) {
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    let pIndex = findIndex(playList, song)
    let sIndex = findIndex(sequenceList, song)
    playList.splice(pIndex, 1)
    sequenceList.splice(sIndex, 1)
    if (currentIndex > pIndex || currentIndex === playList.length) {
        currentIndex--
    }
    commit(types.SET_PLAYLIST, playList)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)

    if (!playList.length) {
        commit(types.SET_PLAYING_STATE, false)
    } else {
        commit(types.SET_PLAYING_STATE, true)
    }
}

// 删除播放列表全部歌曲
export const deleteSongList = function({ commit }) {
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
}

// 保存播放历史
export const savePlayHistory = function({ commit, state }, song) {
    commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 保存心标歌曲
export const saveFavoriteList = function({ commit }, song) {
    commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function({ commit }, song) {
    commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}