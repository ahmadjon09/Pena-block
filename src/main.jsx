import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './Toolkit/UserSlicer.jsx'
import { Provider } from 'react-redux'
import AdminsReducer from './Toolkit/AdminsSlicer.jsx'
import OrdersReducer from './Toolkit/OrdersSlicer.jsx'
import ClientReducer from './Toolkit/ClientSlicer.jsx'
import OneClientReducer from './Toolkit/OneClientSlicer.jsx'
import WorkersReducer from './Toolkit/WorkerSlicer.jsx'
import GsReducer from './Toolkit/GSlicer.jsx'
import { Container } from './Components/Container/Container.jsx'

const store = configureStore({
  reducer: {
    user: UserReducer,
    admins: AdminsReducer,
    orders: OrdersReducer,
    clients: ClientReducer,
    onclient: OneClientReducer,
    workers: WorkersReducer,
    g: GsReducer
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Container>
      <App />
    </Container>
  </Provider>
)
