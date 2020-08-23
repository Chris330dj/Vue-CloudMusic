import axios from 'axios'
import { HOST } from 'api/config'

export function getSongUrl(id) {
    let str = id
    if (id instanceof Array) {
        str = id.join(',')
    }
    const url = HOST + `/song/url/?id=${str}`;
    return axios.get(url);
}

export function getSongDetail(id) {
    let str = id;
    if (id instanceof Array) {
        let str = id.join(',')
    }
    const url = HOST + `/song/detail?ids=${str}`;
    return axios.get(url);
}

export function getLyric(songId) {
    const url = HOST + `/lyric?id=${songId}`;
    return axios.get(url)
}