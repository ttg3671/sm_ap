import { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Outer, Navbar, Card } from "../../components";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const Slider = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    const [sliderList, setSliderList] = useState([]);

    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();
    const location = useLocation();
    const isMounted = useRef(true);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getCategory = async () => {
            try {
                const response = await axiosPrivate.get("/admin/slider", {
                    signal: controller.signal,
                });

                if (isMounted && response.data?.isSuccess) {
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

    const handleDelete = async (id) => {
        // console.log('Delete item with ID:', id, type);
        try {
            const response = await axiosPrivate.delete(`/admin/slider/${id}`);

            if (response.data?.isSuccess) {
                setSliderList((prev) =>
                    prev.filter((item) => item.slider_id !== id)
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

    const handleUpdate = async (slider_id, id, type, position) => {
        // console.log('Update item:', id, type, position);
        try {
            const response = await axiosPrivate.put(`/admin/slider/${slider_id}`, {
                video_id: id, type, position
            });

            if (response.data?.isSuccess) {
                setSliderList((prev) =>
                    prev.map((item) =>
                        item.slider_id === slider_id ? { ...item, video_id: id,type, position } : item
                    )
                );
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
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

    return (
        <Fragment>
            <Outer className="bg-gray-100">
                <Navbar />
                <div className="col-span-full flex flex-col items-center justify-start pt-24 px-6 w-full min-h-screen">
                    <div className="w-full max-w-7xl mx-auto">
                        <h1 className="text-2xl font-semibold mb-8 text-gray-800 tracking-wide text-center">
                            SLIDER
                        </h1>

                        {errMsg && (
                            <div className="mb-6 px-4 py-3 text-red-600 bg-red-100 border border-red-200 rounded-lg w-full">
                                {errMsg}
                            </div>
                        )}

                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin h-12 w-12 border-4 border-blue-800 rounded-full border-t-transparent"></div>
                            </div>
                        ) : (
                            sliderList.length > 0 ? (
                                <div className="card-grid-container">
                                    {sliderList.map((content, index) => (
                                        <div key={index} className="flex justify-center items-stretch">
                                            <Card
                                                dataList={content}
                                                onDelete={handleDelete}
                                                onUpdate={handleUpdate}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex justify-center items-center h-32 text-gray-600 bg-gray-50 rounded-lg">
                                    <p className="text-lg">No slider data found.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </Outer>
        </Fragment>
    )
}

export default Slider;