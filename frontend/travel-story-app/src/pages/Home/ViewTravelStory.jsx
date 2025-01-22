import React from 'react'
import { GrMapLocation } from 'react-icons/gr'
import { MdAdd, MdUpdate, MdDeleteOutline, MdClose } from 'react-icons/md'
import moment from "moment"
const ViewTravelStory = ({ storyInfo, onEditClick, onDeleteClick, onClose }) => {
    return (
        <div className=' outline-none'>
            <div className='flex items-center justify-end'>
                <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                    <button className='btn-small' onClick={onEditClick}>
                        <MdUpdate className='text-lg' /> UPDATE STORY
                    </button>
                    <button className='btn-small btn-delete' onClick={onDeleteClick}>
                        <MdDeleteOutline className='text-lg' /> DELETE STORY
                    </button>
                    <button onClick={onClose}>
                        <MdClose className='text-xl text-slate-400' />
                    </button>
                </div>
            </div>
            <div>
                <div className='flex-1 flex flex-col gap-2 py-3'>
                    <h1 className='text-2xl text-slate-950 font-semibold'>{storyInfo && storyInfo.title}</h1>
                </div>
                <div className='flex items-center justify-between gap-3'>
                    <span className='text-md text-slate-800 font-medium'>
                        {storyInfo && moment(storyInfo.visitedDate).format("Do MMM YYYY")}
                    </span>
                    <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1 font-medium'>
                        <GrMapLocation className='text-sm' />
                        {storyInfo && storyInfo.visitedLocation.map((item, index) => storyInfo.visitedLocation.length == index + 1 ? `${item}` : `${item}, `)}
                    </div>
                </div>
                <img src={storyInfo && storyInfo.imageUrl} alt="Selected" className='w-full h-[300px] object-cover rounded-lg mt-3' />
                <div className='mt-4'>
                   <p className='text-md text-slate-950 leading-6 text-justify whitespace-pre-line font-medium'>{storyInfo.story}</p>
                </div>
            </div>
        </div>
    )
}

export default ViewTravelStory
