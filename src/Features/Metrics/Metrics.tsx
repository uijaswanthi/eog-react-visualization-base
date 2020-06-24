import Box from '@material-ui/core/Box';
import { useQuery, useSubscription } from 'urql';
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from './reducer';
import { IState } from '../../store';
import Tiles from '../../components/Tiles';
import Dropdown from '../../components/Dropdown';

const getMetrics = (state: IState) => {
  const { metrics } = state.metric
  return metrics;
}

const query = `
  query {
    getMetrics
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

const Metrics = () => {
  const dispatch = useDispatch();
  const metrics = useSelector(getMetrics);

  FetchMetricList();
  FetchNewMeasurementData();

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
      <Tiles />
    </div>
  );
};

export default () => {
  return <Metrics />;
};
