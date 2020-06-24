import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

export default () => {
  return <Tiles />;
};

const getMeasurementData = (state: any) => {
  const { measurementData } = state.metric;
  return measurementData;
};

const Tiles = () => {
  const measurementData = useSelector(getMeasurementData);
  const list = useMemo(() => {
    const mList = [];
    for(const metric in measurementData) {
      if(measurementData[metric] && measurementData[metric].metric) {
        mList.push(measurementData[metric]);
      }
    }
    return mList;
  }, [measurementData]);
  
  return (
    <div style={{overflow: "hidden"}}>
      <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
        {list
          ? list.map(a => {
            return (
              <Grid key={a.metric} item sm={2} xs={1}>
                <Card>
                  <CardContent>
                    <Typography component="h5" variant="h5">{a.value} {a.unit}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">{a.metric}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
          : null}
      </Grid>
    </div>
  );
};

