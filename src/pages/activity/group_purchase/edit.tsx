import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Steps } from 'antd';
import { connect } from 'umi';
import { StateType } from '@/models/group_purchase'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import styles from './edit.less';
const { Step } = Steps;


const getCurrentStepAndComponent = (current?: string) => {
  switch (current) {
    case 'step1':
      return { step: 0, component: <Step1/> };
    case 'step2':
    default:
      return { step: 1, component: <Step2 /> };
  }
};

interface FormStepFormProps {
  dispatch?: any;
  current: StateType['current'];
  history: any;
  match: any;
}

const GroupActivity: React.FC<FormStepFormProps>  = ({ current, history, match, dispatch }) => {
  const [stepComponent, setStepComponent] = useState<React.ReactNode>( <Step1/>);
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    const { step, component } = getCurrentStepAndComponent(current);
    setCurrentStep(step);
    setStepComponent(component);
  }, [current]);

  useEffect(()=>{
    dispatch({
      type: 'group_purchase/setStatus',
      payload: {
        id: match.params.id,
        copy: history.location.query.copy,
        read: history.location.query.read
      }
    })
    return () => {
      dispatch({
        type: 'group_purchase/clearState',
      })
    }
  }, [])



  return (
    <PageHeaderWrapper>
     <Card bordered={false}>
        <>
          <Steps current={currentStep} className={styles.steps}>
            <Step title="选择活动商品" />
            <Step title="设置活动信息" />
          </Steps>
          <div style={{marginTop: 50}}>
            {stepComponent}
          </div>
        </>
      </Card>
    </PageHeaderWrapper>
  )
}

export default connect(({ group_purchase }: { group_purchase: StateType }) => ({
  current: group_purchase.current,
}))(GroupActivity);
