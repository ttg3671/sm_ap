import { Fragment, useState, useEffect, useMemo } from "react";
import { Outer, ContentForm, Navbar } from "../../components";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';

const Content = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    const [genreList, setGenreList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [ageList, setAgeList] = useState([]);
    const [season, setSeason] = useState(null);
    const [sno, setSNO] = useState(null);

    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const season_id = queryParams.get('id');
    const s_no = queryParams.get('no');

    useEffect(() => {
        if (season_id !== season) setSeason(season_id);
        if (s_no !== sno) setSNO(s_no);
    }, [season_id, s_no, season, sno]);

    // console.log(season, sno);

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
                        setErrMsg("Some data failed to load.");
                    }
                });
                setIsLoading(false);  // Set loading to false after requests complete
            }
        };

        fetchData();

        // Cleanup on unmount
        return () => {
            isMounted = false;
            controller.abort();  // Cancel ongoing requests on unmount
        };
    }, []);  // Empty dependency array to run only once on mount

    const handleSubmit = async (formData) => {
        // Log the formData
        // console.log(JSON.stringify(formData, null, 2));

        try {
            // Check if the category exists
            if (!formData?.category) {
                setErrMsg("Category is required.");
                return; // Prevent further execution
            }

            // Check category values and show appropriate messages
            else if (formData?.category.toString() === "1") {
                // console.log("Uploading category...");
                setIsLoading(true);

                const response = await axiosPrivate.post(`/api/v1/admin/web-series`, {
                    title: formData?.title,
                    title_image: formData?.title_image,
                    poster_image: formData?.poster_image,
                    backdrop_image: formData?.backdrop_image,
                    description: formData?.description,
                    created_at: formData?.created_at,
                    average_rating: formData?.average_rating,
                    watch_age_id: formData?.watch_age,
                    category_id: formData?.category,
                    genre_ids: formData?.genre
                });

                // console.log(response.data);

                if (response.data?.isSuccess && response.data?.data) {
                    navigate("/webseries");
                } else {
                    throw new Error(response.data?.message || "web-series creation failed");
                }
            }

            else if (formData?.category.toString() === "2") {
                // console.log("Uploading movie...");
                setIsLoading(true);

                const response = await axiosPrivate.post(`/api/v1/admin/movies`, {
                    title: formData?.title,
                    title_image: formData?.title_image,
                    poster_image: formData?.poster_image,
                    backdrop_image: formData?.backdrop_image,
                    description: formData?.description,
                    created_at: formData?.created_at,
                    average_rating: formData?.average_rating,
                    watch_age_id: formData?.watch_age,
                    category_id: formData?.category,
                    genre_ids: formData?.genre,
                    part_number: formData?.part_number
                });

                // console.log(response.data);

                if (response.data?.isSuccess && response.data?.data) {
                    navigate("/movies");
                } else {
                    throw new Error(response.data?.message || "web-series creation failed");
                }
            }

            else if (formData?.category.toString() === "3") {
                // console.log("Uploading episode...");
                setIsLoading(true);

                const response = await axiosPrivate.post(`/api/v1/admin/episodes`, {
                    title: formData?.title,
                    title_image: formData?.title_image,
                    poster_image: formData?.poster_image,
                    backdrop_image: formData?.backdrop_image,
                    description: formData?.description,
                    created_at: formData?.created_at,
                    average_rating: formData?.average_rating,
                    watch_age_id: formData?.watch_age,
                    category_id: formData?.category,
                    genre_ids: formData?.genre,
                    season_id: formData?.season_id,
                    episode_number: formData?.episode_number
                });

                // console.log(response.data);

                if (response.data?.isSuccess && response.data?.data) {
                    navigate("/episodes");
                } else {
                  throw new Error(response.data?.message || "Episode creation failed");
                }
            }

            else {
                throw new Error("Invalid category.");
                return;
            }
        }

        catch(error) {
            setErrMsg(error?.response?.data?.message);
        }

        // Clear any previous error message if everything is okay
        // setErrMsg(""); // Clear the error message if validation passed
    };

    return (
        <Fragment>
            <Outer className="bg-gray-100">
                <Navbar />
                <div className="col-span-full flex flex-col items-center justify-start pt-24 px-4 w-full">
                    <h1 className="text-2xl font-semibold mb-4 text-gray-800 tracking-wide">
                        ADD CONTENT
                    </h1>

                    {errMsg && (
                        <div className="mb-4 px-4 py-2 text-red-600 bg-red-100 border border-red-200 rounded w-full max-w-4xl">
                            {errMsg}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="relative z-10 flex justify-center items-center h-50 pt-10">
                            <div className="animate-spin h-12 w-12 border-4 border-blue-800 rounded-full border-t-transparent"></div>
                        </div>
                    ) : (
                        <ContentForm 
                            genreList={genreList}
                            ageList={ageList}
                            category={categoryList}
                            onSubmit={handleSubmit}
                            season_id={season}
                            season_number={sno}
                        />
                    )}
                </div>
            </Outer>
        </Fragment>
    );
}

export default Content;
