import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Axios from '../../Axios'
import { useSelector } from 'react-redux'
import { X } from 'lucide-react'

export const Sidebar = () => {
  const [dataC, setDataC] = useState([])
  const { data } = useSelector(state => state.clients)
  useEffect(() => {
    const getAllClients = async () => {
      try {
        const response = await Axios.get('client')
        setDataC(response.data)
      } catch (error) {}
    }
    getAllClients()
  }, [data])
  return (
    <aside
      className={`bg-blue-600 h-screen  w-[200px] sidebar overflow-x-hidden overflow-y-hidden`}
    >
      <ul className='h-full flex flex-col'>
        <li className='hover:bg-blue-400'>
          <NavLink to={'/'} className='flex text-xl text-white p-5'>
            Tavarlar
          </NavLink>
        </li>
        <li className='hover:bg-blue-400'>
          <NavLink to={'/admins'} className='flex text-xl text-white p-5'>
            Adminlar
          </NavLink>
        </li>
        <li className='hover:bg-blue-400'>
          <NavLink to={'/clients'} className='flex text-xl text-white p-5'>
            Buyurtmalar
          </NavLink>
        </li>
        <li className='hover:bg-blue-400'>
          <NavLink to={'/gish'} className='flex text-xl text-white p-5'>
            G'ish
          </NavLink>
        </li>
        <li className='hover:bg-blue-400'>
          <NavLink to={'/workers'} className='flex text-xl text-white p-5'>
            Ishchilar
          </NavLink>
        </li>
        <li className='hover:bg-blue-400'>
          <NavLink to={'/workers-day'} className='flex text-xl text-white p-5'>
            Ishchilar Kun.
          </NavLink>
        </li>
      </ul>
    </aside>
  )
}
