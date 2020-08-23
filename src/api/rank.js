import axios from 'axios'
import {HOST} from 'api/config'

export function getTop(idx){
  const url = HOST + `/top/list?idx=${idx}`
  return axios.get(url)
}