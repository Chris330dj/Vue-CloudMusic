import axios from 'axios'
import {HOST} from 'api/config'

export function getBanner(){
    const url = HOST + '/banner'
    return axios.get(url)
}

export function getRecommendList(){
    const url = HOST + '/personalized'
    return axios.get(url)
}

export function getSongList(id){
    const url = HOST + `/playlist/detail?id=${id}`
    return axios.get(url)
}