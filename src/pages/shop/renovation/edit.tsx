import React, { useEffect } from 'react'
import { connect } from 'umi'

import Footer from './components/footer'
import Layer from './components/layout'
import LeftNode from './components/leftNode'
import MiddleNode from './components/middleNode'
import RightNode from './components/rightNode'

interface EditRenovationProps{
  dispatch: any;
  match: any;
}
const EditRenovation:React.FC<EditRenovationProps> = (props) => {
  useEffect(()=>{
    let id = props.match.params.id
    props.dispatch({
      type: 'renovation/getComponentsList',
      payload: { id: +id }
    })
    return () => {
      props.dispatch({
        type: 'renovation/clear',
      })
    }
  }, [])

  return (
    <>
    <Layer>
      <LeftNode slotName='left'/>
      <MiddleNode slotName='middle' />
      <RightNode slotName='right' />
    </Layer>
    <Footer />
    </>
  )
}

export default connect()(EditRenovation)
