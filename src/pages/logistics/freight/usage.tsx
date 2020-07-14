import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Table, Tabs } from 'antd';
import { handlePicUrl, } from '@/utils/utils';
import { getUseCondition, GetUseConditionParams } from '@/services/logistics/freight';
const { TabPane } = Tabs;
interface UserProp {
	history: any;
	location: any;
	match: any;
}
const Usage: React.FC<UserProp> = (props) => {
	let { id } = props.match.params;
	let [loading_1, setLoading_1] = useState<boolean>(false)
	let [loading_2, setLoading_2] = useState<boolean>(false)
	let [list_1, setList_1] = useState<Array<any>>([])
	let [list_2, setList_2] = useState<Array<any>>([])
	let [pageInfo_1, setPageInfo_1] = useState<any>({ page: 1, size: 10 });
	let [pageInfo_2, setPageInfo_2] = useState<any>({ page: 1, size: 10 });
	let [total_1, setTotal_1] = useState<number>(0);
	let [total_2, setTotal_2] = useState<number>(0);

	useEffect(() => {
		getList_2()
	}, [pageInfo_2])
	useEffect(() => {
		getList_1()
	}, [pageInfo_1])



	async function getList_1() {
		let params_1: GetUseConditionParams = { page: pageInfo_1.page, size: pageInfo_1.size, id, status: 1 };
		setLoading_1(true);
		let res = await getUseCondition(params_1);
		let { records, total } = res;
		setLoading_1(false);
		setTotal_1(total);
		setList_1(records);
	}
	async function getList_2() {
		let params_2: GetUseConditionParams = { page: pageInfo_2.page, size: pageInfo_2.size, id, status: 0 };
		setLoading_2(true);
		let res = await getUseCondition(params_2);
		setLoading_2(false);
		let { total, records } = res;
		setTotal_2(total);
		setList_2(records);
	}

	function changeTab(key?: number | string) {

	}

	const columns = [
		{ title: '商品图片', dataIndex: 'productPic', render: (text: string) => <img src={text && handlePicUrl(text)} width='50' height='60' /> },
		{ title: '商品名称', dataIndex: 'productName', },
		{ title: '商品Id', dataIndex: 'productId', },
		{ title: '产品原价', dataIndex: 'originalPrice', },
		{ title: '产品现价', dataIndex: 'presentPrice', },
	]

	return (
		<PageHeaderWrapper>
			<Card bordered={false}>

				<Tabs defaultActiveKey="1" onChange={changeTab}>
					<TabPane tab={`线上商品（${total_1}）`} key="1">
						<Table
							rowKey={record => record.productId}
							loading={loading_1}
							columns={columns}
							dataSource={list_1}
							onChange={({ current: page, pageSize: size }) => {
								setPageInfo_1({ page, size });
							}}
							pagination={{
								showQuickJumper: total_1 > 10,
								showSizeChanger: total_1 > 10,
								current: pageInfo_1.page,
								pageSize: pageInfo_1.size,
								total: total_1,
								showTotal: t => <div>共{t}条</div>
							}} />
					</TabPane>
					<TabPane tab={`仓库中的商品（${total_2}）`} key="2">
						<Table
							rowKey={record => record.productId}
							loading={loading_2}
							columns={columns}
							dataSource={list_2}
							onChange={({ current: page, pageSize: size }) => {
								setPageInfo_2({ page, size });
							}}
							pagination={{
								showQuickJumper: total_2 > 10,
								showSizeChanger: total_2 > 10,
								current: pageInfo_2.page,
								pageSize: pageInfo_2.size,
								total: total_2,
								showTotal: t => <div>共{t}条</div>
							}} />
					</TabPane>
				</Tabs>
			</Card>
		</PageHeaderWrapper>
	)
}
export default Usage;