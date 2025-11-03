import React from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'

const Favorite = () => {
      const { favoriteMovies} = useAppContext();
  
  return favoriteMovies.length > 0 ?(
    <div className='relative mx-auto my-40 mb-60 px-6 md:px-16 lg:px-20  xl:px-20 overflow-hidden min-h-[80vh]'>
      <BlurCircle top='10px' left='0px' />
      <BlurCircle bottom='150px' right='0px' />
      <h1 className='text-lg font-medium max-sm:justify-center gap-8 mt-2 mb-4'>your Favorite Movies</h1>
      <div className='flex  flex-wrap max-sm:justify-center gap-8'>
        {favoriteMovies.map((show) => {
          // dummyShowsData contains movie/show objects
          return <MovieCard movie={show} key={show._id} />
        })}
      </div>
    </div>
  ) : (
  <div className='flex flex-col items-center justify-center h-screen'>
    <h1 className='text-3xl font-bold text-center'>No movies available</h1>
    
  </div>
)
}

export default Favorite