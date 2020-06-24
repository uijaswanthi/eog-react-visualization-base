import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
}

interface IMetricsState {
  metrics: string[];
  selectedMetrics: string[];
  measurementData: any;
  graphData: any;
}

const initialState: IMetricsState = {
  metrics: [],
  graphData: {},
  measurementData: {},
  selectedMetrics: []
}

const slice = createSlice({
  name: 'metric',
  initialState,
  reducers: {
    setMetrics: (state, action) => {
      state.metrics = action.payload;
    },
    updateSelected: (state, action) => {
      state.selectedMetrics = action.payload;
      const measurementData = state.measurementData;
      action.payload.forEach((metric: string) => {
        if(!measurementData[metric]) {
          measurementData[metric] = {};
        }
      });
      state.measurementData = measurementData;
    },
    setMeasurementData: (state, action: any) => {
      if(state.selectedMetrics.indexOf(action.payload.metric) > -1) {
        state.measurementData[action.payload.metric] = action.payload;
      }
    },
    metricsApiErrorAction: (state, action: PayloadAction<ApiErrorAction>) => state,
  }
})

export const reducer = slice.reducer;
export const actions = slice.actions;

