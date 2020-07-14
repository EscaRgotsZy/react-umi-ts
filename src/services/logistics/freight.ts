import { get, post, put, del } from '@/common/request';
import formatSrc from '@/common/formatSrc'

/**  列表页  **/
export interface GetFreightParams {
	page: number;
	size: number;
	status?: number | string;
	sortBy: string;
}
// 获取运费模板列表
export async function getFreightTemplates(params: GetFreightParams) {
	let [err, data] = await get({ url: `/freightTemplates`, params });
	if (err || !data) return { total: 0, records: [] };
	let { total, records } = data;
	records = Array.isArray(records) ? records : [];
	return {
		total,
		records
	}
}
// 删除运费模板( _Del )
export async function delFreightTemplate({ id }: any) {
	let [err, data] = await del({
		url: `/freightTemplates/${id}`,
		showToast: true,
		successToast: true,
	});
	if (err || !data) return false;
	return true;
}


/**  使用详情列表页  **/
export interface GetUseConditionParams {
	page: number;
	size: number;
	status?: number | string;
	id: number | string;
}
// 获取运费模板列表
export async function getUseCondition(params: GetUseConditionParams) {
	let newParams = {
		page: params.page,
		size: params.size,
	}
	let [err, data] = await get({ url: `/freightTemplates/useCondition/${params.id}/${params.status}`, params: newParams });
	if (err || !data) return { total: 0, records: [] };
	let { total, records } = data;
	records = Array.isArray(records) ? records : [];
	return {
		total,
		records
	}
}


/**  详情页  **/
// 获取运费模板详情
export async function getFreTemInfo({ id }: any) {
	let [err, data] = await get({ url: `/freightTemplates/templateInfo/${id}`, });
	if (err || !data) return false;
	return data
}

// 查询地区
export async function getOptionDistrict() {
	let [err, data] = await get({ url: `/freightTemplates/optionDistrict`, });
	if (err || !data) return [];
	return data.map((v:any, i:number)=>{
		let districts = v.districts || [];
		return {
			title: v.name || '',
			key: i,
			level: 1,
			disabled: false,
			selectable: false,
			children: districts.map((x:any)=>{
				let cityList = x.cityList || [];
				return {
					title: x.provinceName || '',
					key: Number(x.code),
					level: 2,
					topId: i,
					disabled: false,
					selectable: false,
					children: cityList.map((n:any)=>({
						title: n.value || '',
						key: Number(n.key),
						level: 3,
						topId: i,// 一级id
						prevId: Number(x.code),// 二级id
						disabled: false,
						selectable: false,
					}))
				}
			})
		}
	})
}


// 查询物流公司
export async function getCompanies() {
	let [err, data] = await get({ url: `/freightTemplates/companies` });
	if (err || !data) return [];
	return data.map((v:any)=>{
		return {
			icon: v.icon? formatSrc(v.icon):'',
			id: v.id,
			name: v.name || '',
		}
	})
}

// 新增运费模板
export function addFreightTemplates(params:any) {
	return post({ url: `/freightTemplates`, params, successToast: true, });
}

// 编辑运费模板
export function putFreightTemplates(params:any) {
	return put({ url: `/freightTemplates`, params, successToast: true, });
}
