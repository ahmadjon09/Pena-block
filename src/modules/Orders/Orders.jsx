import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import Axios from '../../Axios'
import { Trash2 } from 'lucide-react'
import {
  getOrdersError,
  getOrdersPending,
  getOrdersSuccess
} from '../../Toolkit/OrdersSlicer'
import moment from 'moment-timezone'

export const Orders = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data, isPending, isError } = useSelector(state => state.orders)

  const [alert, setAlert] = useState({ message: '', type: '', visible: false })
  const [searchTerm, setSearchTerm] = useState('') // State for search input

  useEffect(() => {
    const getAllGoods = async () => {
      dispatch(getOrdersPending())
      try {
        const response = (await Axios.get('goods')).data
        if (Array.isArray(response.data)) {
          dispatch(getOrdersSuccess(response.data))
        } else {
          throw new Error('API response does not contain an array.')
        }
      } catch (error) {
        dispatch(
          getOrdersError(error.response?.data?.message || 'Хатолик юз берди')
        )
      }
    }
    getAllGoods()
  }, [dispatch])

  const handleDelete = async id => {
    if (!window.confirm("Bu Tavarni o'chirishni hohlaysizmi?")) return
    try {
      await Axios.delete(`/goods/${id}`)
      dispatch(getOrdersSuccess(data.filter(post => post._id !== id)))
      setAlert({
        message: 'Tavar муваффақиятли ўчирилди',
        type: 'success',
        visible: true
      })
    } catch (error) {
      setAlert({
        message:
          error.response?.data?.message || 'Tavar ўчиришда хатолик юз берди',
        type: 'error',
        visible: true
      })
    }
    setTimeout(() => {
      setAlert({ ...alert, visible: false })
    }, 3000)
  }

  // Format numbers as UZS currency
  const formatCurrency = amount =>
    new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS'
    }).format(amount)

  // Filtered data based on search term
  const filteredData = Array.isArray(data)
    ? data.filter(item => {
        const nameMatch = item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        const dateMatch = moment(item.createdAt)
          .tz('Asia/Tashkent')
          .format('DD.MM.YYYY')
          .includes(searchTerm)
        return nameMatch || dateMatch
      })
    : []

  const monthlyTotals = data?.reduce((acc, client) => {
    const month = moment(client.createdAt).tz('Asia/Tashkent').format('MM.YYYY')

    if (!acc[month]) {
      acc[month] = { weight: 0, count: 0, price: 0 }
    }

    acc[month].weight += client.weight || 0
    acc[month].count += client.count || 0
    acc[month].price += client.price || 0

    return acc
  }, {})

  const totalsArray = monthlyTotals
    ? Object.entries(monthlyTotals).map(([month, totals]) => ({
        month,
        ...totals
      }))
    : []

  return (
    <div className='p-4 w-full h-full overflow-y-auto'>
      {alert.visible && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg transition-opacity duration-300 
          ${
            alert.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {alert.message}
        </div>
      )}
      {isPending ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className='text-red-500 text-center text-xl'>Хатолик: {isError}</p>
      ) : (
        <>
          {/* Search Input */}
          <div className='mb-4'>
            <input
              type='text'
              placeholder='Nomi yoki sana bo‘yicha qidirish...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Data Table */}
          <table className='min-w-full bg-blue-700 text-white shadow-lg mb-8'>
            <thead className='bg-blue-500'>
              <tr>
                <th className='py-3 px-6 text-left border-b border-blue-500'>
                  Nomi
                </th>
                <th className='py-3 px-6 text-left border-b border-blue-500'>
                  kg
                </th>
                <th className='py-3 px-6 text-left border-b border-blue-500'>
                  Soni
                </th>
                <th className='py-3 px-4 text-left border-b border-blue-500'>
                  Narxi
                </th>
                <th className='py-3 px-4 text-left border-b border-blue-500'>
                  Sana
                </th>
                <th className='py-3 px-4 text-center border-b border-blue-500'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map(Goods => (
                  <tr
                    key={Goods._id}
                    className='hover:bg-green-700 transition-colors'
                  >
                    <td className='py-1 px-6 border-b border-blue-500'>
                      {Goods.name}
                    </td>
                    <td className='py-1 px-6 border-b border-blue-500'>
                      {Goods.weight}
                    </td>
                    <td className='py-1 px-6 border-b border-blue-500'>
                      {Goods.count}
                    </td>
                    <td className='py-1 px-6 border-b border-blue-500'>
                      {formatCurrency(Goods.price)}
                    </td>
                    <td className='py-1 px-6 border-b border-blue-500'>
                      {moment(Goods.createdAt)
                        .tz('Asia/Tashkent')
                        .format('DD.MM.YYYY || HH:mm')}
                    </td>
                    <td className='py-1 px-4 border-b border-blue-500 text-center'>
                      <div className='flex items-center gap-3 justify-center'>
                        <button
                          onClick={e => (
                            e.stopPropagation(), handleDelete(Goods._id)
                          )}
                          className='bg-white rounded-md p-1'
                        >
                          <Trash2 className='text-green-600 text-xs hover:text-green-800 cursor-pointer' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='6' className='text-center py-4 text-white'>
                    Qidiruv natijasi topilmadi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Monthly Totals */}
          <div className='h-full w-full'>
            <h2 className='text-2xl font-bold text-blue-700'>Oylik Hisobot</h2>
            <table className='min-w-full bg-gray-800 text-white shadow-lg'>
              <thead className='bg-gray-700'>
                <tr>
                  <th className='py-3 px-6 text-left'>Oy</th>
                  <th className='py-3 px-6 text-left'>Jami Kg</th>
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
                    <td className='py-2 px-6 border-b'>{total.weight}</td>
                    <td className='py-2 px-6 border-b'>{total.count}</td>
                    <td className='py-2 px-6 border-b'>
                      {formatCurrency(total.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
