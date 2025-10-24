import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../assets/assets';
import Loading from '../components/Loading';
import Tital from '../components/admin/Tital';
import { dateFormat } from '../lib/dateFormat';

const ListShows = () => {

    const currency = import.meta.env.VITE_CURRENCY;

    const [show, setShow] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAllShow = async() => {
        try {
            setShow([{
                movie: dummyShowsData[0],
                showDateTime: '2025-06-30T02:30:00.0002',
                showPrice: 59,
                occupiedSeats: {
                    A1: "user_1",
                    B1: "user_2",
                    C1: "user_3"
                }
            }])
            setLoading(false)
        } catch (error) {
            console.log(error)
        }


    }

    useEffect(() => {
        getAllShow();
    },[])

  return !loading ?(
  <>
    <Tital text1="List" text2="Shows" />
    <div className='max-w-4xl mt-6 overflow-x-hidden'></div>
    <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
        <thead>
            <tr className='bg-[#FD5965]/20 text-left text-white'>
                <th className='p-2 font-medium pl-5'>Movie Name</th>
                <th className='p-2 font-medium '>Show Time</th>
                <th className='p-2 font-medium '>Total Booking</th>
                <th className='p-2 font-medium '>Earnings</th>
            </tr>
        </thead>
        <tbody className='text-sm font-light'>
            {show.map((show, index) => (
                <tr key={index} className='border-b border-[#FD5965]/10 bg-[#FD5965]/5 even:bg-[#FD5965]/10'>
                    <td className='p2 min-w-48 pl-5'>{show.movie.title}</td>
                    <td className='p2'>{dateFormat( show.showDateTime)}</td>
                    <td className='p-2'>{Object.keys(show.occupiedSeats).length}</td>
                    <td className='p-2'>{currency} {Object.keys(show.occupiedSeats).length * show.showPrice}</td>
                </tr>
            ))}
        </tbody>
    </table>
  </>
  ) : (
    <Loading />
  )
}

export default ListShows