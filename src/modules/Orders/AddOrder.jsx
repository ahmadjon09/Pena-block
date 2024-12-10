import React, { useState } from 'react'
import Axios from '../../Axios'
import { Section } from '../../Components/Section/Section'
import { useNavigate } from 'react-router-dom'

export const AddNewGoods = () => {
  const [error, setError] = useState('')
  const [goodsData, setGoodsData] = useState({
    name: '',
    price: 0,
    count: 0,
    weight: 0,
    unit: 'kg',
    totalPrice: 0
  })
  const navigate = useNavigate()

  const handleFormSubmit = async e => {
    e.preventDefault()
    try {
      // Make sure all necessary data is provided
      if (goodsData) {
        const { data } = await Axios.post('goods/create', {
          name: goodsData.name,
          price: goodsData.totalPrice, // Send totalPrice as the price
          weight: goodsData.weight,
          count: goodsData.count
        })

        navigate('/') // Navigate after successful submission
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Хатолик юз берди')
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target

    setGoodsData(prevData => {
      const updatedData = { ...prevData, [name]: value }

      const basePrice = parseFloat(updatedData.price) || 0
      const weight = parseFloat(updatedData.weight) || 0
      const count = parseFloat(updatedData.count) || 0

      // Calculate totalPrice based on unit (kg or son)
      updatedData.totalPrice =
        updatedData.unit === 'kg' ? basePrice * weight : basePrice * count

      return updatedData
    })
  }

  return (
    <Section>
      <form
        onSubmit={handleFormSubmit}
        className='flex flex-col space-y-4 w-full mx-auto mt-14 md:w-[500px]'
      >
        <h1 className='text-4xl text-center'>Янги Tavar</h1>
        <label htmlFor='name' className='sr-only'>
          Nomi
        </label>
        <input
          id='name'
          type='text'
          name='name'
          className='border border-gray-300 rounded-md p-2 w-full'
          onChange={handleInputChange}
          placeholder='Nomi'
          required
        />
        <div className='flex w-full gap-2'>
          <label htmlFor='weight' className='sr-only'>
            kg
          </label>
          <input
            id='weight'
            type='number'
            name='weight'
            className='border border-gray-300 rounded-md p-2 w-1/3'
            onChange={handleInputChange}
            required
            placeholder='kg'
          />
          <select
            name='unit'
            value={goodsData.unit}
            onChange={handleInputChange}
            className='border border-gray-300 rounded-md p-2 w-1/3'
          >
            <option value='kg'>kg</option>
            <option value='son'>son</option>
          </select>
          <label htmlFor='price' className='sr-only'>
            Narxi
          </label>
          <input
            id='price'
            type='number'
            name='price'
            className='border border-gray-300 rounded-md p-2 w-1/3'
            onChange={handleInputChange}
            placeholder='Narxi'
            required
          />
        </div>
        <label htmlFor='count' className='sr-only'>
          Soni
        </label>
        <input
          id='count'
          type='number'
          name='count'
          className='border border-gray-300 rounded-md p-2 w-full'
          onChange={handleInputChange}
          placeholder='soni'
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
