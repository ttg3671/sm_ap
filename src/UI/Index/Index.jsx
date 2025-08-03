import { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Outer, Navbar, DataList, TagList } from "../../components";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const Index = () => {
	const [listData, setListData] = useState([]);
  	const [isLoading, setIsLoading] = useState(true);
  	const [errMsg, setErrMsg] = useState("");
  	const [page, setPage] = useState(1); // Current page
    const [itemsPerPage] = useState(10); // Items per page (can be customized)
    const [totalItems, setTotalItems] = useState(3);
    const [genres, setGenres] = useState([]);
    const [contents, setContents] = useState([]);

  	const navigate = useNavigate();
  	const location = useLocation();

  	const axiosPrivate = useAxiosPrivate();

  	useEffect(() => {
        let isMounted = true;  // Prevent memory leak
        const controller = new AbortController();

        const fetchData = async () => {
            const endpoints = [
	            axiosPrivate.get(`/api/v1/admin/home?pgNo=${page}&page_items=${itemsPerPage}`, {
	                signal: controller.signal,
	            }),
	            axiosPrivate.get(`/api/v1/admin/genres`, {
	                signal: controller.signal,
	            }),
	            axiosPrivate.get(`/api/v1/admin/contents`, {
	                signal: controller.signal,
	            }),
	        ];

            const results = await Promise.allSettled(endpoints);

            // Check if the component is still mounted before updating the state
            if (isMounted) {
                results.forEach((result, index) => {
                    if (result.status === "fulfilled") {
                        const data = result.value.data?.data || [];
                        switch (index) {
                            case 0:
                                setListData(data?.result);
                                setPage(data?.currentPage || 1);
                                break;
                            case 1:
                                setGenres(data);
                                break;
                            case 2:
                                setContents(data);
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
    }, [page, navigate, location]);

  	const handlePageChange = (newPage) => {
        // console.log("Attempting to change page to:", newPage);
        // Ensure newPage is within valid range [1, totalItems]
        if (newPage >= 1 && newPage <= totalItems) {
            setPage(newPage);
        } else {
            setPage(1);
            // console.log("Invalid page number:", newPage);
        }
    };

    // Get page numbers (1, 2, 3) based on the current page
    const getPageNumbers = () => {
        const pageNumbers = [];

        // Add page 1
        pageNumbers.push(1);

        // Add page 2 if it exists
        if (totalItems >= 1) {
            pageNumbers.push(2);
        }

        // Add page 3 if it exists
        if (totalItems >= 1) {
            pageNumbers.push(3);
        }

        // Ensure no duplicates and sort (though with this logic, they should be sorted already)
        return [...new Set(pageNumbers)];
    };

    const handleDelete = async (id) => {
    	// console.log(id);
        try {
            setIsLoading(true); // Start loading
            
            // Check for the type and make appropriate delete request
            const response = await axiosPrivate.delete(`/api/v1/admin/home/${id}`);

            if (response?.data?.isSuccess) {
                // If deletion was successful, remove the item from the content list
                setListData((prevContentList) => 
                    prevContentList.filter(content => content.id !== id)
                );
                setIsLoading(false); // Stop loading
            } else {
                throw new Error(response?.data?.message);
            }
        } catch (error) {
            setErrMsg(error.response?.data?.message || 'Something went wrong.');
            setIsLoading(false); // Stop loading on error
        }
    };

    const handleClick = async (id, name, type, position) => {
    	try {
    		// console.log(id, name, type, position);
    		setIsLoading(true);

	      	// Send request to add content to trending
	      	const response = await axiosPrivate.post("/api/v1/admin/home", {
	        	type: type, 
	        	type_id: id, 
	        	position: position
	      	});

	      	if (response.data?.isSuccess) {
	      	  	// alert("Content added successfully!");
	      	  	setListData(prev => [...prev, {id: response.data?.data, name, type, type_id: id, position, video_id: 0}]);
	      	  	setIsLoading(false);
	      	} else {
	      		throw new Error(response.data?.message);
	      	}
	    } catch (error) {
	      	console.error("Error adding to trending:", error);
	      	alert("Error adding to home. Please try again.");
	      	setIsLoading(false);
	    }
    };

    const handleEdit = async (id, type, position) => {
	    try {
	    	// console.log(id, type, position);
	        // Start loading
	        setIsLoading(true);

	        // Send the update request
	        const response = await axiosPrivate.put(`/api/v1/admin/home/${id}`, {
	            type,
	            position
	        });

	        if (response?.data?.isSuccess) {
	            // If successful, update the listData state
	            setListData(prev => {
                	return prev.map(i => {
                		if (i.id === id) {
                			return { ...i, position };
                		}
                		return i;
                	})
                })
	            setIsLoading(false); // Stop loading
	        } 

	        else {
	            throw new Error(response?.data?.message);
	        }
	    } catch (error) {
	        setErrMsg(error.response?.data?.message || 'Something went wrong.');
	        setIsLoading(false); // Stop loading on error
	    }
	};

	return (
		<Fragment>
			<Outer>
				<Navbar />

				<div className="col-span-full flex flex-col items-center justify-start pt-24 px-4 w-full">
		          	<h1 className="text-2xl font-semibold mb-4 text-gray-800 tracking-wide">
		            	Home
		          	</h1>

		          	{errMsg && (
			            <div className="mb-4 px-4 py-2 text-red-600 bg-red-100 border border-red-200 rounded w-full max-w-4xl">
			              {errMsg}
			            </div>
			        )}

			        <div className="w-full max-w-4xl overflow-x-auto bg-white shadow-md rounded-lg">
			            {isLoading ? (
			              <div className="relative z-10 flex justify-center items-center h-50 pt-10">
			                <div className="animate-spin h-12 w-12 border-4 border-blue-800 rounded-full border-t-transparent"></div>
			              </div>
			            ) : listData.length > 0 ? (
			              <DataList itemList={listData} isAge={false} isCategory={true} isHome={true} onEdit={handleEdit} onDelete={handleDelete} />
			            ) : (
			              <div className="text-center py-10 text-gray-500">
			                No home page data found.
			              </div>
			            )}

			            <h4 className="text-2xl text-center font-bold my-5">ADD MORE</h4>

			            {isLoading ? (
			              <div className="relative z-10 flex justify-center items-center h-50 pt-10">
			                <div className="animate-spin h-12 w-12 border-4 border-blue-800 rounded-full border-t-transparent"></div>
			              </div>
			            ) : contents.length > 0 ? (
			              <TagList tags={contents} type_id={1} handleClick={handleClick} className="my-4 flex-wrap" />
			            ) : (
			              <div className="text-center py-10 text-gray-500">
			                No tags found.
			              </div>
			            )}


			            {isLoading ? (
			              <div className="relative z-10 flex justify-center items-center h-50 pt-10">
			                <div className="animate-spin h-12 w-12 border-4 border-blue-800 rounded-full border-t-transparent"></div>
			              </div>
			            ) : genres.length > 0 ? (
			              <TagList tags={genres} type_id={2} handleClick={handleClick} className="my-4 flex-wrap" />
			            ) : (
			              <div className="text-center py-10 text-gray-500">
			                No genres found.
			              </div>
			            )}

			            {totalItems > 1 && ( // Even if totalItems is 1, you might want to show the pagination with page 1 enabled
	                        <div className="mt-6 flex items-center justify-center gap-4">
	                            <button
	                                className={`p-2 text-gray-800 rounded-full hover:bg-gray-200 ${page === 1 && "cursor-not-allowed opacity-50"}`}
	                                onClick={() => handlePageChange(page - 1)}
	                                disabled={page === 1}
	                            >
	                                <MdChevronLeft size={24} />
	                            </button>

	                            {/* Page Numbers (1, 2, 3) */}
	                            <div className="flex items-center space-x-2">
	                                {getPageNumbers().map((pageNumber) => (
	                                    <button
	                                        key={pageNumber}
	                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${page === pageNumber ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"}`}
	                                        onClick={() => handlePageChange(pageNumber)}
	                                        disabled={pageNumber > totalItems} // Disable if page number exceeds total pages
	                                    >
	                                        {pageNumber}
	                                    </button>
	                                ))}
	                            </div>

	                            <button
	                                className={`p-2 text-gray-800 rounded-full hover:bg-gray-200 ${page === totalItems && "cursor-not-allowed opacity-50"}`}
	                                onClick={() => handlePageChange(page + 1)}
	                                disabled={page === totalItems}
	                            >
	                                <MdChevronRight size={24} />
	                            </button>
	                        </div>
	                    )}
			        </div>
		        </div>
			</Outer>
		</Fragment>
	)
}

export default Index;