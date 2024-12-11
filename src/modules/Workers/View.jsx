import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Axios from '../../Axios'
import moment from 'moment-timezone'
import {
  getClientError,
  getClientPending,
  getClientSuccess
} from '../../Toolkit/OneClientSlicer'

export function View () {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { data, isPending, isError } = useSelector(state => state.onclient)
  const [searchTerm, setSearchTerm] = useState('')
  const [monthlyTotals, setMonthlyTotals] = useState({})
  useEffect(() => {
    const fetchClientData = async () => {
      dispatch(getClientPending())
      try {
        const response = await Axios.get(`worker-name/getone/${id}`)
        const clientData = response.data.data

        // Calculate monthly totals
        const totals = clientData.g.reduce((acc, item) => {
          const month = moment(item.createdAt)
            .tz('Asia/Tashkent')
            .format('MM.YYYY')
          if (!acc[month]) {
            acc[month] = { count: 0, totalAmount: 0 }
          }
          acc[month].count += parseInt(item.count) || 0
          acc[month].totalAmount += parseInt(item.count) * 200
          return acc
        }, {})

        setMonthlyTotals(totals)
        dispatch(getClientSuccess(clientData))
      } catch (error) {
        dispatch(
          getClientError(
            error.response?.data?.message || 'Error fetching client data'
          )
        )
      }
    }

    fetchClientData()
  }, [dispatch, id])

  const filteredG = data?.g?.filter(item =>
    item.type?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='p-5 bg-green-100 h-full overflow-y-auto'>
      <div className='w-full h-[100px] flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>{data?.name || 'Client Details'}</h1>
      </div>

      <div className='mb-4'>
        <input
          type='text'
          placeholder='sana boylab qidirish...'
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
          {/* Filtered G */}
          <table className='bg-blue-700 w-full text-white shadow-lg mb-6'>
            <thead className='bg-blue-500'>
              <tr>
                <th className='py-3 px-6'>Turi</th>
                <th className='py-3 px-6'>Soni</th>
                <th className='py-3 px-6'>Sanna</th>
              </tr>
            </thead>
            <tbody>
              {filteredG?.length > 0 ? (
                filteredG.map(item => (
                  <tr
                    key={item._id}
                    className='hover:bg-green-700 text-center transition-colors'
                  >
                    <td className='py-2 px-6'>{item.type}</td>
                    <td className='py-2 px-6'>{item.count}</td>
                    <td className='py-2 px-6'>
                      {moment(item.createdAt)
                        .tz('Asia/Tashkent')
                        .format('DD.MM.YYYY')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='3' className='py-4 text-center'>
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Monthly Totals */}
          <h2 className='text-2xl text-blue-700 mb-4'>Oylik Hisobot</h2>
          <table className='bg-gray-700 w-full text-white shadow-lg'>
            <thead className='bg-gray-500'>
              <tr>
                <th className='py-3 px-6'>Oy</th>
                <th className='py-3 px-6'>Umumiy Son</th>
                <th className='py-3 px-6 '>
                  Umumiy Miqdor
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(monthlyTotals).length > 0 ? (
                Object.entries(monthlyTotals).map(([month, totals]) => (
                  <tr key={month} className='text-center'>
                    <td className='py-2 px-6'>{month}</td>
                    <td className='py-2 px-6'>{totals.count}</td>
                    <td className='py-2 px-6'>
                      {totals.totalAmount.toLocaleString('uz-UZ')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='3' className='py-4 text-center'>
                    Hisobot yo'q
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
