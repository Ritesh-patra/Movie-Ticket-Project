import React from 'react'

const Tital = ({text1, text2}) => {
  return (
    <h1 className='font-medium text-2xl'>
        {text1} <span className='underline text-[#FD5965]'>

        {text2}
        </span>
    </h1>
)
}

export default Tital