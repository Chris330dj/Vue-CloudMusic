import { HOST } from 'api/config'
import axios from 'axios';
import { off } from 'node-notifier';

// 获取热搜列表
export function getHotSearch() {
    const url = HOST + '/search/hot';
    return axios.get(url)
}

// 获取搜索返回
export function searchSongs(query, offset, limit = 15) {
    const url = HOST + `/search?keywords=${query}&offset=${offset}&limit=${limit}`
    return axios.get(url)
}

// 返回album, artists, songs, mvs
export function searchSuggest(query) {
    const url = HOST + `/search/suggest?keywords=${query}`
    return axios.get(url)
}