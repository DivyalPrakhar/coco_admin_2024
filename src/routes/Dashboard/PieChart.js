import React from 'react'
import { Pie } from '@ant-design/charts';
import _ from 'lodash'

export const PieCart = ({data}) => {

    const chartData = data
    
    const config = {
        appendPadding: 10,
        data:chartData,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        label: {
          type: 'inner',
          offset: '-50%',
          content: '{value}',
          style: {
            textAlign: 'center',
            fontSize: 14,
          },
        },
        interactions: [
          {
            type: 'element-selected',
          },
          {
            type: 'element-active',
          },
        ],
        statistic: {
          title: false,
          content: {
            style: {
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            content: _.sum(data.map(d => parseInt(d.value))),
          },
        },
    };
    
    return <Pie {...config}/>
} 