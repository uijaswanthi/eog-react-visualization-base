import Box from '@material-ui/core/Box';
import { useQuery, useSubscription } from 'urql';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useMemo, useCallback } from 'react';

import { actions } from './reducer';
import { IState } from '../../store';
import Tiles from '../../components/Tiles';
import Graph from '../../components/Graph';
import Dropdown from '../../components/Dropdown';

const getMetrics = (state: IState) => {
  const { metrics } = state.metric
  return metrics;
}

const getSelectedMetrics = (state: IState) => {
  const { selectedMetrics } = state.metric
  return selectedMetrics;
}


const query = `
  query {
    getMetrics
  }
`;

const getLastThirtyMinMeasurements = `
  query($measurementQuery:  [MeasurementQuery]) {
    getMultipleMeasurements(input: $measurementQuery) {
      metric
      measurements{
        metric
        at
        value
        unit
      }
    }
  }
`;

const subscription = `
  subscription {
    newMeasurement{
      metric
      at
      value
      unit
    }
  }
`;

const FetchMetricList = () => {
  const dispatch = useDispatch();

  const [result] = useQuery({
    query
  });
  const { data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorAction({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    dispatch(actions.setMetrics(getMetrics));
  }, [dispatch, data, error]);
};


const FetchNewMeasurementData = () => {
  const dispatch = useDispatch();
  const receiveMeasurement = useCallback(
    measurement =>dispatch(actions.setMeasurementData(measurement)),
    [dispatch]
  );

  const [result] = useSubscription({
    query: subscription,
    variables: {}
  });
  const { data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorAction({ error: error.message }));
      return
    }
    if (!data) {
      return;
    }
    const { newMeasurement } = data;
    receiveMeasurement(newMeasurement);
  }, [data, error, dispatch, receiveMeasurement]);
};

const FetchMultipleMeasurements = (measurementQuery: any[]) => {
  const dispatch = useDispatch();
  const [result] = useQuery({
    query: getLastThirtyMinMeasurements,
    variables: {
      measurementQuery,
    }
  });
  const { data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorAction({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMultipleMeasurements } = data;
    const graphData: any = {};
    for (let i = 0; i < getMultipleMeasurements.length; i++) {
      graphData[getMultipleMeasurements[i].metric] = {
        unit: getMultipleMeasurements[i].measurements[0].unit,
        data: getMultipleMeasurements[i].measurements,
      };
    }
    dispatch(actions.setGraphData(graphData as any))
  }, [dispatch, data, error]);
};

const Metrics = () => {
  const dispatch = useDispatch();
  const metrics = useSelector(getMetrics);
  const selectedMetrics = useSelector(getSelectedMetrics);
  const measurementQuery = useMemo(() => selectedMetrics.map((item: string) => {
    return {
      metricName: item,
      after: (Date.now() - 1800000)
    }
  }), [selectedMetrics]);

  FetchMetricList();
  FetchNewMeasurementData();
  FetchMultipleMeasurements(measurementQuery);

  const handleSelectedChange = (_event: React.ChangeEvent<{}>, values: string[]) => {
    dispatch(actions.updateSelected(values));
  }

  return (
    <div>
      <Box display="flex" flexDirection="row">
        <Box display="flex" flexDirection="column">
          <Dropdown items={metrics} handleSelectedChange={handleSelectedChange} />
        </Box>
      </Box>
      <br />
      <Graph />
      <br />
      <Tiles />
    </div>
  );
};

export default () => {
  return <Metrics />;
};
