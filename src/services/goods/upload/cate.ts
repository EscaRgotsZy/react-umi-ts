import { get, put } from '@/common/request';
// 获取一级分分类列表
export async function getFirstLevelCa() {
    let [err, data] = await get({ url: `/productManagement/findFirstLevelCa`, });
    if (err || !data) return {};
    let { categoryList=[]} = data;
    return {
        categoryList: categoryList ? categoryList.data :[],
    }
}
export async function getNextCategory(categoryId: number | string) {
    let [err, data] = await get({ url: `/productManagement/findNextCategory/${categoryId}` });
    if (err || !data) return {};
    return {
        categoryList: data ? data :[],
    }
}



