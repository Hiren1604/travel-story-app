import React, { useState } from 'react';
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md"
import DateSelector from '../../components/input/DateSelector';

const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getAllTravelStories
}) => {
    const [visitedDate, setVisitedDate] = useState(null);
    const [title, setTitle] = useState("");
    const [story, setStory] = useState("");
    const [storyImg, setStoryImg] = useState(null);
    const [visitedLocation, setVisitedLocation] = useState([]);
    const handleAddOrUpdateClick = () => { }
    return (
        <div>
            <div className='flex items-center justify-between'>
                <h5 className='text-xl font-semibold text-slate-700'>
                    {type === "add" ? "Add Story" : "Update Story"}
                </h5>
                <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                    {type === "add" ? (<button className='btn-small' onClick={handleAddOrUpdateClick}><MdAdd className='text-lg' />ADD STORY</button>) :
                        (<><button className='btn-small' onClick={() => { }}><MdUpdate className='text-lg' />UPDATE STORY</button><button className='btn-small btn-delete' onClick={handleAddOrUpdateClick}><MdDeleteOutline className='text-lg' />DELETE STORY</button></>)}

                    <button className='' onClick={onClose}><MdClose className='text-xl text-slate-400' /></button>
                </div>
            </div>
            <div className='flex flex-col gap-2 pt-4'>
                <label className='input-label'>TITLE</label>
                <input type="text" className='text-2xl text-slate-950 outline-none' placeholder='A Trip to Manali' onChange={({target})=> {setTitle(target.value)}}/>
            </div>
            <div className='my-3'>
               <DateSelector date={visitedDate} setDate={setVisitedDate}/>
            </div>
            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>STORY</label>
                <textarea className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded' placeholder='Your Story' value={story} onChange={({target})=>{setStory(target.value)}} type="text"></textarea>
            </div>
        </div>
    )
}

export default AddEditTravelStory
