import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Popconfirm, } from 'antd';
import moment from 'moment';
import { Link } from 'umi'
import { GetFreightParams, getFreightTemplates, delFreightTemplate } from '@/services/logistics/freight';
import { saveUrlParams } from '@/utils/utils';
interface UserProp {
	history: any;
	location: any;
}
const FreightList: React.FC<UserProp> = (props) => {
	let { page = 1, size = 10 } = props.location.query;
	let [tableList, setTableList] = useState<Array<any>>([])
	let [pageInfo, setPageInfo] = useState<any>({ page: +page, size: +size, });
	let [total, setTotal] = useState<any>(0);
	let [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		getDataList()
	}, [pageInfo])
	const columns = [
		{ title: '模版名称', dataIndex: 'name', },
		{ title: '计费方式', dataIndex: 'chargeMode', render: (text: string) => text && text == '1' ? '按重量' : '按件数' },
		{ title: '最后编辑时间', dataIndex: 'modifyTime', render: (text: string) => moment(text).format('YYYY-MM-DD') },
		{
			title: '操作', width: '20%', render: (text: string, record: any, index: number) => <> <div style={{ display: 'flex' }}>
				<Button type='primary' style={{ marginLeft: '5px' }}>
					<Link to={`/logistics/freight/add?copy=${record.id}`}>复制</Link>
				</Button>
				<Button type='primary' style={{ marginLeft: '5px' }}>
					<Link to={`/logistics/freight/${record.id}/edit`}>编辑</Link>
				</Button>
				<Popconfirm
					title="是否删除运费模板?"
					onConfirm={() => del(record)}
					okText="确定"
					cancelText="取消"
				>
					<Button type='danger' style={{ marginLeft: '5px' }}>删除</Button>
				</Popconfirm>
				<Button type='primary' style={{ marginLeft: '5px' }}>
					<Link to={`/logistics/freight/${record.id}/usage`}>使用情况</Link>
				</Button>
			</div>
			</>
		},
	]
	async function getDataList() {
		let params: GetFreightParams = { page: pageInfo.page, size: pageInfo.size, sortBy: '-modifyTime' }
		
		setLoading(true)
		let { total, records } = await getFreightTemplates(params)
		setLoading(false);
		setTotal(total);
		setTableList(records);
		saveUrlParams({
			page: pageInfo.page,
			size: pageInfo.size,
		})
	}
	// 删除模板
	async function del(record: any) {
		let { id } = record;
		await delFreightTemplate({ id });
		getDataList()
	}
	return (
		<PageHeaderWrapper>
			<Card bordered={false}>
				<div style={{ marginBottom: 20 }}><Button type='primary' onClick={()=>{
					props.history.push('/logistics/freight/add')
				}} >新建运费模版</Button></div>
				<Table
					rowKey={record => record.id}
					loading={loading}
					columns={columns}
					dataSource={tableList}
					onChange={({ current: page, pageSize }) => {
						setPageInfo({ page, size: pageSize });
					}}
					pagination={{
						showQuickJumper: pageInfo.total > 10,
						showSizeChanger: pageInfo.total > 10,
						current: pageInfo.page,
						pageSize: pageInfo.size,
						total: total,
						showTotal: t => <div>共{t}条</div>
					}} />
			</Card>
		</PageHeaderWrapper>
	)
}

export default FreightList;