import React, { useState } from 'react';
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import DateSelector from '../../components/input/DateSelector';
import ImageSelector from '../../components/input/ImageSelector';
import TagInput from '../../components/input/TagInput';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import { toast } from 'react-toastify';
import uploadImage from '../../utils/uploadImage';

const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getAllTravelStories
}) => {
    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);
    const [title, setTitle] = useState(storyInfo?.title || "");
    const [story, setStory] = useState(storyInfo?.story || "");
    const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
    const [error, setError] = useState("");

    const updateTravelStory = async () => {
        const storyId = storyInfo._id;
        
        try {
            let imageUrl = "";
            let postData = {
                title,
                story,
                imageUrl: imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
            };

            if(typeof storyImg === "object") {
                const imageUploadRes = await uploadImage(storyImg);
                imageUrl = imageUploadRes.imageUrl || "";

                postData = {
                    ...postData,
                    imageUrl: imageUrl
                };
            }

            const response = await axiosInstance.put("/edit-story/" + storyId, postData);

            if (response.data && response.data.story) {
                toast.success("Story Updated Successfully");
                getAllTravelStories();
                onClose();
            }
        } catch (err) {
            console.error("Error adding story:", err);
            toast.error("Error adding story: " + err.message);
        }
    }
    const addNewTravelStory = async () => {
        try {
            let imageUrl = "";

            if (storyImg) {
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || "";
            }

            const response = await axiosInstance.post("/add-travel-story", {
                title,
                story,
                imageUrl: imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
            });

            if (response.data && response.data.story) {
                toast.success("Story Added Successfully");
                getAllTravelStories();
                onClose();
            }
        } catch (err) {
            console.error("Error adding story:", err);
            toast.error("Error adding story: " + err.message);
        }
    };

    const handleAddOrUpdateClick = () => {
        if (!title) {
            setError("Please enter story title");
            return;
        }
        if (!story) {
            setError("Please enter story description");
            return;
        }
        if (type == "edit") {
            updateTravelStory();
        }
        else {
            addNewTravelStory();
        }
    }
    const handleDeleteStoryImg = async () => {
        const deleteImgRes = await axiosInstance.delete("/delete-image", {
            params: {
                imageUrl: storyInfo.imageUrl
            },
        });
        if(deleteImgRes.data) {
            const storyId = storyInfo._id;
            let postData = {
                title,
                story,
                imageUrl: "",
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
            };
            const response = await axiosInstance.put("/edit-story/" + storyId, postData);
            setStoryImg(null);
        }
    }

    return (
        <div className='relative'>
            <div className='flex items-center justify-between'>
                <h5 className='text-xl font-semibold text-slate-700'>
                    {type === "add" ? "Add Story" : "Update Story"}
                </h5>
                <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                    {type === "add" ? (
                        <button className='btn-small' onClick={handleAddOrUpdateClick}>
                            <MdAdd className='text-lg' /> ADD STORY
                        </button>
                    ) : (
                        <>
                            <button className='btn-small' onClick={handleAddOrUpdateClick}>
                                <MdUpdate className='text-lg' /> UPDATE STORY
                            </button>
                        </>
                    )}
                    <button onClick={onClose}>
                        <MdClose className='text-xl text-slate-400' />
                    </button>
                    {error && <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>}
                </div>
            </div>
            <div className='flex flex-col gap-2 pt-4'>
                <label className='input-label'>TITLE</label>
                <input
                    type="text"
                    className='text-2xl text-slate-950 outline-none'
                    placeholder='A Trip to Manali'
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div className='my-3'>
                <DateSelector date={visitedDate} setDate={setVisitedDate} />
            </div>
            <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteStoryImg} />
            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>STORY</label>
                <textarea
                    className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded h-[230px]'
                    placeholder='Your Story'
                    value={story}
                    onChange={({ target }) => setStory(target.value)}
                />
            </div>
            <div>
                <label className='input-label'>VISITED LOCATIONS</label>
                <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
            </div>
        </div>
    );
};

export default AddEditTravelStory;
