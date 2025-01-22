import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal"
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  });
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get('/get-all-travel-stories');
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (err) {
      console.log('An unexpected error occurred.', err);
    }
  };

  const handleEdit = (data) => {
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data
    });
  };

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data })
  };

  const updateIsFavorite = async (storyData) => {
    const storyId = storyData._id;
    const updatedStories = allStories.map((story) =>
      story._id === storyId
        ? { ...story, isFavorite: !story.isFavorite }
        : story
    );

    // Optimistically update the UI
    setAllStories(updatedStories);

    try {
      const response = await axiosInstance.put(`/update-fav/${storyId}`, {
        isFavorite: !storyData.isFavorite,
      });

      if (response.data && response.data.story) {
        toast.success("Story updated successfully");
      }
    } catch (err) {
      const revertedStories = updatedStories.map((story) =>
        story._id === storyId
          ? { ...story, isFavorite: !story.isFavorite }
          : story
      );
      setAllStories(revertedStories);
      console.error("An unexpected error occurred. Please try again.");
      toast.error("Failed to update the story. Please try again.");
    }
  };


  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto py-10 px-7">
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imgUrl={item.imageUrl}
                    date={item.visitedDate}
                    title={item.title}
                    story={item.story}
                    visitedLocation={item.visitedLocation}
                    isFavorite={item.isFavorite}
                    onEdit={() => handleEdit(item)}
                    onClick={() => handleViewStory(item)}
                    onFavoriteClick={() => updateIsFavorite(item)}
                  />
                ))}
              </div>
            ) : (
              <>Empty Card</>
            )}
          </div>
          <div className="w-[320px]"></div>
        </div>
      </div>
      <Modal isOpen={openAddEditModal.isShown} onRequestClose={() => { }} style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)", zIndex: 99 } }} appElement={document.getElementById("root")} className="model-box"><AddEditTravelStory type={openAddEditModal.type} storyInfo={openAddEditModal.data} onClose={() => { setOpenAddEditModal({ isShown: false, type: "add", data: null }) }} getAllTravelStories={getAllTravelStories} /></Modal>
      <Modal isOpen={openViewModal.isShown} onRequestClose={() => { }} style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)", zIndex: 99 } }} appElement={document.getElementById("root")} className="model-box"><ViewTravelStory storyInfo={openViewModal.data || null} onClose={() => {setOpenViewModal((prevState)=>({...prevState, isShown: false}))}} onEditClick={() => {setOpenViewModal((prevState)=>({...prevState, isShown: false})); handleEdit(openViewModal.data || null)}} onDeleteClick={() => { }} /></Modal>
      <button
        className="h-16 w-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10 font-bold text-[32px] text-white"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className='text-[32px] text-white' />
      </button>
      <ToastContainer />
    </>
  );
};

export default Home;
