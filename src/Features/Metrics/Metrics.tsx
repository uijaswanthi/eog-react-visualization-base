import { useQuery } from 'urql';
import Box from '@material-ui/core/Box';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from './reducer';
import { IState } from '../../store';
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


const Metrics = () => {
  const dispatch = useDispatch();
  const metrics = useSelector(getMetrics);

  FetchMetricList();

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
    </div>
  );
};

export default () => {
  return <Metrics />;
};
