import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import MainApp from './components/MainApp';

const App = () => {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  )
}

export default App
