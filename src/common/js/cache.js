// 和 storage 相关的代码
import storage from 'common/js/storage'
import { strategy } from 'webpack-merge'


// 存储搜索历史记录
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

// 存储播放历史
const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 100

// 存储心标歌曲
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 100

// 维护一个搜索历史数组,最新数据在最前，最多HISTORY_LEN个数据
function insertArray(arr, val, compare, maxlen) {
    let index = arr.findIndex(compare);
    if (index === 0) return //当前搜索就在第一个,不需要再处理
    if (index > 0) {
        // 搜索历史中有该数据
        arr.splice(index, 1)
    }
    arr.unshift(val)
        // 是否超出数组最大长度
    if (maxlen && arr.length > maxlen) {
        arr.pop()
    }
}
// 存储搜索历史数组
export const saveSearch = function(query) {
        let searches = storage.get(SEARCH_KEY, [])
        insertArray(searches, query, (item) => {
            return item === query
        }, SEARCH_MAX_LEN)
        storage.set(SEARCH_KEY, searches)
        return searches
    }
    // 读取搜索历史数组
export const loadSearch = function() {
    return storage.get(SEARCH_KEY, [])
}

function deleteFromArray(arr, compare) {
    let index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}
// 删除数组中的一个元素
export const deleteSearch = function(query) {
        let searches = storage.get(SEARCH_KEY, [])
        deleteFromArray(searches, (item) => {
            return item === query
        })
        storage.set(SEARCH_KEY, searches)
        return searches
    }
    // 删除整个数组
export function clearSearch() {
    storage.remove(SEARCH_KEY)
    return []
}

// 存储播放历史
export function savePlay(song) {
    let playHistory = storage.get(PLAY_KEY, [])
    insertArray(playHistory, song, (item) => {
        return item.id === song.id
    }, PLAY_MAX_LEN)
    storage.set(PLAY_KEY, playHistory)
    return playHistory
}

export function loadPlay() {
    return storage.get(PLAY_KEY, [])
}


// 存储心标歌曲
export function saveFavorite(song) {
    let songs = storage.get(FAVORITE_KEY, [])
    insertArray(songs, song, (item) => {
        return song.id === item.id
    }, FAVORITE_MAX_LEN)
    storage.set(FAVORITE_KEY, songs)
    return songs
}

export function deleteFavorite(song) {
    let songs = storage.get(FAVORITE_KEY, [])
    deleteFromArray(songs, (item) => {
        return song.id === item.id
    })
    storage.set(FAVORITE_KEY, songs)
    return songs
}

export function loadFavorite() {
    return storage.get(FAVORITE_KEY, [])
}