import { Fragment, useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { IoCloudUpload } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_IMG_URL;

const ContentForm = ({
  genreList = [],
  ageList = [],
  category = [],
  season_id = "",
  season_number = "",
  onSubmit,
  initialValues = []
}) => {
  const navigate = useNavigate();

  const [isUploading, setIsUploading] = useState({
    title_image: false,
    poster_image: false,
    backdrop_image: false
  });

  const [uploadedStatus, setUploadedStatus] = useState({
    title_image: false,
    poster_image: false,
    backdrop_image: false,
  });

  // console.log(initialValues);

  const [formData, setFormData] = useState({
    category: initialValues?.category_id || "",
    title: initialValues?.title || "",
    title_image: initialValues?.title_image || null,
    poster_image: initialValues?.poster_image || null,
    backdrop_image: initialValues?.backdrop_image || null,
    description: initialValues?.description || "",
    created_at: initialValues?.created_at || "",
    average_rating: initialValues?.average_rating || "",
    genre: initialValues?.genres ? initialValues.genres.map(String) : [],
    watch_age: initialValues?.watch_age || "",
    part_number: initialValues?.part_number || "", // Part number for Movies
    season_id: season_id,
    season_number: season_number, // Season number for Episodes
    episode_number: initialValues?.episode_number || "", // Episode number for Episodes
  });

  const [isAllImagesUploaded, setIsAllImagesUploaded] = useState(false);

  const IMAGE_KEYS = ["title_image", "poster_image", "backdrop_image"];

  const [previews, setPreviews] = useState({});
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    // console.log(formData.category == 3);
    // console.log(!formData.season_id || !formData.season_number);
    // console.log(formData.category == 3 && (!formData.season_id || !formData.season_number));
    // Redirect to /season if category is 'episode' and season_id or season_number is null
    if (formData.category == 3 && (!formData.season_id || !formData.season_number)) {
      navigate("/webseries");
    }
  }, [formData.category, formData.season_id, formData.season_number, navigate]);

  useEffect(() => {
    if (season_id && season_number) {
      setFormData((prev) => ({ ...prev, category: 3 })); // Set category to 3 (Episodes)
    }
  }, [season_id, season_number]);

  useEffect(() => {
    IMAGE_KEYS.forEach((key) => {
      const val = initialValues?.[key];
      if (val && typeof val === "string" && !val.startsWith("blob:")) {
        setPreviews((prev) => ({ ...prev, [key]: `${BASE_URL}/${val}` }));
        setUploadedStatus((prev) => ({ ...prev, [key]: true }));
      }
    });
  }, [initialValues]);

  useEffect(() => {
    setIsAllImagesUploaded(formData.title_image && formData.poster_image && formData.backdrop_image); 
  }, [formData.title_image, formData.poster_image, formData.backdrop_image]);

  const handleChange = (e) => {
    const { name, value, multiple, options } = e.target;

    if (multiple) {
      const values = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const file = files[0];
      if (file.size > 1024 * 1024) {
        alert("Image size exceeds 1MB. Please upload an image smaller than 1MB.");
        return; // Stop the function if the file is too large
      }
      const previewURL = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreviews((prev) => ({ ...prev, [name]: previewURL }));
      setUploadedStatus((prev) => ({
        ...prev,
        [name]: false, // Reset uploaded status when a new file is selected
      }));
    }
  };

  const removeImage = (name) => {
    setFormData((prev) => ({ ...prev, [name]: null }));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[name]);
      const newPreview = { ...prev };
      delete newPreview[name];
      return newPreview;
    });
    setUploadedStatus((prev) => ({
      ...prev,
      [name]: false, // Reset uploaded status when image is removed
    }));
  };

  // const isAllImagesUploaded =
    // formData.title_image && formData.poster_image && formData.backdrop_image;

  const uploadImage = async (imageKey) => {
    const imageFile = formData[imageKey];
    if (!imageFile) return;

    setIsAllImagesUploaded(false);

    // Start the upload
    setIsUploading((prev) => ({ ...prev, [imageKey]: true }));

    const formDataToSend = new FormData();
    formDataToSend.append("fileToUpload", imageFile);

    try {
      const response = await axios.post(
        "https://yenumax.com/api/uploadImage.php",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("Upload Success:", response.data);

      if (response.data?.isSuccess) {
        setFormData((prev) => ({
          ...prev,
          [imageKey]: response.data?.image,  // Replace with actual image URL
        }));
        setUploadedStatus((prev) => ({
          ...prev,
          [imageKey]: true, // Set to true on successful upload
        }));
      } else {
        throw new Error(response.data?.errorMsg);
      }
    } catch (error) {
      console.log("Upload Failed:", error);
      alert(error.response?.data?.message);
      setUploadedStatus((prev) => ({
        ...prev,
        [imageKey]: false, // Ensure false if upload fails
      }));
    } finally {
      // End the upload process
      setIsUploading((prev) => ({ ...prev, [imageKey]: false }));
      checkIfAllImagesUploaded();
    }
  };

  const checkIfAllImagesUploaded = () => {
    const allUploaded =
      formData.title_image && formData.poster_image && formData.backdrop_image;
    setIsAllImagesUploaded(allUploaded);
  };

  // console.log(formData);

  const renderImageUploader = (name, label) => (
    <div className="mb-4">
      <label className="block font-semibold text-gray-700 mb-2">{label}</label>
      {isUploading[name] ? (
        // Show spinner if uploading
        <div className="relative w-40 h-40 mb-2">
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-gray-800 rounded">
            <div className="animate-spin rounded-full border-t-4 border-blue-500 w-10 h-10"></div>
          </div>
        </div>
      ) : previews[name] ? (
        <div className="relative w-40 h-40 mb-2 group">
          <img
            src={previews[name]}
            alt="Preview"
            className="w-full h-full object-cover rounded shadow"
          />
          <button
            type="button"
            onClick={() => uploadImage(name)}
            className={`absolute -top-2 -left-2 ${
              uploadedStatus[name] ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:scale-110'
            } text-white py-1 pe-2 cursor-pointer rounded-full transition duration-200 flex items-center gap-1`}
            title={uploadedStatus[name] ? "Image Uploaded" : "Upload Image"}
            disabled={uploadedStatus[name]} // Disable button if already uploaded
          >
            <IoCloudUpload size={18} className="group-hover:scale-125 transition-transform duration-200" />
            <span className="text-xs hidden sm:inline">
              {uploadedStatus[name] ? "Uploaded" : "Upload"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => removeImage(name)}
            className="absolute -top-2 -right-2 bg-red-600 text-white py-1 pe-2 cursor-pointer rounded-full hover:bg-red-700 hover:scale-110 transition duration-200"
            title="Delete"
          >
            <MdDelete size={18} className="group-hover:scale-125 transition-transform duration-200" />
          </button>
        </div>
      ) : (
        <input
          type="file"
          accept="image/*"
          name={name}
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:rounded file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
        />
      )}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(formData);

    // Check for images before submission
    if (!isAllImagesUploaded) {
      alert("Please upload all images first");
      return;
    }

    // Check for required fields based on category
    if (!formData.category || !formData.title || !formData.description || !formData.created_at || !formData.average_rating || !formData.watch_age) {
      alert("Please fill in all required content fields");
      return;
    }

    // Additional checks for Movies (Category 2)
    if (formData.category == 2 && !formData.part_number) {
      alert("Please enter the part number for the movie");
      return;
    }

    // Additional checks for Episodes (Category 3)
    if (formData.category == 3) {
      if (!formData.episode_number) {
        alert("Please enter the episode number for the episode");
        return;
      }
      if (!formData.season_number || !formData.season_id) {
        alert("Please fill in all the required fields for the episode (Season Number and Season ID)");
        return;
      }
    }

    let cleanTitle = formData.title.replace(/\\'/g, "'");
    let cleanDescription = formData.description.replace(/\\'/g, "'");

    const escapedTitle = cleanTitle.replace(/'/g, "\\'");
    const escapedDescription = cleanDescription.replace(/'/g, "\\'");

    // const escapedTitle = formData.title.replace(/'/g, "\\'");
    // const escapedDescription = formData.description.replace(/'/g, "\\'");

    // console.log(escapedDescription);

    formData.title = escapedTitle;
    formData.description = escapedDescription;
    formData.genre = formData.genre.map(Number);
    formData.id = initialValues?.id || "";

    // If all checks pass, call onSubmit
    onSubmit(formData);
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit} className="space-y-6 p-6 max-w-3xl bg-white shadow rounded mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
            >
              <option value="">Select category</option>
              {category && category.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Conditional Fields */}
          {formData.category && (
            <>
              {/* Conditional Fields for Movies */}
              {formData.category == 2 && (
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Part Number</label>
                  <input
                    type="number"
                    name="part_number"
                    value={formData.part_number}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
                  />
                </div>
              )}

              {/* Conditional Fields for Episodes */}
              {formData.category == 3 && (
                <>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Season Number</label>
                    <input
                      type="number"
                      name="season_number"
                      value={formData.season_number}
                      onChange={handleChange}
                      className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Episode Number</label>
                    <input
                      type="number"
                      name="episode_number"
                      value={formData.episode_number}
                      onChange={handleChange}
                      className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Common Fields */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
              required
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Year (Created At)</label>
            <input
              type="number"
              name="created_at"
              value={formData.created_at}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Average Rating</label>
            <input
              type="number"
              step="0.1"
              max="5"
              name="average_rating"
              value={formData.average_rating}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Watch Age</label>
            <select
              name="watch_age"
              value={formData.watch_age}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
            >
              <option value="">Select age</option>
              {ageList && ageList.map((age) => (
                <option key={age.id} value={age.id}>{age.age}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Genre</label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              multiple
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring"
            >
              {genreList && genreList.map((genre) => (
                <option key={genre.id} className="p-2 hover:bg-gray-100" value={String(genre.id)}>
                  {genre.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {renderImageUploader("title_image", "Title Image")}
          {renderImageUploader("poster_image", "Poster Image")}
          {renderImageUploader("backdrop_image", "Backdrop Image")}
        </div>

        <button
          type="submit"
          disabled={!isAllImagesUploaded}
          className={`w-full py-3 text-white cursor-pointer font-semibold rounded transition duration-200 ${
            isAllImagesUploaded ? "bg-black hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          { initialValues ? "Update" : "Submit" }
        </button>
      </form>
    </Fragment>
  );
};

export default ContentForm;