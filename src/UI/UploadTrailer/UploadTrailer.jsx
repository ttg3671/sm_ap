import { useState, useEffect, Fragment, useMemo } from "react";
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { Outer, Navbar, UploadForm } from "../../components";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const UploadTrailer = () => {
	const [isLoading, setIsLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();

    const location = useLocation();
    const { id, type } = useParams();

    const [searchParams] = useSearchParams();

    let v = searchParams.get('v');

    // console.log(v, v !== "new");

    // console.log(id, type, v);

    const [initialData, setInitialData] = useState(null);

	useEffect(() => {
		setIsLoading(true);

		// console.log("hii");

	  	const fetchTrailer = async () => {
		    try {
		      const response = await axiosPrivate.get(`/api/v1/admin/trailer/link/${id}`);
		      if (response.data?.isSuccess) {
		      	// console.log(response.data);
		        
		        if (!response.data?.data) {
		        	setIsLoading(true);
		        }
		        else {
		        	setIsLoading(false);
		        	setInitialData(response.data?.data);
		        }
		      }
		    } catch (err) {
		    	setErrMsg("Failed to fetch trailer data");
		      	console.error("Failed to fetch trailer data", err);
		    } finally {
		      setIsLoading(false);
		    }
	  	};

	  	if (id && type && v !== "new") {
	    	fetchTrailer();
	  	}
	}, [id, type]);

	useEffect(() => {
		v == "new" ? setIsLoading(false) : null;

		v == "new" ? setInitialData(null) : null;
	}, [id, type, v])

    const handleSubmit = async (v_id, id, type, link, duration, thumbnail_url) => {
    	// console.log(v_id, id, type, link, duration, thumbnail_url, "submit");
    	setIsLoading(true);
    	const vimeoLink = link ? link.split("https://vimeo.com/")[1] : "";

    	const response = await axiosPrivate.post("/api/v1/admin/trailer", {
    		video_id: Number(id), 
    		type: Number(type), 
    		video: vimeoLink, 
    		duration: Number(duration),
    		thumbnail_url
    	})

    	// console.log(response.data?.isSuccess);

    	if (response.data?.isSuccess) {
    		navigate(`/trailers/${id}/${type}`);
	      // if (type == 1) navigate("/webseries");
	      // else if (type == 2) navigate("/movies");
	      // else navigate("/webseries"); // fallback
	    } 
	    else {
	      setErrMsg(response.data?.message || "Failed to add trailer. Try again...");
	    }
    }

    const handleUpdate = async (v_id, id, type, link, duration, thumbnail_url) => {
    	// console.log(v_id, id, type, link, duration, thumbnail_url, "update");
    	setIsLoading(true);
    	let vimeoLink = null;

    	if (link.includes("https://player.vimeo.com/progressive_redirect/playback/")) {
    		vimeoLink = link ? link.split("https://player.vimeo.com/progressive_redirect/playback/")[1].split("/")[0] : "";
    	}
    	else if (link.includes("https://vimeo.com/")) {
    		vimeoLink = link ? link.split("https://vimeo.com/")[1] : "";
    	}

    	// console.log(vimeoLink);

    	const response = await axiosPrivate.put(`/api/v1/admin/trailer/${id}`, {
    		video: vimeoLink, 
    		duration: Number(duration),
    		thumbnail_url
    	})

    	// console.log(response.data?.isSuccess);

    	if (response.data?.isSuccess) {
	      // if (type == 1) navigate("/webseries");
	      // else if (type == 2) navigate("/movies");
	      // else navigate("/webseries"); // fallback
    		navigate(`/trailers/${v_id}/${type}`);
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
			            Upload Trailer
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
				          	v_id={v}
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

export default UploadTrailer;