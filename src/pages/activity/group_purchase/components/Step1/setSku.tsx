


import React, { useState } from 'react'
import { Input, Card, Table, Button, Form, message } from 'antd'


function processNumbers(num:string | number){
	if(typeof num === 'number')return num;
	if(num === '')return '';
	return Number(num)
}
interface SkuProps {
	data: any;
	setSkuMergePrice: Function;
	batchSetSku: Function;
	disabled: boolean;
}
const SetSku: React.FC<SkuProps> = (props) => {
	let { productSkus, productId } = props.data;
	let [form] = Form.useForm()
	let [rowKeys, setRowKeys] = useState<any[]>(productSkus.map((v: any) => v.skuId))

	const Columns = [
		{
			title: '单品图片',
			dataIndex: 'pic',
			width: '12%',
			render: (text: any) => (
				text ? <img src={text} width='40' height='40' /> : '暂无图片'
			)
		},
		{
			title: '单品ID',
			width: '10%',
			dataIndex: 'skuId',
		},
		{
			title: '单品名称',
			dataIndex: 'name',
			width: '20%',
		},
		{
			title: '销售价',
			width: '15%',
			dataIndex: 'price',
		},
		{
			title: '库存',
			width: '10%',
			dataIndex: 'actualStocks',
		},
		{
			title: '团购价',
			dataIndex: 'mergePrice',
			width: '15%',
			render: (text: any, record: any) => (
				<Form layout="inline" >
					<Form.Item rules={[{ required: true, message: '请输入团购价!' }]}>
						<Input value={text} type='number' min={0}
							onChange={(e) => {
								props.setSkuMergePrice(record, e.target.value, 'mergePrice')
							}}
							disabled={props.disabled} style={{ width: 120 }} />
					</Form.Item>
				</Form >
			)
		},
		{
			title: '返积分',
			dataIndex: 'mergeLevelRate',
			width: '15%',
			render: (text: any, record: any) => (
				<Form layout="inline">
					<Form.Item rules={[{ required: true, message: '请输入返积分!' }]}>
						<Input type='number' value={text} min={0}
							onChange={(e) => {
								props.setSkuMergePrice(record, e.target.value, 'mergeLevelRate')
							}}
							disabled={props.disabled} style={{ width: 120 }} />
					</Form.Item>
				</Form >
			)
		}
	]

	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
				<Form layout="inline" form={form}>
					<Form.Item label="团购价" name="mergePrice">
						<Input style={{ width: '150px' }} type='number' min={0} addonAfter="￥" disabled={props.disabled} />
					</Form.Item>
					<Form.Item label="返积分" name="mergeLevelRate">
						<Input style={{ width: '150px' }} max={20} type='number' min={0} addonAfter="%" disabled={props.disabled} />
					</Form.Item>
				</Form>
				<Button
					disabled={props.disabled}
					onClick={() => {
						let { mergePrice, mergeLevelRate } = form.getFieldsValue(['mergePrice', 'mergeLevelRate'])
						mergePrice = processNumbers(mergePrice)
						mergeLevelRate = processNumbers(mergeLevelRate)
						if (!rowKeys.length) return message.warn('请至少勾选一个sku进行设置')
						props.batchSetSku(productId, rowKeys, mergePrice, mergeLevelRate)
					}}>批量设置</Button>
			</div>
			<Card>
				<Table
					size='small'
					rowKey={record => record.skuId}
					bordered={true}
					columns={Columns}
					dataSource={productSkus}
					pagination={false}
					rowSelection={{
						selectedRowKeys: rowKeys,
						onChange(selectedRowKeys) {// 单选和全选都会触发
							setRowKeys(selectedRowKeys)
						}
					}}
				/>
			</Card>
		</>
	)
}


export default SetSku;
