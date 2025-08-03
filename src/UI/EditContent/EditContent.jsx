import { Fragment, useState, useEffect, useMemo } from "react";
import { MdDelete } from "react-icons/md";
import { IoCloudUpload } from "react-icons/io5";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Outer, ContentForm, Navbar } from "../../components";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const EditContent = () => {
  const { id, type } = useParams();  // Content ID from the URL params

  // console.log(id, type);
  
  // State for the form data
  const [contentData, setContentData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [genreList, setGenreList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [ageList, setAgeList] = useState([]);
  const [season, setSeason] = useState(null);
  const [sno, setSNO] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const season_id = queryParams.get('sid');
  const s_no = queryParams.get('no');

  // console.log(season_id, s_no);

  useEffect(() => {
    if (season_id !== season) setSeason(season_id);
    if (s_no !== sno) setSNO(s_no);
  }, [season_id, s_no, season, sno, navigate, location]);

  useEffect(() => {
    let isMounted = true;  // Prevent memory leak
    const controller = new AbortController();

    const fetchData = async () => {
      const endpoints = [
        axiosPrivate.get("/api/v1/admin/genres", { signal: controller.signal }),
        axiosPrivate.get("/api/v1/admin/categories", { signal: controller.signal }),
        axiosPrivate.get("/api/v1/admin/age", { signal: controller.signal }),
      ];

      const results = await Promise.allSettled(endpoints);

      // Check if the component is still mounted before updating the state
      if (isMounted) {
        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
                const data = result.value.data?.data || [];
                switch (index) {
                    case 0:
                        setGenreList(data);
                        break;
                    case 1:
                        setCategoryList(data);
                        break;
                    case 2:
                        setAgeList(data);
                        break;
                    default:
                        break;
                }
          } else {
            console.error(`Request ${index + 1} failed:`, result.reason);
            setError("Some data failed to load.");
          }
        });
        setLoading(false);  // Set loading to false after requests complete
      }
    };

    fetchData();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      controller.abort();  // Cancel ongoing requests on unmount
    };
  }, [navigate, location]);

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        if (type.toString() === "1") {
          const response = await axiosPrivate.get(`/api/v1/admin/web-series/${id}`); // Replace with your API
          setContentData(response.data?.data);  // Set the fetched content data
          // console.log(response.data?.data);
        }

        else if (type.toString() === "2") {
          const response = await axiosPrivate.get(`/api/v1/admin/movies/${id}`); // Replace with your API
          setContentData(response.data?.data);  // Set the fetched content data
          // console.log(response.data?.data);
        }

        else if (type.toString() === "3") {
          const response = await axiosPrivate.get(`/api/v1/admin/episodes/${id}`); // Replace with your API
          setContentData(response.data?.data);  // Set the fetched content data
          // console.log(response.data?.data);
        }

        else {
          throw new Error("Failed to get episodes. Try again...")
        }
      } catch (err) {
        console.log(err);
        setError("Failed to load content.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchContentData();
  }, [id, navigate, location]);

  // On successful submit, redirect back to content details or content list
  const handleSubmit = async (updatedData) => {
        // Log the updatedData
        // console.log(JSON.stringify(updatedData, null, 2));

        // Check if the category exists
        if (!updatedData?.category && !updatedData?.id) {
            setError("Category is required.");
            return; // Prevent further execution
        }

        // // Check category values and show appropriate messages
        else if (updatedData?.category.toString() === "1") {
            // console.log("Uploading category...");
            setLoading(true);

            const response = await axiosPrivate.put(`/api/v1/admin/web-series/${updatedData?.id}`, {
                title: updatedData?.title,
                title_image: updatedData?.title_image,
                poster_image: updatedData?.poster_image,
                backdrop_image: updatedData?.backdrop_image,
                description: updatedData?.description,
                created_at: updatedData?.created_at,
                average_rating: updatedData?.average_rating,
                watch_age_id: updatedData?.watch_age,
                category_id: updatedData?.category,
                genre_ids: updatedData?.genre
            });

            // console.log(response.data);

            if (response.data?.isSuccess && response.data?.data) {
                navigate("/webseries");
            } else {
              setError(response.data?.message || "web-series updation failed");
            }
        }

        else if (updatedData?.category.toString() === "2") {
            // console.log("Uploading movie...");
            setLoading(true);

            const response = await axiosPrivate.put(`/api/v1/admin/movies/${updatedData?.id}`, {
                title: updatedData?.title,
                title_image: updatedData?.title_image,
                poster_image: updatedData?.poster_image,
                backdrop_image: updatedData?.backdrop_image,
                description: updatedData?.description,
                created_at: updatedData?.created_at,
                average_rating: updatedData?.average_rating,
                watch_age_id: updatedData?.watch_age,
                category_id: updatedData?.category,
                genre_ids: updatedData?.genre,
                part_number: updatedData?.part_number
            });

            // console.log(response.data);

            if (response.data?.isSuccess && response.data?.data) {
                navigate("/movies");
            } else {
              setError(response.data?.message || "Movies updation failed");
            }
        }

        else if (updatedData?.category.toString() === "3") {
            // console.log("Uploading episode...");
            setLoading(true);

            const response = await axiosPrivate.put(`/api/v1/admin/episodes/${updatedData?.id}`, {
                title: updatedData?.title,
                title_image: updatedData?.title_image,
                poster_image: updatedData?.poster_image,
                backdrop_image: updatedData?.backdrop_image,
                description: updatedData?.description,
                created_at: updatedData?.created_at,
                average_rating: updatedData?.average_rating,
                watch_age_id: updatedData?.watch_age,
                category_id: updatedData?.category,
                genre_ids: updatedData?.genre,
                season_id: updatedData?.season_id,
                episode_number: updatedData?.episode_number
            });

            // console.log(response.data);

            if (response.data?.isSuccess && response.data?.data) {
                navigate(`/episodes?season=${updatedData?.season_id}`);
            } else {
              setError(response.data?.message || "Episode updation failed");
            }
        }

        else {
            setError("Invalid category.");
            return;
        }

        // Clear any previous error message if everything is okay
        setError(""); // Clear the error message if validation passed
  };

  return (
    <Fragment>
      <Outer>
        <Navbar />

          <div className="col-span-full flex flex-col items-center justify-start pt-24 px-4 w-full">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800 tracking-wide">
              Edit Content
            </h1>

            {error && (
              <div className="mb-4 px-4 py-2 text-red-600 bg-red-100 border border-red-200 rounded w-full max-w-4xl">
                {error}
              </div>
            )}

            {loading ? (
              <div className="relative z-10 flex justify-center items-center h-50 pt-10">
                <div className="animate-spin h-12 w-12 border-4 border-blue-800 rounded-full border-t-transparent"></div>
              </div>
            ) : contentData && (
              <ContentForm
                genreList={genreList}
                ageList={ageList}
                category={categoryList}
                season_id={contentData?.season_id}
                season_number={sno}
                onSubmit={handleSubmit}
                initialValues={contentData}
              />
            )}
          </div>
      </Outer>
    </Fragment>
  );
};

export default EditContent;
