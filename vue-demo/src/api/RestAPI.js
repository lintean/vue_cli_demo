import axios from 'axios'

export const GET = "get";
export const POST = "post";
export const DELETE = "delete";
export const PUT = "put";

export const baseUrl = "http://39.108.210.48:8090"

export const searchEntity = (keyword, size) => {
  size = size ? size : 10;
  return new axios({
    url: baseUrl + '/v2/entities/search',
    params: {
      'keyword': keyword,
      'size': size
    }
  })
};

export const EntityDetail = (uuid, energy_type, time_type, start_time, end_time) => {
  return new axios({
    url: baseUrl +'/v2/entities' + '/' + uuid + '/' + energy_type + '/' + time_type,
    params: {
      'start_time': start_time,
      'end_time': end_time
    }
  })
};