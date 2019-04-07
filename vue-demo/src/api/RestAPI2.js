import axios from 'axios'

export const GET = "get";
export const POST = "post";
export const DELETE = "delete";
export const PUT = "put";

export const baseUrl = "http://39.108.210.48:18080";

export const imageUploadUrl = baseUrl + "/zuul/images/upload"; // 上传图片
export const imageUrl = baseUrl + "/images";

// 这里调用了SmartGreen智慧建筑的后端API
// 由于实体电量数据过多，就不导出测试数据了
export const entityEnergyUrl = "http://39.108.210.48:8090";

/**
 * 统一接口处理4种类型的检索，其实代码这样处理不是很规范
 * 因为[全文检索]的API，没有master_FQDN的参数
 * @param type 检索的类型：full-text, full-text-opt, filter, prefix, desc
 *             full-text     全文检索
 *             full-text-opt 全文优化
 *             filter        层次检索
 *             prefix        前缀检索
 *             desc 详情检索
 * @param keyword 检索关键字
 * @param master_FQDN 父实体的全称限定名，[层次检索]和[前缀检索]需要提供该参数
 * @param size 检索建议 / 检索结果 的条数
 * @return 检索建议的实体信息
 * @param cn 是否开启中文分词
 * @returns {AxiosStatic}
 */
export const searchEntity = (type, keyword, master_FQDN, size, cn) => {
  master_FQDN = master_FQDN ? master_FQDN : '';
  size = size ? size : 10;
  cn = cn ? cn : false;
  return new axios({
    url: baseUrl + '/entities/_search/' + type,
    params: {
      'keyword': keyword,
      'master_FQDN': master_FQDN,
      'size': size,
      'cn': cn
    }
  })
};

/**
 * 用于全文检索，即EntityDetail和EntityNetwork的搜索框
 */
export const searchEntityFullText = (keyword, size) => {
  return searchEntity("full-text-opt", keyword, '', size)
};

export const getEntityByFQDN = (FQDN) => {
  return new axios({
    url: baseUrl + '/entities/_search',
    params: {
      'FQDN': FQDN
    }
  });
};

// 这里调用了SmartGreen智慧建筑的后端API
export const EntityDetail = (uuid, energy_type, time_type, start_time, end_time) => {
  if (!uuid) uuid = "S000120010005";
  return new axios({
    url: entityEnergyUrl + '/v2/entities' + '/' + uuid + '/' + energy_type + '/' + time_type,
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
    url: baseUrl + "/entities/" + uuid + "/entity-graph",
    params: {
      "hop_limit": hop_limit,
      "node_limit": node_limit
    }
  })
};

// --------------------------- zimg api ------------------------

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
// 这里不直接访问zimg，访问的是后端的API，由后端zuul路由到zimg
// 后期可以考虑加密
export const deleteImage = (uuid) => {
  return new axios({
    url: baseUrl + "/images/" + uuid,
    method: DELETE
  });
}

