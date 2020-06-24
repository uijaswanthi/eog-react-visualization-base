import React from 'react';
import {SubscriptionClient} from 'subscriptions-transport-ws';
import {Provider, createClient, subscriptionExchange, defaultExchanges} from 'urql'

import Metrics from '../Features/Metrics/Metrics';

const socketClient = new SubscriptionClient('ws://react.eogresources.com/graphql',{ reconnect: true})

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [...defaultExchanges, subscriptionExchange({
    forwardSubscription: operation => socketClient.request(operation)
  })]
});

export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};
