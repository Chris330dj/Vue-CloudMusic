import { getLyric } from "api/song"
import { ERR_OK } from "api/config"

export default class Song {
    constructor({ id, singer, name, album, image, url }) {
        this.id = id;
        this.singer = singer;
        this.name = name;
        this.album = album;
        this.image = image;
        this.url = url;
    }
    getLyric() {
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve, reject) => {
            getLyric(this.id).then(res => {
                if (res.status === ERR_OK) {
                    res.data.lrc ? this.lyric = res.data.lrc.lyric : this.lyric = ''
                    resolve(this.lyric)
                } else {
                    reject('获取歌词失败')
                }
            })
        })
    }
}

export function createSong(songData) {
    return new Song({
        id: songData.id,
        singer: playerName(songData.ar),
        name: songData.name,
        album: songData.al.name,
        image: songData.al.picUrl,
        url: songData.url
    })
}

// 多名艺术家的拼接
export function playerName(arr) {
    let playername = [];
    playername = arr.map(item => {
        return item.name
    })
    return playername.join('/')
}