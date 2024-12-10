import React, { useState } from 'react'
import Axios from '../../Axios'
import { Section } from '../../Components/Section/Section'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const AddNewAdmin = () => {
  const [error, setError] = useState('')
  const [adminData, setAdminData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    phoneNumber: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword)
  }

  const handleFormSubmit = async e => {
    e.preventDefault()
    try {
      if (adminData) {
        const { data } = await Axios.post('/admin/create', adminData)
        navigate('/admins')
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Хатолик юз берди')
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setAdminData(prevData => ({ ...prevData, [name]: value }))
  }

  return (
    <Section>
      <form
        onSubmit={handleFormSubmit}
        className='flex flex-col space-y-4 w-full mx-auto mt-14 md:w-[500px]'
      >
        <h1 className='text-4xl text-center'>Янги Админ</h1>
        <label htmlFor='firstName' className='sr-only'>
          Исм
        </label>
        <input
          id='firstName'
          type='text'
          name='firstName'
          className='border border-gray-300 rounded-md p-2 w-full'
          onChange={handleInputChange}
          placeholder='Исм'
          required
        />
        <label htmlFor='lastName' className='sr-only'>
          Фамилия
        </label>
        <input
          id='lastName'
          type='text'
          name='lastName'
          className='border border-gray-300 rounded-md p-2 w-full'
          onChange={handleInputChange}
          placeholder='Фамилия'
          required
        />
        <label htmlFor='phoneNumber' className='sr-only'>
          Телефон рақам
        </label>
        <input
          id='phoneNumber'
          type='text'
          name='phoneNumber'
          className='border border-gray-300 rounded-md p-2 w-full'
          onChange={handleInputChange}
          placeholder='Телефон рақам'
          required
        />

        <label htmlFor='password' className='sr-only'>
          Парол
        </label>
        <div className='relative w-full'>
          <input
            id='password'
            type={showPassword ? 'text' : 'password'}
            name='password'
            className='border border-gray-300 rounded-md p-2 w-full'
            onChange={handleInputChange}
            placeholder='Парол'
            required
          />
          <span
            className='absolute right-3 top-3 cursor-pointer'
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </span>
        </div>

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
