import React from 'react'

const EmptyCard = ({imgSrc, message}) => {
  return (
    <div className='flex flex-col items-center justify-center mt-48'>
      <img src={imgSrc} alt="No Notes" className='w-24'/>
      <p className='w-1/2 text-md font-semibold text-slate-700 text-center leading-7 mt-5'>{message}</p>
    </div>
  )
}

export default EmptyCard