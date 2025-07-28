import { useState, useEffect, Fragment, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Outer, Navbar, UploadForm } from "../../components";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const UploadTrailer = () => {
	const [isLoading, setIsLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    const [v_id, setID] = useState(null);
    const [v_type, setType] = useState(null);

    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();

    const location = useLocation();
    const { id, type } = useParams();

    // console.log(id, type);

    useEffect(() => {
        if (v_id !== id) setID(id);
        if (v_type !== type) setType(type);
    }, [v_id, v_type, id, type]);

    const [initialData, setInitialData] = useState(null);

	useEffect(() => {
		setIsLoading(true);

	  const fetchTrailer = async () => {
	    try {
	      const response = await axiosPrivate.get(`/api/v1/admin/link/${v_id}/${v_type}/1`);
	      if (response.data?.isSuccess) {
	      	console.log(!response.data?.data);
	        
	        if (!response.data?.data) {
	        	setIsLoading(true);
	        }
	        // } else {
	        // 	setIsLoading(false);
	        // 	setInitialData(response.data?.data);
	        // }
	      }
	    } catch (err) {
	      console.error("Failed to fetch trailer data", err);
	    } finally {
	      setIsLoading(false);
	    }
	  };

	  if (v_id && v_type) {
	    fetchTrailer();
	  }
	}, [v_id, v_type]);

    const handleSubmit = async (id, type, link, duration) => {
    	// console.log(id, type, link, duration);
    	setIsLoading(true);
    	const vimeoLink = link ? link.split("https://vimeo.com/")[1] : "";

    	const response = await axiosPrivate.post("/api/v1/admin/trailer", {
    		video_id: Number(id), 
    		type: Number(type), 
    		video: vimeoLink, 
    		duration: Number(duration)
    	})

    	// console.log(response.data?.isSuccess);

    	if (response.data?.isSuccess) {
	      if (type == 1) navigate("/webseries");
	      else if (type == 2) navigate("/movies");
	      else navigate("/webseries"); // fallback
	    } 
	    else {
	      setErrMsg(response.data?.message || "Failed to add trailer. Try again...");
	    }
    }

    const onVideoRemoved = async (id, type) => {
    	// console.log(id, type);

    	const response = await axiosPrivate.delete(`/api/v1/admin/trailer/${id}/${type}`);

    	if (!response.data?.isSuccess) {
	      setErrMsg(response.data?.message || "Failed to delete trailer. Try again...");
	    }
    }

	return (
		<Fragment>
			<Outer>
				<Navbar />

				{isLoading ? ( // Only show loading if there's a videoLink AND isLoading is true
		          <div className="relative z-10 flex justify-center items-center h-50 pt-10">
		            <div className="animate-spin h-12 w-12 border-4 border-blue-800 rounded-full border-t-transparent"></div>
		          </div>
		        ) : (
					<div className="col-span-full flex flex-col items-center justify-start pt-24 px-4 w-full">
			          <h1 className="text-2xl font-semibold mb-4 text-gray-800 tracking-wide">
			            Upload Trailer
			          </h1>

			          {errMsg && (
			            <div className="mb-4 px-4 py-2 text-red-600 bg-red-100 border border-red-200 rounded w-full max-w-4xl">
			              {errMsg}
			            </div>
			          )}

			          <UploadForm 
			          	id={v_id}
			          	type={v_type} 
			          	onSubmit={handleSubmit}
			          	initialData={initialData}
			          	onVideoRemoved={onVideoRemoved}
			          />
			        </div>
			    )}
			</Outer>
		</Fragment>
	)
}

export default UploadTrailer;