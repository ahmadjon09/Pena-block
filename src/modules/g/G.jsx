import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Axios from '../../Axios'
import { getGsError, getGsPending, getGsSuccess } from '../../Toolkit/GSlicer'
import { Trash2 } from 'lucide-react'
import moment from 'moment-timezone'
import { Section } from '../../Components/Section/Section'

export default function G () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data, isPending, isError } = useSelector(state => state.g)
  const [alert, setAlert] = useState({ message: '', type: '', visible: false })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchGs = async () => {
      dispatch(getGsPending())
      try {
        const response = (await Axios.get('gish')).data
        dispatch(getGsSuccess(response.data || []))
      } catch (error) {
        dispatch(
          getGsError(error.response?.data?.message || 'Error fetching Gs')
        )
      }
    }
    fetchGs()
  }, [dispatch])

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this G?')) return
    try {
      await Axios.delete(`gish/${id}`)
      dispatch(getGsSuccess(data.filter(G => G._id !== id)))
      setAlert({
        message: 'G deleted successfully',
        type: 'success',
        visible: true
      })
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || 'Error deleting G',
        type: 'error',
        visible: true
      })
    }
    setTimeout(() => setAlert(prev => ({ ...prev, visible: false })), 3000)
  }

  const filteredGs = Array.isArray(data)
    ? data.filter(G => {
        const nameMatch = G.type
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        const dateMatch = moment(G.createdAt)
          .tz('Asia/Tashkent')
          .format('DD.MM.YYYY')
          .includes(searchTerm)
        return nameMatch || dateMatch
      })
    : []

  // Calculate monthly totals
  const monthlyTotals = data.reduce((acc, G) => {
    const month = moment(G.createdAt).tz('Asia/Tashkent').format('MM.YYYY')
    if (!acc[month]) {
      acc[month] = { count: 0 }
    }
    acc[month].count += parseInt(G.count) || 0
    return acc
  }, {})

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
            onClick={() => navigate('/new-g')}
            className='bg-green-700 text-white px-4 py-2 rounded shadow hover:bg-blue-500 transition-colors'
          >
            Add New G +
          </button>
        </div>

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
        ) : (
          <>
            {filteredGs.length > 0 ? (
              <table className='bg-blue-700 w-full text-white shadow-lg'>
                <thead className='bg-blue-500'>
                  <tr>
                    <th className='py-3 px-6'>Turi</th>
                    <th className='py-3 px-6'>Soni</th>
                    <th className='py-3 px-6'>Sana</th>
                    <th className='py-3 px-4 text-center'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGs.map(G => (
                    <tr
                      key={G._id}
                      className='hover:bg-green-700 text-center transition-colors'
                    >
                      <td className='py-2 px-6'>{G.type}</td>
                      <td className='py-2 px-6'>{G.count}</td>
                      <td className='py-2 px-6'>
                        {moment(G.createdAt)
                          .tz('Asia/Tashkent')
                          .format('DD.MM.YYYY || HH:mm')}
                      </td>
                      <td className='py-2 px-4 text-center'>
                        <button
                          onClick={() => handleDelete(G._id)}
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
              <p className='text-gray-600 text-center'>No data found</p>
            )}

            {/* Monthly Totals */}
            <h2 className='text-2xl text-blue-700 mt-6 mb-4'>Oylik Hisobot</h2>
            <table className='bg-gray-700 w-full text-white shadow-lg'>
              <thead className='bg-gray-500'>
                <tr>
                  <th className='py-3 px-6'>Oy</th>
                  <th className='py-3 px-6'>Umumiy Soni</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(monthlyTotals).length > 0 ? (
                  Object.entries(monthlyTotals).map(([month, totals]) => (
                    <tr key={month} className='text-center'>
                      <td className='py-2 px-6'>{month}</td>
                      <td className='py-2 px-6'>{totals.count}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='2' className='py-4 text-center'>
                      Hisobot yo'q
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </Section>
  )
}
