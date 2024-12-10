import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Axios from '../../Axios'
import {
  getWorkersError,
  getWorkersPending,
  getWorkersSuccess
} from '../../Toolkit/WorkerSlicer'
import { Send } from 'lucide-react'
import { Section } from '../../Components/Section/Section'

export default function WorkerDayView () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data, isPending, isError } = useSelector(state => state.workers)
  const [alert, setAlert] = useState({ message: '', type: '', visible: false })
  const [workerData, setWorkerData] = useState({})

  useEffect(() => {
    const fetchWorkers = async () => {
      dispatch(getWorkersPending())
      try {
        const response = (await Axios.get('worker-name')).data
        dispatch(getWorkersSuccess(response.data || []))
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

  const handleInputChange = (e, id) => {
    const { name, value } = e.target
    setWorkerData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [name]: value
      }
    }))
  }

  const handleSubmit = async (e, id) => {
    e.preventDefault()
    const { type, count } = workerData[id] || {}
    if (!type || !count) {
      setAlert({
        message: 'Iltimos, barcha maydonlarni to‘ldiring',
        type: 'error',
        visible: true
      })
      return
    }

    try {
      const newItem = { type, count }
      await Axios.put(`worker-name/${id}`, { type, count }) // Faqat kerakli qiymatlarni yuborish
      setAlert({
        message: 'Maʼlumot muvaffaqiyatli yuborildi',
        type: 'success',
        visible: true
      })

      // Formani tozalash
      setWorkerData(prev => ({
        ...prev,
        [id]: { type: '', count: '' }
      }))
      setTimeout(() => setAlert({ visible: false }), 3000)
    } catch (error) {
      setAlert({ message: 'Xatolik yuz berdi', type: 'error', visible: true })
    }
  }

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
          <h1 className='text-3xl font-bold'>Yangi Malumot Kiritish</h1>
        </div>

        {isPending ? (
          <p className='text-center text-gray-600'>Loading...</p>
        ) : isError ? (
          <p className='text-red-500 text-center'>{isError}</p>
        ) : data?.length > 0 ? (
          <table className='bg-blue-700 w-full text-white shadow-lg'>
            <thead className='bg-blue-500'>
              <tr>
                <th className='py-3 px-6'>Ism</th>
                <th className='py-3 px-6'>Turi</th>
                <th className='py-3 px-6'>Soni</th>
                <th className='py-3 px-4 text-center'>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {data.map(Worker => (
                <tr
                  key={Worker._id}
                  className='hover:bg-green-700 text-center border transition-colors'
                >
                  <td className='py-2 px-6'>{Worker.name}</td>
                  <td className='py-2 px-6'>
                    <textarea
                      type='text'
                      name='type'
                      placeholder='Turi'
                      className='rounded-md text-black w-full p-1'
                      value={workerData[Worker._id]?.type || ''}
                      onChange={e => handleInputChange(e, Worker._id)}
                    />
                  </td>
                  <td className='py-2 px-6'>
                    <input
                      type='number'
                      name='count'
                      placeholder='Soni'
                      className='rounded-md text-black w-full p-1'
                      value={workerData[Worker._id]?.count || ''}
                      onChange={e => handleInputChange(e, Worker._id)}
                    />
                  </td>
                  <td className='py-2 px-4 text-center'>
                    <button
                      className='bg-white rounded-md p-1'
                      onClick={e => handleSubmit(e, Worker._id)}
                    >
                      <Send className='text-blue-600 hover:text-blue-800 cursor-pointer' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='text-gray-600 text-center'>Ishchilar topilmadi</p>
        )}
      </div>
    </Section>
  )
}
