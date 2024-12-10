import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Axios from '../../Axios'
import {
  getClientsError,
  getClientsPending,
  getClientsSuccess
} from '../../Toolkit/ClientSlicer'
import { Trash2 } from 'lucide-react'
import moment from 'moment-timezone'
import { Section } from '../../Components/Section/Section'

export default function ClientView () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data, isPending, isError } = useSelector(state => state.clients)
  const [alert, setAlert] = useState({ message: '', type: '', visible: false })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchClients = async () => {
      dispatch(getClientsPending())
      try {
        const response = (await Axios.get('client')).data
        dispatch(getClientsSuccess(response.data || []))
      } catch (error) {
        dispatch(
          getClientsError(
            error.response?.data?.message || 'Error fetching clients'
          )
        )
      }
    }
    fetchClients()
  }, [dispatch])

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this client?')) return
    try {
      await Axios.delete(`client/${id}`)
      dispatch(getClientsSuccess(data.filter(client => client._id !== id)))
      setAlert({
        message: 'Client deleted successfully',
        type: 'success',
        visible: true
      })
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || 'Error deleting client',
        type: 'error',
        visible: true
      })
    }
    setTimeout(() => setAlert(prev => ({ ...prev, visible: false })), 3000)
  }

  const formatPrice = price =>
    new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS'
    }).format(price)

  // Filter clients based on search input
  const filteredClients = Array.isArray(data)
    ? data.filter(client => {
        const nameMatch = client.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        const dateMatch = moment(client.createdAt)
          .tz('Asia/Tashkent')
          .format('DD.MM.YYYY')
          .includes(searchTerm)
        return nameMatch || dateMatch
      })
    : []

  const formatCurrency = amount =>
    new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS'
    }).format(amount)

  // Check if data is an array and then use reduce
  const monthlyTotals = Array.isArray(data)
    ? data.reduce((acc, client) => {
        const month = moment(client.createdAt)
          .tz('Asia/Tashkent')
          .format('MM.YYYY')

        if (!acc[month]) {
          acc[month] = { weight: 0, count: 0, price: 0 }
        }

        acc[month].count += client.count || 0
        acc[month].price += client.price || 0

        return acc
      }, {})
    : {}

  const totalsArray = monthlyTotals
    ? Object.entries(monthlyTotals).map(([month, totals]) => ({
        month,
        ...totals
      }))
    : []

  return (
    <Section>
      <div className='p-5 w-full h-full overflow-y-auto'>
        {alert.visible && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
              alert.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {alert.message}
          </div>
        )}

        <div className='w-full h-[100px] flex justify-between items-center'>
          <h1 className='text-3xl font-bold'>Buyurtmalar</h1>
          <button
            onClick={() => navigate('/new-client')}
            className='bg-green-700 text-white px-4 py-2 rounded shadow hover:bg-blue-500 transition-colors'
          >
            Add New Client +
          </button>
        </div>

        {/* Search Input */}
        <div className='mb-4'>
          <input
            type='text'
            placeholder='Ism yoki sana bo‘yicha qidirish...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {isPending ? (
          <p className='text-center text-gray-600'>Loading...</p>
        ) : isError ? (
          <p className='text-red-500 text-center'>{isError}</p>
        ) : filteredClients.length > 0 ? (
          <table className='bg-blue-700 w-full text-white shadow-lg'>
            <thead className='bg-blue-500'>
              <tr>
                <th className='py-3 px-6'>Ism</th>
                <th className='py-3 px-6'>Phone</th>
                <th className='py-3 px-6'>Soni</th>
                <th className='py-3 px-6'>Narx</th>
                <th className='py-3 px-6'>Turi</th>
                <th className='py-3 px-6'>Sana</th>
                <th className='py-3 px-4 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr
                  key={client._id}
                  className='hover:bg-green-700 transition-colors'
                >
                  <td className='py-2 px-6'>{client.name}</td>
                  <td className='py-2 px-6'>{client.phoneNumber}</td>
                  <td className='py-2 px-6'>{client.count}</td>
                  <td className='py-2 px-6'>{formatPrice(client.price)}</td>
                  <td className='py-2 px-6'>{client.type}</td>
                  <td className='py-2 px-6'>
                    {moment(client.createdAt)
                      .tz('Asia/Tashkent')
                      .format('DD.MM.YYYY || HH:mm')}
                  </td>
                  <td className='py-2 px-4 text-center'>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className='bg-white rounded-md p-1'
                    >
                      <Trash2 className='text-green-600 hover:text-green-800 cursor-pointer' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='text-gray-600 text-center'>No clients found</p>
        )}

        <div className='h-full w-full'>
          <h2 className='text-2xl font-bold text-blue-700'>Oylik Hisobot</h2>
          <table className='min-w-full bg-gray-800 text-white shadow-lg'>
            <thead className='bg-gray-700'>
              <tr>
                <th className='py-3 px-6 text-left'>Oy</th>
                <th className='py-3 px-6 text-left'>Jami Soni</th>
                <th className='py-3 px-6 text-left'>Jami Narx</th>
              </tr>
            </thead>
            <tbody>
              {totalsArray.map(total => (
                <tr
                  key={total.month}
                  className='odd:bg-gray-700 even:bg-gray-600'
                >
                  <td className='py-2 px-6 border-b'>{total.month}</td>
                  <td className='py-2 px-6 border-b'>{total.count}</td>
                  <td className='py-2 px-6 border-b'>
                    {formatCurrency(total.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  )
}
