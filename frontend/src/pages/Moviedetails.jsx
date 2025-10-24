import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyShowsData, dummyDateTimeData } from '../assets/assets';
import BlurCircle from '../components/BlurCircle';
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormate';
import DateSelect from '../components/DateSelect';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';

const Moviedetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  const getShow = async () => {
    const show = dummyShowsData.find(show => show._id === id);
    if (show) {
      setMovie({ movie: show, dateTime: dummyDateTimeData });
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  // 🔍 Debug logs to check data
  console.log("Movie data:", movie);
  console.log("DateSelect data:", movie?.dateTime);

  return movie ? (
    <div className='px-6 md:px-16 lg:px-40 pt-32 md:pt-52'>
      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
        <img
          className='max-md:mx-auto rounded-xl h-96 object-cover'
          src={movie.movie.poster_path || movie.movie.backdrop_path || ''}
          alt={movie.movie.title || 'Movie poster'}
        />
        <div className='relative flex flex-col gap-3'>
          <BlurCircle top='-100px' left='-100px' />
          <p className='text-[#FD5965]'>{movie.movie.original_language || 'English'}</p>
          <h1 className='text-4xl font-semibold max-w-96 text-balance'>{movie.movie.title || 'Untitled'}</h1>
          <div className='flex items-center gap-2 text-gray-300'>
            <StarIcon className='w-5 h-5 text-[#FD5965] fill-[#FD5965]' />
            {typeof movie.movie.vote_average === 'number' ? movie.movie.vote_average.toFixed(1) : '—'} User Rating
          </div>
          <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>{movie.movie.overview || ''}</p>
          <p>
            {typeof movie.movie.runtime === 'number' ? timeFormat(movie.movie.runtime) : '—'}
            {' . '}
            {(Array.isArray(movie.movie.genres) && movie.movie.genres.length > 0)
              ? movie.movie.genres.map(genre => genre.name).join(', ')
              : 'Unknown'}
            {' . '}
            {movie.movie.release_date ? movie.movie.release_date.split('-')[0] : 'N/A'}
          </p>

          <div className='flex items-center flex-wrap gap-4 mt-4'>
            <button className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95'>
              <PlayCircleIcon className='w-5 h-5' />
              Watch Trailer
            </button>
            <a href="#dateSelect" className='px-10 py-3 text-sm bg-[#FD5965] rounded-md font-medium cursor-pointer'>Buy Tickets</a>
            <button className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95'>
              <Heart className='w-5 h-5' />
            </button>
          </div>
        </div>
      </div>

      <p className='mt-8 font-semibold'>Your Favorite Cast</p>
      <div className='overflow-x-auto no-scrollbar mt-4 pb-4'>
        <div className='flex gap-6'>
          {(Array.isArray(movie.movie.casts) ? movie.movie.casts : (Array.isArray(movie.movie.cast) ? movie.movie.cast : []))
            .slice(0, 12)
            .map((cast, index) => (
              <div key={index} className='flex flex-col items-center text-center min-w-[80px]'>
                <img
                  src={cast.profile_path || ''}
                  className='rounded-full h-20 md:h-20 aspect-square object-cover'
                  alt={cast.name || 'Cast member'}
                />
                <p className='text-sm mt-2'>{cast.name || 'Unknown'}</p>
              </div>
            ))}

          {(!Array.isArray(movie.movie.casts) && !Array.isArray(movie.movie.cast)) && (
            <p className='text-gray-400'>No cast information available.</p>
          )}
        </div>
      </div>

      {/* ✅ FIXED DateSelect */}
      <div id="dateSelect" className="mt-8">
        <DateSelect dateTime={movie.dateTime} id={id} />
      </div>

      <p className='text-lg font-medium mt-20 mb-8'>You may Also Like</p>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {dummyShowsData.slice(0, 4).map((item, index) => (
          <MovieCard key={index} movie={item} />
        ))}
      </div>

      <div className='flex justify-center mt-20'>
        <button
          onClick={() => { navigate('/movies'); scrollTo(0, 0); }}
          className='px-10 py-3 text-sm bg-[#FD5965] hover:bg-[#FD5965]-dull transition rounded-md font-medium cursor-pointer'
        >
          Show more
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Moviedetails;
