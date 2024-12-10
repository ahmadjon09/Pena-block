import React from 'react'
import { Link } from 'react-router-dom'

export const Error = () => {
  return (
    <section className='h-screen'>
      <div className='container h-full flex items-center justify-center flex-col gap-5'>
        <h1 className='text-8xl font-bold'>
          <span className='text-blue-700'>4</span>0
          <span className='text-blue-700'>4</span>
        </h1>
        <p className='font-bold text-xl'>
          Bu sahifa uchun qo‘shimcha moliyaviy yordam zarur! 😊
        </p>
        <div className='flex gap-5'>
          <Link
            to={'/'}
            className='bg-blue-700 py-2 px-5 font-bold text-white rounded-3xl'
          >
            Ortga qaytish
          </Link>
          <a
            href='https://t.me/MoliyaviyYordamBot'
            className='bg-green-700 py-2 px-5 font-bold text-white rounded-3xl'
          >
            Moliyaviy Yordam
          </a>
        </div>
      </div>
    </section>
  )
}
