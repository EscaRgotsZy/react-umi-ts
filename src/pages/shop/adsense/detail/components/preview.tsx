
import React from 'react';
import { Carousel } from 'antd'
import TellPhone from '@/components/TellPhone'
import QueueAnim from 'rc-queue-anim';
import styles from '../index.less'

export default ({ data, visible }) => {
  let banner = data[1];
  let special = data[2] || [];
  let activity = data[3] || [];
  if(!visible)return null

  return (
      <TellPhone style={{position: 'absolute', top: 37, right: 0, zIndex: 100, width: 320}}>
        <QueueAnim className="demo-content">
          {visible ? [
               <div className={styles.carouselWraper} key="1">
               <Carousel autoplay>
                 {
                   banner && banner.length > 0 && banner.map((item, index) => {
                     return (
                       <img src={item.pics} width='349px' height='154px' key={index} />
                     )
                   })
                 }
               </Carousel>
             </div>,
             <div className={styles.wraper} key="2">
               {
                 special.map((item, index) => {
                   return (
                     <img src={item.pics} width='158px' height='90px' key={index} />
                   )
                 })
               }
             </div>,
             <div className={styles.zoneWraper} key="3">
               {
                 activity.map((item, index) => {
                   return (
                     <img src={item.pics} width='375px' height='114px' key={index} />
                   )
                 })
               }
             </div>
          ] : null}
        </QueueAnim>
    </TellPhone>
  )
}