import React from 'react'
import classnames from 'classnames'
import styles from './sku.less'

interface SkuProps {
	data: any;
	selSku: Function;
}
const Sku: React.FC<SkuProps> = (props) => {
	let { productId, productSkus = [], productPic } = props.data;

	if (!productSkus.length) {
		return <div className={styles.nosku}>该商品没有sku</div>
	}

	return (
		<ul className={styles.sku_ul}>
			{
				productSkus.map((v: any, i: number) => {
					return (
						<li key={i} className={classnames({
							[styles.sku_li]: true,
							[styles.cur]: v.sel,
						})}
							onClick={() => props.selSku(productId, v.skuId, !v.sel)}
						>
							<div className={styles.div_img}><img src={v.pic || productPic} /></div>
							<p className={styles.sku_info}>{v.name}</p>
						</li>
					)
				})
			}
		</ul>
	)
}
export default Sku;