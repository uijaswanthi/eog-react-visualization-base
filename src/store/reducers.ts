import { reducer as metricReducer } from '../Features/Metrics/reducer';
import { reducer as weatherReducer } from '../Features/Weather/reducer';

export default {
  metric: metricReducer,
  weather: weatherReducer,
};
