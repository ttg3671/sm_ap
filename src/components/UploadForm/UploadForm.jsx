import { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as tus from "tus-js-client";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const UploadForm = ({ id = "", type = "", onSubmit, initialData = null, onVideoRemoved }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [videoLink, setVideoLink] = useState(null); // This state will reflect the *currently displayed* video link
  const [errMsg, setErrMsg] = useState("");
  const [videoDuration, setVideoDuration] = useState(null);
  // Initialize isLoading based on whether initialData is present
  const [isLoading, setIsLoading] = useState(!!initialData);

  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const reset = () => {
    setVideoFile(null);
    setPreviewURL("");
    setProgress(0);
    setUploading(false);
    setUploaded(false);
    setVideoLink(null); // Ensure internal videoLink is reset
    setErrMsg("");
    setVideoDuration(null); // Reset duration as well
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      reset(); // Always reset state when a new file is chosen
      setVideoFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setUploaded(false); // A new file means it's not yet uploaded

      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";

      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        const durationInSeconds = Math.floor(videoElement.duration);
        setVideoDuration(durationInSeconds);
      };

      videoElement.src = URL.createObjectURL(file);
    }
  };

  const handleRemove = () => {
    if (previewURL.startsWith("blob:")) URL.revokeObjectURL(previewURL);
    reset(); // Reset all states to revert to file input

    // Notify parent that the video was removed (for backend deletion, etc.)
    if (onVideoRemoved) {
      onVideoRemoved(id, type);
    }
  };

  const uploadToVimeo = async () => {
    if (!videoFile) {
      setErrMsg("Please select a video file first.");
      return;
    }

    try {
      setUploading(true);
      setErrMsg("");

      const response = await axiosPrivate.post("/api/v1/admin/vimeo/upload-ticket", {
        fileSize: videoFile.size,
        fileName: videoFile.name,
      });

      const { uploadLink, videoUri, videoLink: newVideoLink } = response.data;

      const upload = new tus.Upload(videoFile, {
        uploadUrl: uploadLink,
        retryDelays: [0, 3000, 5000, 10000],
        metadata: {
          filename: videoFile.name,
          filetype: videoFile.type,
        },
        chunkSize: 5242880, // 5 MB
        onError: (error) => {
          console.error("Upload failed:", error);
          setErrMsg("Upload failed: " + error.message);
          setUploading(false);
          setUploaded(false); // Ensure uploaded is false on error
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = Math.floor((bytesUploaded / bytesTotal) * 100);
          setProgress(percentage);
        },
        onSuccess: () => {
          setUploaded(true);
          setVideoLink(newVideoLink); // Set the internal state to the uploaded video link
          setUploading(false);
          onSubmit(id, type, newVideoLink, videoDuration); // Notify parent of successful upload
        },
      });

      upload.start();
    } catch (error) {
      console.error("Error starting upload:", error);
      setErrMsg("Failed to start upload: " + error.message);
      setUploading(false);
      setUploaded(false); // Ensure uploaded is false on error
    }
  };

  const formatDuration = (seconds) => {
    if (seconds === null || isNaN(seconds)) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Effect to handle initialData coming from parent
  useEffect(() => {
    // console.log(initialData);
    // If initialData is provided, set the internal videoLink state and show loading.
    if (initialData && !initialData?.result) {
      setVideoLink(initialData);
      setUploaded(true); // Mark as uploaded if there's initial data
      setVideoFile(null); // No local file chosen if initial data exists
      setPreviewURL(""); // No local preview needed
      setProgress(0); // No upload in progress
      setUploading(false); // Not actively uploading
      setErrMsg(""); // Clear any previous errors
      setVideoDuration(null); // Clear duration for now, unless explicitly passed with initialData
      setIsLoading(true); // Set loading to true when initialData is present

      // Optional: Add an event listener to the video element to turn off loading when it can play
      const videoElement = document.createElement("video");
      videoElement.src = initialData;
      videoElement.oncanplay = () => {
        setIsLoading(false);
        // You might also want to get duration here if it's not available from your backend
        // setVideoDuration(videoElement.duration);
      };
      videoElement.onerror = () => {
        setIsLoading(false); // Turn off loading even on error
        setErrMsg("Failed to load video from initial URL.");
      };

    } else {
      // If initialData is cleared (null/undefined), reset all states and ensure not loading
      reset();
      setIsLoading(false);
    }
  }, [initialData]);

  return (
    <Fragment>
      <div className="mt-10">
        {errMsg && (
          <div className="mb-4 px-4 py-2 text-red-600 bg-red-100 border border-red-200 rounded max-w-xl">
            {errMsg}
          </div>
        )}

        {/* Show spinner only if initialData exists AND we are loading it */}
        {isLoading ? ( // Only show loading if there's a videoLink AND isLoading is true
          <div className="relative z-10 flex justify-center items-center h-50 pt-10">
            <div className="animate-spin h-12 w-12 border-4 border-blue-800 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Condition 1: Video is already linked (either initially or uploaded) AND no new local file selected */}
            {videoLink && !videoFile ? (
              <div className="max-w-xl flex flex-col gap-4">
                <video
                  src={videoLink} // Use videoLink from state
                  controls
                  className="w-full rounded shadow"
                />
                <div className="flex items-center gap-4">
                  <span className="text-green-600 font-medium">Uploaded</span>
                  <button
                    onClick={handleRemove}
                    className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded hover:bg-red-600 transition-transform duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              // Condition 2: No video linked yet OR a new local file has been selected
              <>
                {/* Show file picker if no videoLink AND no videoFile selected yet */}
                {!videoLink && !videoFile && (
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="block w-full max-w-xl text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:rounded file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 mb-6"
                  />
                )}

                {/* Show preview and upload controls if a local file is selected */}
                {videoFile && (
                  <div className="flex flex-col gap-4 max-w-xl">
                    <video
                      src={previewURL}
                      controls
                      className="w-full rounded shadow"
                    />

                    {uploading && (
                      <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
                        <div
                          className="h-4 bg-blue-600 rounded"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    )}

                    {videoDuration && (
                      <p className="text-sm text-gray-600 mt-2">
                        Duration: {formatDuration(videoDuration)}
                      </p>
                    )}

                    <div className="flex items-center gap-4">
                      {!uploaded ? (
                        <button
                          onClick={uploadToVimeo}
                          disabled={uploading}
                          className={`px-5 py-2 cursor-pointer rounded font-semibold text-white transition-transform duration-200 ${
                            uploading
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
                          }`}
                        >
                          {uploading ? "Uploading…" : "Upload"}
                        </button>
                      ) : (
                        <span className="text-green-600 font-medium">Uploaded</span>
                      )}

                      <button
                        onClick={handleRemove}
                        className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded hover:bg-red-600 transition-transform duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Fragment>
  );
};

export default UploadForm;