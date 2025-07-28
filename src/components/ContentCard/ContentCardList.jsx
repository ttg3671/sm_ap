import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { FaStar } from "react-icons/fa"; // For rating star icon
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { useDispatch, useSelector } from 'react-redux';
import { incrementPosition } from '../../redux/position/position.actions';

const BASE_URL = import.meta.env.VITE_IMG_URL;

const ContentCardList = ({ type = "", contentList = {}, tagList = [], season = "", handleDelete }) => {
  const navigate = useNavigate(); // Hook to handle navigation
  const axiosPrivate = useAxiosPrivate();

  const dispatch = useDispatch();
  const position = useSelector(state => state.position.value);

  // console.log(contentList);

  // Initializing the selected tags state for the current contentList
  const prevList = contentList?.content_tags
    ? contentList.content_tags.split(",") // Convert comma-separated string to an array
    : [];

  const [selectedTags, setSelectedTags] = useState(prevList); // Store selected tags for the current card

  const [selectedContent, setSelectedContent] = useState(contentList?.id); // Track the selected content's ID and type
  const [cat, setCat] = useState(contentList?.category_id);

  // Helper function to format rating color based on value
  const getRatingColor = (rating) => {
    if (rating >= 4) return "bg-green-500"; // Good rating
    if (rating >= 2) return "bg-yellow-500"; // Average rating
    return "bg-red-500"; // Poor rating
  };

  // Handle Tag Selection
  const handleTagChange = (e) => {
    const selectedTagIDs = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedTags(selectedTagIDs); // Update the selected tags for this content
  };

  // Handle Add to Trending
  const handleAddToTrending = async () => {
    if (!selectedTags.length) {
      alert("No tags selected!");
      return;
    }

    try {
      const { id } = contentList;
      // console.log(id, selectedTags);

      // Send request to add content to trending
      const response = await axiosPrivate.put(`/api/v1/admin/trailer-to-content-type/${id}`, {
        content_id: selectedTags,
        type: cat
      });

      if (response.data?.isSuccess) {
        alert("Content added to trending successfully!");
      } else {
        alert("Failed to add content to trending.");
      }
    } catch (error) {
      console.error("Error adding to trending:", error);
      alert("Error adding to trending. Please try again.");
    }
  };

  const addToSlider = async (id) => {
    // console.log("Adding to slider:", { 
    //   id, 
    //   category_id: contentList?.category_id, 
    //   position 
    // });

    try{
      const response = await axiosPrivate.post("/api/v1/admin/slider", {
        video_id: id,
        position, 
        type: contentList?.category_id
      });

      // console.log(id, position, contentList?.category_id);

      if (response.data?.isSuccess) {
        alert("Content added to slider successfully!");
        contentList.isSlider = response.data?.data;
      } else {
        alert("Failed to add content to slider.");
      }

      // Do something with `id`, `type`, and `position`

      dispatch(incrementPosition()); // Increment for the next call
    }
    catch(error) {
      console.error("Error adding to slider:", error);
      alert(error.response?.data?.message);
    }
  };

  const buttonDelete = async (e) => {
    // console.log(contentList?.id, contentList?.category_id);
    handleDelete(contentList?.id, contentList?.category_id);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6 p-6">
      <div
        key={contentList?.id}
        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col"
      >
        {/* Image */}
        {contentList?.poster_image && (
          <img
            src={
              typeof contentList?.poster_image === "string"
                ? `${BASE_URL}${contentList?.poster_image}` // Add BASE_URL in front of image path
                : URL.createObjectURL(contentList?.poster_image)
            }
            alt={contentList?.title}
            className="w-full h-48 object-cover transition-transform duration-500 ease-in-out hover:scale-105"
            loading="lazy" // Enable lazy loading
          />
        )}

        {/* Content */}
        <div className="p-4 flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-gray-800 truncate" title={contentList?.title}>
            {contentList?.title}
          </h3>

          {/* Watch Age */}
          <p className="text-sm font-medium text-gray-600 flex items-center">
            <span className="text-xs bg-gray-300 text-gray-700 rounded-full px-2 py-1 mr-2">
              {contentList?.watch_age}
            </span>
            <span className="text-sm">Age Rating</span>
          </p>

          {/* Average Rating */}
          <div className="flex items-center gap-2 text-sm">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full ${getRatingColor(contentList?.average_rating)}`}
            >
              <FaStar size={14} className="mr-1 text-white" />
              <span className="text-white">{contentList?.average_rating}</span>
            </div>
            <span className="text-gray-500">/ 5</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-4">
            {/* Button to add Trailer */}
            <button
              type="button"
              className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => navigate(`/trailers/${contentList.id}/${contentList.category_id}`)}
            >
              View Trailer
            </button>

            {/* Button to add Video */}
            <button
              type="button"
              className="px-4 py-2 cursor-pointer bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              onClick={() => navigate(`/videos/${contentList.id}/${contentList.category_id}`)}
            >
              View Video
            </button>

            {/* Button to add Season */}
            {contentList?.category_id == 1 && (
              <button
                type="button"
                className="px-4 py-2 cursor-pointer bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                onClick={() => navigate(`/season/${contentList.id}`)}
              >
                Add Season
              </button>
            )}

            {contentList?.isSlider ? (
              <button
              type="button"
                className="px-4 py-2 cursor-not-allowed bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Added to Slider
              </button>
            ): (
              <button
              type="button"
                className="px-4 py-2 cursor-pointer bg-yellow-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                onClick={() => addToSlider(contentList?.id)}
              >
                Add to Slider
              </button>
            )}

            {/* Edit Button */}
            <button
              type="button"
              className="px-4 py-2 cursor-pointer bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              onClick={() => navigate(`/edit/${contentList.id}/${contentList.category_id}?sid=${season}&no=${contentList?.season_number}`)}
            >
              Edit
            </button>

            <button
              type="button"
              className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              onClick={buttonDelete}
            >
              Delete
            </button>
          </div>

          {/* Dropdown for selecting tags */}
          <div className="mt-4">
            <select
              id="tag"
              multiple
              value={selectedTags} // Get selected tags for the current card
              onChange={handleTagChange} // Handle tag change
              className="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {/* <option value="">Add to Trending</option> */}
              {tagList?.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add to Trending Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleAddToTrending}
              className="px-4 py-2 cursor-pointer bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
            >
              Add to Trending
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCardList;
