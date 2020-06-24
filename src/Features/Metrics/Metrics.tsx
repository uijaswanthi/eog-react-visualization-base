import React from 'react';
import Box from '@material-ui/core/Box';
import { useDispatch } from 'react-redux';

const Metrics = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <Box display="flex" flexDirection="row">
        <Box display="flex" flexDirection="column">
        </Box>
      </Box>
    </div>
  );
};


export default () => {
  return <Metrics />;
};
