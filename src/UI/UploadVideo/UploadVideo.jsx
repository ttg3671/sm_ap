import { useState, useEffect, Fragment, useMemo } from "react";
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { Outer, Navbar, UploadForm } from "../../components";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const UploadVideo = () => {
	const [isLoading, setIsLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();

    const location = useLocation();
    const { id, type } = useParams();

    const [searchParams] = useSearchParams();

    const video = searchParams.get('video');

    // console.log(id, type);

    const [initialData, setInitialData] = useState(null);

	useEffect(() => {
		setIsLoading(true);

		// console.log("hii");

	  const fetchTrailer = async () => {
	    try {
	      const response = await axiosPrivate.get(`/api/v1/admin/link/${id}/${type}`);
	      if (response.data?.isSuccess && response.data?.data) {
	      	// console.log(response.data?.data);
	        setInitialData(response.data?.data);
	        !response.data?.data?.video ? setIsLoading(true) : setIsLoading(false);
	      }
	    } catch (err) {
	    	setErrMsg("Failed to fetch video data");
	      console.error("Failed to fetch trailer data", err);
	    } finally {
	      setIsLoading(false);
	    }
	  };

	  if (id && type) {
	    fetchTrailer();
	  }
	}, [id, type]);

	// useEffect(() => {
	// 	setIsLoading(false);
	// }, [id, type]);

    const handleSubmit = async (v_id, id, type, link, duration, thumbnail_url) => {
    	// console.log(id, type, link, duration);
    	setIsLoading(true);
    	const vimeoLink = link ? link.split("https://vimeo.com/")[1] : "";

    	const response = await axiosPrivate.post("/api/v1/admin/video", {
    		video_id: Number(id), 
    		type: Number(type), 
    		video: vimeoLink, 
    		duration: Number(duration),
    		thumbnail_url
    	})

    	// console.log(response.data?.isSuccess);

    	if (response.data?.isSuccess) {
	      // if (type == 1) navigate("/webseries");
	      // else if (type == 2) navigate("/movies");
	      // else navigate("/webseries"); // fallback
    		navigate(`/videos/${id}/${type}`);
	    } 
	    else {
	      setErrMsg(response.data?.message || "Failed to add trailer. Try again...");
	    }
    }

    const handleUpdate = async (v_id, id, type, link, duration, thumbnail_url) => {
    	// console.log(id, type, link, duration, thumbnail_url);
    	setIsLoading(true);

    	let vimeoLink = null;

    	if (link.includes("https://player.vimeo.com/progressive_redirect/playback/")) {
    		vimeoLink = link ? link.split("https://player.vimeo.com/progressive_redirect/playback/")[1].split("/")[0] : "";
    	}
    	else if (link.includes("https://vimeo.com/")) {
    		vimeoLink = link ? link.split("https://vimeo.com/")[1] : "";
    	}

    	// console.log(vimeoLink);

    	const response = await axiosPrivate.put(`/api/v1/admin/video/${id}`, {
    		type: type,
    		video: vimeoLink, 
    		duration: Number(duration),
    		thumbnail_url
    	})

    	// console.log(response.data?.isSuccess);

    	if (response.data?.isSuccess) {
	      // if (type == 1) navigate("/webseries");
	      // else if (type == 2) navigate("/movies");
	      // else navigate("/webseries"); // fallback
    		navigate(`/videos/${id}/${type}`);
	    } 
	    else {
	      setErrMsg(response.data?.message || "Failed to add trailer. Try again...");
	    }
    }

	return (
		<Fragment>
			<Outer>
				<Navbar />
				
				<div className="col-span-full flex flex-col items-center justify-start pt-24 px-4 w-full">
			        <h1 className="text-2xl font-semibold mb-4 text-gray-800 tracking-wide">
			            Upload Video
			        </h1>

			        {errMsg && (
			            <div className="mb-4 px-4 py-2 text-red-600 bg-red-100 border border-red-200 rounded w-full max-w-4xl">
			              {errMsg}
			            </div>
			        )}

			        {isLoading ? ( // Only show loading if there's a videoLink AND isLoading is true
				        <div className="relative z-10 flex justify-center items-center h-50 pt-10">
				            <div className="animate-spin h-12 w-12 border-4 border-blue-800 rounded-full border-t-transparent"></div>
				        </div>
				    ) : (
			          <UploadForm 
			          	id={id}
			          	type={type} 
			          	onSubmit={handleSubmit}
			          	initialData={initialData}
			          	onUpdate={handleUpdate}
			          />
			        )}
			    </div>
			</Outer>
		</Fragment>
	)
}

export default UploadVideo;