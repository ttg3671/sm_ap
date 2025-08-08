import { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Outer, Navbar, Card } from "../../components";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const Trailer = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    const [sliderList, setSliderList] = useState([]);

    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();
    const location = useLocation();
    const isMounted = useRef(true);
    const { id, type } = useParams();

    // console.log(id, type);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getCategory = async () => {
            try {
                const response = await axiosPrivate.get(`/api/v1/admin/trailer/all/${id}/${type}`, {
                    signal: controller.signal,
                });

                if (isMounted && response.data?.isSuccess) {
                    // console.log(id, response.data);
                    setSliderList(response.data?.data || []);
                    setIsLoading(false);
                }
            } catch (error) {
                if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
                    return;
                } else if (error.response?.status === 401) {
                    navigate("/", { state: { from: location }, replace: true });
                } else if (error.response?.status == 400 || error.response) {
                    setErrMsg(error.response?.data?.message);
                    setIsLoading(false);

                    const interval = setTimeout(() => {
                        if (isMounted) setErrMsg("");
                    }, 1000);

                    return () => clearTimeout(interval);
                } else {
                    setErrMsg("Something went wrong.");
                    setIsLoading(false);
                }
            }
        };

        getCategory();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [navigate, location]);

    const handleDelete = async (video) => {
        // console.log('Delete item with ID:', id, video);
        try {
            setIsLoading(true);
            
            const response = await axiosPrivate.delete(`/api/v1/admin/trailer/${video}`);

            if (response.data?.isSuccess) {
                setSliderList((prev) =>
                    prev.filter((item) => item.video !== video)
                );
                setIsLoading(false);
            }
        } catch (error) {
            if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
                return;
            } else if (error.response?.status === 401) {
                navigate("/", { state: { from: location }, replace: true });
            } else if (error.response?.status == 400 || error.response) {
                setErrMsg(error.response?.data?.message);
                setIsLoading(false);

                const interval = setTimeout(() => {
                    if (isMounted) setErrMsg("");
                }, 1000);

                return () => clearTimeout(interval);
            } else {
                setErrMsg("Something went wrong.");
                setIsLoading(false);
            }
        }
    };

    const handleUpdate = async (video) => {
        // console.log(video);
        navigate(`/trailer/${video}/${type}?v=${id}`);
    }

    const handleUploadClick = () => {
      // open file input, modal, or redirect
      navigate(`/trailer/${id}/${type}?v=new`);
    };

    return (
        <Fragment>
            <Outer className="bg-gray-100">
                <Navbar />
                <div className="col-span-full flex flex-col items-center justify-start pt-24 px-4 w-full">
                    <h1 className="text-2xl font-semibold mb-4 text-gray-800 tracking-wide">
                        SPECIAL MOMENTS
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
                        <>
                          {sliderList.length > 0 ? (
                            sliderList.map((content, index) => (
                              <Card
                                key={index}
                                isSlider={false}
                                dataList={content}
                                onDelete={handleDelete}
                                onUpdate={handleUpdate}
                              />
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-600">
                              <p className="mb-4">No trailer found.</p>
                              <button
                                onClick={handleUploadClick}
                                className="inline-flex items-center justify-center bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200 cursor-pointer shadow-md"
                              >
                                Upload Trailer
                              </button>
                            </div>
                          )}

                          {/* This button is always shown regardless of list */}
                          <button
                            onClick={handleUploadClick}
                            className="inline-flex mb-10 items-center justify-center bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200 cursor-pointer shadow-md mt-4"
                          >
                            Upload More Trailer
                          </button>
                        </>
                    )}
                </div>
            </Outer>
        </Fragment>
    )
}

export default Trailer;