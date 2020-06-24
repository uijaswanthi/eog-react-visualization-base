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

const  getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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
    setGraphData: (state, action) => {
      const graphData = state.graphData;
      for (const metric in action.payload) {
        if(!graphData[metric]) {
          graphData[metric] = {
            unit: action.payload[metric].unit,
            data: action.payload[metric].data,
            color: getRandomColor(),
          };
        }
      }
      state.graphData = graphData;
    },
    setMeasurementData: (state, action: any) => {
      if(state.selectedMetrics.indexOf(action.payload.metric) > -1) {
        state.measurementData[action.payload.metric] = action.payload;
      }
      const graphData = state.graphData;
      if(graphData[action.payload.metric] && graphData[action.payload.metric].data && graphData[action.payload.metric].data.length > 0) {
        graphData[action.payload.metric].data.push(action.payload);
        graphData[action.payload.metric].data.shift()
      }
      state.graphData = graphData;
    },
    metricsApiErrorAction: (state, action: PayloadAction<ApiErrorAction>) => state,
  }
})

export const reducer = slice.reducer;
export const actions = slice.actions;

