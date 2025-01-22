import React from 'react';
import moment from 'moment'; 
import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";

const TravelStoryCard = ({
  imgUrl,
  date,
  title,
  story,
  visitedLocation,
  isFavorite,
  onFavoriteClick,
  onClick
}) => {
  return (
    <div className='border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer w-[95%]'>
      <img src={imgUrl} alt={title} className='w-full h-56 object-cover rounded-lg' onClick={onClick} />
      <button 
        className='w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4' 
        onClick={(e) => {
          e.stopPropagation(); 
          onFavoriteClick();
        }}
      >
        <FaHeart className={`icon-btn ${isFavorite ? "text-red-500" : "text-slate-200"}`} />
      </button>
      <div className='p-4' onClick={onClick}>
        <div className='flex items-center gap-3'>
          <div className='flex-1'>
            <h6 className='text-md font-bold'>{title}</h6>
            <span className='text-sm text-slate-700 font-semibold'>
              {date ? moment(date).format("Do MMMM YYYY") : "-"}
            </span>
          </div>
        </div>
        <p className='text-sm text-slate-900 mt-2'>{story?.slice(0, 60)}...</p>
        <div className='inline-flex items-center gap-2 text-[13px] bg-cyan-200/40 rounded mt-3 px-2 py-1 text-cyan-600 font-bold'>
          <GrMapLocation className='text-xs' />
          {visitedLocation.map((item, index) => (
            <span key={index}>
              {item}{index < visitedLocation.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;
