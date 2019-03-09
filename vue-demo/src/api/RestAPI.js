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
		url: "http://39.108.210.48:18080" + "/entities/" + uuid + "/entity-graph",
		params: {
			"hop_limit": hop_limit,
			"node_limit": node_limit
		}
	})
};
