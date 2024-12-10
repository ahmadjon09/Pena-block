import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Axios from '../../Axios'
import {
  getWorkersError,
  getWorkersPending,
  getWorkersSuccess
} from '../../Toolkit/WorkerSlicer'
import { Trash2 } from 'lucide-react'
import moment from 'moment-timezone'
import { Section } from '../../Components/Section/Section'

export default function WorkerView () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data, isPending, isError } = useSelector(state => state.workers)
  const [alert, setAlert] = useState({ message: '', type: '', visible: false })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchWorkers = async () => {
      dispatch(getWorkersPending())
      try {
        const response = (await Axios.get('worker-name')).data
        dispatch(getWorkersSuccess(response.data || []))
        console.log(data)
      } catch (error) {
        dispatch(
          getWorkersError(
            error.response?.data?.message || 'Error fetching Workers'
          )
        )
      }
    }
    fetchWorkers()
  }, [dispatch])

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this Worker?')) return
    try {
      await Axios.delete(`worker-name/${id}`)
      dispatch(getWorkersSuccess(data.filter(Worker => Worker._id !== id)))
      setAlert({
        message: 'Worker deleted successfully',
        type: 'success',
        visible: true
      })
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || 'Error deleting Worker',
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

  // Filter Workers based on search input
  const filteredWorkers = Array.isArray(data)
    ? data.filter(Worker => {
        const nameMatch = Worker.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        const dateMatch = moment(Worker.createdAt)
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
  const monthlyTotals = data.reduce((acc, Worker) => {
    const month = moment(Worker.createdAt).tz('Asia/Tashkent').format('MM.YYYY')

    if (!acc[month]) {
      acc[month] = { weight: 0, count: 0, price: 0 } // Har bir oy uchun boshlang'ich qiymatlar
    }
    return acc
  }, {})

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
          <h1 className='text-3xl font-bold'>Ishchilar</h1>
          <button
            onClick={() => navigate('/new-worker')}
            className='bg-green-700 text-white px-4 py-2 rounded shadow hover:bg-blue-500 transition-colors'
          >
            Add New Worker +
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
        ) : filteredWorkers.length > 0 ? (
          <table className='bg-blue-700 w-full text-white shadow-lg'>
            <thead className='bg-blue-500'>
              <tr>
                <th className='py-3 px-6'>Ism</th>
                <th className='py-3 px-6'>Tel</th>
                <th className='py-3 px-6'>Sana</th>
                <th className='py-3 px-4 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map(Worker => (
                <tr
                  onClick={() => navigate(`/worker-one/${Worker._id}`)}
                  key={Worker._id}
                  className='hover:bg-green-700 text-center transition-colors'
                >
                  <td className='py-2 px-6'>{Worker.name}</td>
                  <td className='py-2 px-6'>{Worker.phoneNumber}</td>
                  <td className='py-2 px-6'>
                    {moment(Worker.createdAt)
                      .tz('Asia/Tashkent')
                      .format('DD.MM.YYYY || HH:mm')}
                  </td>
                  <td className='py-2 px-4 text-center'>
                    <button
                      onClick={() => handleDelete(Worker._id)}
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
          <p className='text-gray-600 text-center'>No Workers found</p>
        )}
      </div>
    </Section>
  )
}
