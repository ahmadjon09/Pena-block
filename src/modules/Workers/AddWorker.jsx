import React, { useState } from 'react'
import Axios from '../../Axios'
import { Section } from '../../Components/Section/Section'
import { useNavigate } from 'react-router-dom'

export const AddNewWorker = () => {
  const [error, setError] = useState('')
  const [goodsData, setGoodsData] = useState({
    name: '',
    phoneNumber: 0
  })
  const navigate = useNavigate()

  const handleFormSubmit = async e => {
    e.preventDefault()
    try {
      // Make sure all necessary data is provided
      if (goodsData) {
        const { data } = await Axios.post('/worker-name/create', goodsData)
        navigate('/workers') // Navigate after successful submission
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Хатолик юз берди')
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target

    setGoodsData(prevData => {
      const updatedData = { ...prevData, [name]: value }
      return updatedData
    })
  }

  return (
    <Section>
      <form
        onSubmit={handleFormSubmit}
        className='flex flex-col space-y-4 w-full mx-auto mt-14 md:w-[500px]'
      >
        <h1 className='text-4xl text-center'>Янги Ishchi</h1>
        <label htmlFor='name' className='sr-only'>
          Ism
        </label>
        <input
          id='name'
          type='text'
          name='name'
          className='border border-gray-300 rounded-md p-2 w-full'
          onChange={handleInputChange}
          placeholder='Ism'
          required
        />
        <label htmlFor='count' className='sr-only'>
          Tel raqami
        </label>
        <input
          id='count'
          type='number'
          name='phoneNumber'
          className='border border-gray-300 rounded-md p-2 w-full'
          onChange={handleInputChange}
          placeholder='tel'
          required
        />
        {goodsData.totalPrice > 0 && (
          <p className='text-green-500 text-lg mt-2'>
            Umumiy narx:{' '}
            {goodsData.totalPrice.toLocaleString('uz-UZ', {
              style: 'currency',
              currency: 'UZS',
              minimumFractionDigits: 2
            })}
          </p>
        )}
        {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
        <button
          type='submit'
          className='bg-green-700 w-full text-xl py-2 rounded-md text-white'
        >
          Юбориш
        </button>
      </form>
    </Section>
  )
}