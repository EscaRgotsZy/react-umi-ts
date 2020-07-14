
import React, { useState, useEffect, } from 'react'
import { Cascader } from 'antd'
import { getAreas, getCitys, getProvs } from '@/services/common/city'


interface ChoiceProvinceProps {
  changeOnSelect?: boolean;// 当此项为 true 时，点选每级菜单选项值都会发生变化
  cityChange: Function;
  value: string[];// 默认省市区
}
const ChoiceProvince = (props: ChoiceProvinceProps) => {
  const { changeOnSelect = false, cityChange, value } = props
  const [cityList, setCityList] = useState<any[]>([]);// 城市下拉列表

  useEffect(() => {
    if (Array.isArray(value) && value.length === 3) {
      let [prov, city] = value;
      let needLoad = !cityList.filter(v => {
        if (v.value === prov) {
          if ((v.children || []).length) {
            return true
          }
        }
        return false
      }).length
      if (needLoad) {
        Promise.all([getCitys({ provinceId: prov }), getAreas({ cityId: city })]).then(
          (res) => {
            let [cityArr, areaArr] = res;

            let newCityArr = cityArr.map((v: any) => {
              if (v.value === city) {
                return {
                  ...v,
                  children: areaArr
                }
              }
              return v
            })
            let newCityList = cityList.map(v => {
              if (v.value === prov) {
                return {
                  ...v,
                  children: newCityArr
                }
              }
              return v;
            })
            setCityList(newCityList)
          }
        )
      }
    }
  }, [value])

  useEffect(() => {
    featchProvs()
  }, [])

  async function featchProvs() {
    let res = await getProvs();
    setCityList(res)
  }


  // 动态加载下一级分类
  async function loadData(selectedOptions: any): Promise<any> {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    let { value, level } = targetOption;
    targetOption.loading = true;
    let res: any = [];
    if (level === 1) {
      res = await getCitys({ provinceId: value });
    }
    if (level === 2) {
      res = await getAreas({ cityId: value });
    }
    targetOption.loading = false;
    targetOption.children = res;
    setCityList([...cityList])
  };

  return <Cascader
    style={{ width: 350 }}
    options={cityList}
    value={value}
    loadData={loadData}
    onChange={(value: Array<string>) => {
      cityChange(value)
    }}
    changeOnSelect={changeOnSelect}
  />
}

export default ChoiceProvince