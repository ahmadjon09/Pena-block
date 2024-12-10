import React, { useEffect, useMemo } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Axios from './Axios'
import {
  getUserError,
  getUserPending,
  getUserSuccess
} from './Toolkit/UserSlicer'
import { useDispatch, useSelector } from 'react-redux'
import { Loading } from './Pages/Loading/Loading'
import { Dashboard } from './Pages/Dashboard/Dashboard'
import { RootLayout } from './Layout/RootLayout'
import { AuthLayout } from './Layout/AuthLayout'
import { Error } from './Pages/Error/Error'
import { UserUpdate } from './Pages/AdminForms/UserUpdate'
import { Admins } from './Pages/Admins/Admins'
import { AddNewAdmin } from './Pages/AdminForms/AddNewAdmin'
import { Login } from './Pages/Auth/Login'
import { UpdateClient } from './Pages/Clients/UpdateClient'
import { OneClient } from './Pages/Clients/OneClient'
import { AddNewGoods } from './modules/Orders/AddOrder'
import { AddWereH } from './Pages/werehouse/AddWereH'
import { Oy } from './Pages/werehouse/Oy'
import { NewClient } from './Pages/Clients/NewClient'
import ClientView from './Pages/Clients/ClientView'
import WorkerView from './modules/Workers/Workers'
import { AddNewWorker } from './modules/Workers/AddWorker'
import WorkerDayView from './modules/Workers/WorkersDay'
import { View } from './modules/Workers/View'
import G from './modules/g/G'
import { AddG } from './modules/g/GAdd'
function App () {
  const dispatch = useDispatch()
  const { isAuth, isPending, data } = useSelector(state => state.user)

  useEffect(() => {
    async function getMyData () {
      try {
        dispatch(getUserPending())
        const response = (await Axios.get('admin/me')).data
        if (response.data) {
          dispatch(getUserSuccess(response.data))
        } else {
          dispatch(getUserError('No user data available'))
        }
      } catch (error) {
        dispatch(getUserError(error.response?.data || 'Unknown Token'))
      }
    }
    getMyData()
  }, [dispatch])

  const router = useMemo(() => {
    if (isPending) {
      return createBrowserRouter([
        {
          path: '/',
          element: <Loading />
        }
      ])
    }

    if (isAuth) {
      return createBrowserRouter([
        {
          path: '/',
          element: <RootLayout />,
          children: [
            {
              index: true,
              element: <Dashboard />
            },
            {
              path: 'admins',
              element: <Admins />
            },
            {
              path: 'edit-admin/:id',
              element: <UserUpdate />
            },
            {
              path: 'create-admin',
              element: <AddNewAdmin />
            },
            {
              path: 'clients',
              element: <ClientView />
            },
            {
              path: 'new-client',
              element: <NewClient />
            },
            {
              path: 'updete-client/:id',
              element: <UpdateClient />
            },
            {
              path: 'one-client/:id',
              element: <OneClient />
            },
            {
              path: 'add-goods',
              element: <AddNewGoods />
            },
            {
              path: 'add-wereh',
              element: <AddWereH />
            },
            {
              path: 'oy',
              element: <Oy />
            },
            {
              path: 'workers',
              element: <WorkerView />
            },
            {
              path: 'new-worker',
              element: <AddNewWorker />
            },
            {
              path: 'workers-day',
              element: <WorkerDayView />
            },
            {
              path: 'worker-one/:id',
              element: <View />
            },
            {
              path: 'gish',
              element: <G />
            },
            {
              path: 'new-g',
              element: <AddG />
            },
            {
              path: '*',
              element: <Error />
            }
          ]
        }
      ])
    }

    return createBrowserRouter([
      {
        path: '/',
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Login />
          },
          {
            path: '*',
            element: <Error />
          }
        ]
      }
    ])
  }, [isPending, isAuth])

  return <RouterProvider router={router} />
}

export default App
