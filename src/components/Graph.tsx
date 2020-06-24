import moment from 'moment';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { IState } from '../store';

const getGraphData = (state: IState) => {
  const { graphData } = state.metric
  return graphData;
}

const measurementDataToChartFormat = (graphData: any) => {
  const list = [];

  if(graphData && Object.keys(graphData).length === 0) {
    return null;
  }

  let minLen = 999999999999999999999;
  for(const key in graphData) {
    const cLen = graphData[key].data.length;
    minLen = minLen > cLen ? cLen : minLen;
  }

  for (let i = 0; i < minLen; i++) {
    let obj = {} as any;
    for(const key in graphData) {
      obj[key] = graphData[key].data[i].value; 
      obj["at"] = graphData[key].data[i].at;
    }
    list.push(obj);
  }
  return list;
};

const Graph = () => {
  const graphData = useSelector(getGraphData);
  
  const data = useMemo(() => measurementDataToChartFormat(graphData), [graphData]);
  if(!data || data.length === 0){
    return null;
  }
  return (    
    <ResponsiveContainer width="95%" height={400}>
      <LineChart data={data}>
        <Tooltip labelFormatter={(value: any) => moment(value).format('MM-DD-YYYY hh:mm:ss')} />
        {
          Object.keys(graphData).map((key: any, i: number) => {
            const item = graphData[key];
            return (
              <Line
                type="monotone"
                key={key + "_" +i}
                dataKey={key}
                stroke={item.color}
                yAxisId={item.unit}
                strokeOpacity="1"
                activeDot={{ r: 8 }}
                isAnimationActive={false}
                dot={false}
              />
            )
          })
        }
        <XAxis
          dataKey="at"
          domain={['auto', 'auto']}
          interval={230}
          tickFormatter={(tick: any) => moment(tick).format('hh:mm')}
          type='number'
          scale='time'
        />
        {
          Object.keys(graphData).map((key: any, i: number) => {
            const item = graphData[key];
            return (
              <YAxis
                key={key + "_y_" +i}
                width={70}
                yAxisId={item.unit}
                type="number"
                unit={item.unit}
                scale='auto'
                domain={[0, 'auto']}
              />
            )
          })
        }
      </LineChart>
    </ResponsiveContainer>
  );
}
export default Graph;