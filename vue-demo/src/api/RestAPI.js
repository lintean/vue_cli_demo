import axios from 'axios'

export const GET = "get";
export const POST = "post";
export const DELETE = "delete";
export const PUT = "put";

export const baseUrl = "http://39.108.210.48"

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

// 以下全部API都挂掉，用上面那个就好

/*
// export const baseUrl = "http://localhost:8080"; // localhost
// export const baseUrl = "http://120.79.178.50:18080"; // 阿里云服务器
// export const elasticsearchUrl = "http://localhost:9200"; // Elasticsearch url
export const elasticsearchUrl = ""; // Elasticsearch url
export const elasticsearchIndex = "entities";


export const debugSearchEntity = (keyword, size) => {
  console.log("size: ", size);
  if(!keyword || keyword === '')
  {
    console.log("keyword is null: ", keyword);
    return new axios({
      url: elasticsearchUrl + "/" + elasticsearchIndex + "/_search",
      method: GET,
      data: {
        "query": {
          "match_all": { }
        },
        "size": size
      }
    });
  }else{
    console.log("keyword: ", keyword);
    return new axios({
      url: elasticsearchUrl + "/" + elasticsearchIndex + "/_search",
      method: POST,
      data: {
        "query": {
          "bool": {
            "should": [
              {
                "match": {
                  "FQDN_alias": {
                    "query": keyword,
                    "boost": 1.0
                  }
                }
              },
              {
                "match": {
                  "FQDN_alias.cn": {
                    "query": keyword,
                    "boost": 3.0
                  }
                }
              }
              // ,
              // {
              //   "fuzzy": {
              //     "FQDN_alias.raw": {
              //       "value": keyword,
              //       "boost": 3.0
              //     }
              //   }
              // }
            ]
          }
        },
        "size": size
      }
    });
  }
};

export const searchEntity = (type, keyword, master_FQDN, size, cn) => {
  master_FQDN = master_FQDN ? master_FQDN : '';
  size = size ? size : 10;
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

export const getEntityByFQDN = (FQDN) => {
  return new axios({
    url: baseUrl + '/entities/_search',
    params: {
      'FQDN': FQDN
    }
  });
};
*/


