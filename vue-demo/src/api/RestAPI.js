import axios from 'axios'

export const GET = "get";
export const POST = "post";
export const DELETE = "delete";
export const PUT = "put";

// export const zimgUrl = "http://39.108.210.48:4869";
export const baseUrl = "http://39.108.210.48:8090";
export const entitysearchUrl = "http://39.108.210.48:18080";

// export const entitysearchUrl = "http://localhost:18080";
export const imageUploadUrl = entitysearchUrl + "/zuul/images/upload"; // 上传图片
export const imageUrl = entitysearchUrl + "/images";

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
  if (!uuid) uuid = "S000120010005";
  return new axios({
    url: baseUrl + '/v2/entities' + '/' + uuid + '/' + energy_type + '/' + time_type,
    params: {
      'start_time': start_time,
      'end_time': end_time
    }
  })
};

/**
 * [实体图结构]
 * @param  {[string]} uuid
 * @param  {[int]} hop_limit  [限制跳数]
 * @param  {[int]} node_limit [限制节点数量]
 * @return {[object]}            [description]
 */
export const EntityNetwork = (uuid, hop_limit, node_limit) => {
  if (!uuid) uuid = "S000120010005";
  if (!hop_limit) hop_limit = 3;
  if (!node_limit) node_limit = 10;
  return new axios({
    url: entitysearchUrl + "/entities/" + uuid + "/entity-graph",
    params: {
      "hop_limit": hop_limit,
      "node_limit": node_limit
    }
  })
};


export const uploadImage = (image) => {
  var form = new FormData();
  form.append(image);
  return new axios({
    url: imageUploadUrl,
    data: form,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

// 直接利用<img>标签也行呀~
export const fetchImage = (uuid) => {
  return new axios({
    url: zimgUrl + "/" + uuid,
    method: GET
  });
}

// 由于安全原因，zimg只为对后台服务器的ip开放delete操作
// 这里不直接访问zimg，访问的是后端的api
// 后期可以考虑加密
export const deleteImage = (uuid) => {
  return new axios({
    url: entitysearchUrl + "/images/" + uuid,
    method: DELETE
  });
}

