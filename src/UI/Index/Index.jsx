import { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { Outer, Navbar, DataList, TagList } from "../../components";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { MdChevronLeft, MdChevronRight, MdDashboard, MdTrendingUp, MdMovie, MdAdd, MdError, MdBarChart } from "react-icons/md";
import { FiUsers, FiGrid, FiPlus } from "react-icons/fi";
import { BiCategoryAlt } from "react-icons/bi";
import { useTheme } from '../../contexts/ThemeContext';
import axios from 'axios';

const Index = () => {
	const [listData, setListData] = useState([]);
	const [totalItems, setTotalItems] = useState(1);
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [errMsg, setErrMsg] = useState('');
	const [contents, setContents] = useState([]);
	const [genres, setGenres] = useState([]);
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();
		const { isGolden, isEmerald } = useTheme();

    useEffect(() => {
        const controller = new AbortController();
        let isMounted = true;

        const fetchData = async () => {
            if (!isMounted) return;

            setIsLoading(true);
            setErrMsg('');

            try {
                // Get auth token from session storage
                const token = sessionStorage.getItem('authToken');
                
                // Set common headers for all requests
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                };
                
                // Create API requests using axiosPrivate (which already has auth headers)
                // Note: axiosPrivate already has the base URL set to /api/v1 in development
                const apiCalls = [
                    axiosPrivate.get(`/admin/home?page=${page}&limit=6`),
                    axiosPrivate.get(`/genre`),
                    axiosPrivate.get(`/content`)
                ];
                
                // Execute all requests in parallel
                const results = await Promise.allSettled(apiCalls);
                
                if (isMounted) {
                    let hasError = false;
                    
                    results.forEach((result, index) => {
                        if (result.status === 'fulfilled') {
                            const data = result.value?.data?.data;
                            
                            switch (index) {
                                case 0:
                                    if (data?.result) {
                                        setListData(data.result);
                                        setTotalItems(data.totalPages || 1);
                                        setPage(data.currentPage || 1);
                                    } else {
                                        hasError = true;
                                    }
                                    break;
                                case 1:
                                    if (data) {
                                        setGenres(data);
                                    } else {
                                        hasError = true;
                                    }
                                    break;
                                case 2:
                                    if (data) {
                                        setContents(data);
                                    } else {
                                        hasError = true;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        } else {
                            console.error(`API request ${index + 1} failed:`, result.reason);
                            hasError = true;
                        }
                    });
                    
                    if (hasError) {
                        setErrMsg("Some data failed to load. Please check your connection or try again later.");
                    }
                    
                    setIsLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Failed to fetch data:", error);
                    setErrMsg("Failed to load data. Please try again later.");
                    setIsLoading(false);
                }
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
            
            // Use axiosPrivate which already has auth headers set up
            const response = await axiosPrivate.delete(`/admin/home/${id}`);
            
            if (response.status === 200 || response.status === 204) {
                // If successful, update UI by removing the item
                setListData((prevContentList) => 
                    prevContentList.filter(content => content.id !== id)
                );
                setIsLoading(false);
            } else {
                throw new Error('Failed to delete item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            setErrMsg('Failed to delete item. Please try again.');
            setIsLoading(false); // Stop loading on error
        }
    };

    const handleClick = async (id, name, type, position) => {
    	try {
    		// console.log(id, name, type, position);
    		setIsLoading(true);
            
            // Prepare the data to be sent to the API
            const payload = {
                name,
                title: name,
                type,
                type_id: id,
                position,
                video_id: 0,
                status: "Active"
            };
            
            // Send POST request using axiosPrivate which already has auth headers
            const response = await axiosPrivate.post(`/admin/home`, payload);
            
            if (response.status === 201 || response.status === 200) {
                // If successful, update UI with the new item from API response
                const newItem = response.data.data;
                setListData(prev => [...prev, newItem]);
                setIsLoading(false);
            } else {
                throw new Error('Failed to add item');
            }
	      	
	    } catch (error) {
	      	console.error("Error adding to home:", error);
	      	setErrMsg("Error adding to home. Please try again.");
	      	setIsLoading(false);
	    }
    };

    const handleEdit = async (id, type, position) => {
	    try {
	    	// console.log(id, type, position);
	        // Start loading
	        setIsLoading(true);
            
            // Prepare the update payload
            const payload = { position };
            
            // Send PATCH request using axiosPrivate which already has auth headers
            const response = await axiosPrivate.patch(`/admin/home/${id}`, payload);
            
            if (response.status === 200) {
                // If successful, update UI with the updated item
                setListData(prev => {
                    return prev.map(i => {
                        if (i.id === id) {
                            return { ...i, position };
                        }
                        return i;
                    });
                });
                setIsLoading(false); // Stop loading
            } else {
                throw new Error('Failed to update item');
            }

	    } catch (error) {
	        console.error('Error updating item:', error);
	        setErrMsg('Failed to update item. Please try again.');
	        setIsLoading(false); // Stop loading on error
	    }
	};

	return (
		<Fragment>
			<Outer>
				<Navbar />

				<motion.div 
					className={`col-span-full flex flex-col items-center justify-start pt-24 px-4 w-full min-h-screen ${isGolden ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50' : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50'}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
		          	<motion.h1 
		          		className={`text-4xl font-bold mb-8 bg-gradient-to-r ${isGolden ? 'from-amber-700 via-yellow-600 to-orange-600' : 'from-emerald-700 via-teal-600 to-green-600'} bg-clip-text text-transparent tracking-wide`}
		          		initial={{ opacity: 0, y: -20 }}
		          		animate={{ opacity: 1, y: 0 }}
		          		transition={{ duration: 0.6, delay: 0.2 }}
		          	>
		            	Dashboard
		          	</motion.h1>

		          	{errMsg && (
		          		<motion.div 
		          			className="mb-6 px-6 py-4 text-red-700 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg w-full max-w-6xl shadow-sm"
		          			initial={{ opacity: 0, x: -20 }}
		          			animate={{ opacity: 1, x: 0 }}
		          			transition={{ duration: 0.4 }}
		          		>
		          			<div className="flex items-center">
		          				<MdError className="mr-3 text-red-500" size={20} />
		          				{errMsg}
		          			</div>
		          		</motion.div>
		          	)}

			        <motion.div 
		        		className={`w-full max-w-6xl overflow-hidden ${isGolden ? 'bg-gradient-to-br from-white via-amber-50 to-yellow-50 border-amber-200 shadow-amber-100' : 'bg-gradient-to-br from-white via-emerald-50 to-teal-50 border-emerald-200 shadow-emerald-100'} backdrop-blur-lg shadow-2xl rounded-2xl border-2`}
		        		initial={{ opacity: 0, scale: 0.95 }}
		        		animate={{ opacity: 1, scale: 1 }}
		        		transition={{ duration: 0.6, delay: 0.3 }}
		        	>
		        		{/* Main Content Section */}
		        		<div className="p-8">
		        			<motion.div 
		        				className="flex items-center gap-3 mb-6"
		        				initial={{ opacity: 0, x: -20 }}
		        				animate={{ opacity: 1, x: 0 }}
		        				transition={{ duration: 0.5, delay: 0.4 }}
		        			>
		        				<div className={`p-2 bg-gradient-to-r ${isGolden ? 'from-amber-700 to-yellow-600 shadow-amber-200' : 'from-emerald-700 to-teal-600 shadow-emerald-200'} rounded-lg shadow-lg`}>
		        					<MdDashboard className="text-white" size={24} />
		        				</div>
		        				<h2 className="text-2xl font-bold text-gray-800">Current Content</h2>
		        			</motion.div>

			            	{isLoading ? (
			            		<motion.div 
			            			className={`relative z-10 flex flex-col justify-center items-center h-64 bg-gradient-to-br ${isGolden ? 'from-amber-100 via-yellow-50 to-orange-100 border border-amber-200' : 'from-emerald-100 via-teal-50 to-green-100 border border-emerald-200'} rounded-xl shadow-lg`}
			            			initial={{ opacity: 0 }}
			            			animate={{ opacity: 1 }}
			            			transition={{ duration: 0.3 }}
			            		>
			            			<motion.div 
			            				className={`w-16 h-16 border-4 ${isGolden ? 'border-amber-300 border-t-amber-700' : 'border-emerald-300 border-t-emerald-700'} rounded-full animate-spin`}
			            				animate={{ rotate: 360 }}
			            				transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
			            			/>
			            			<motion.p 
			            				className={`mt-4 ${isGolden ? 'text-amber-700' : 'text-emerald-700'} font-semibold text-lg`}
			            				initial={{ opacity: 0 }}
			            				animate={{ opacity: 1 }}
			            				transition={{ delay: 0.2 }}
			            			>
			            				Loading content...
			            			</motion.p>
			            		</motion.div>
			            	) : listData && listData.length > 0 ? (
			            		<motion.div
			            			initial={{ opacity: 0, y: 20 }}
			            			animate={{ opacity: 1, y: 0 }}
			            			transition={{ duration: 0.5, delay: 0.5 }}
			            		>
			              			<DataList itemList={listData} isAge={false} isCategory={true} isHome={true} onEdit={handleEdit} onDelete={handleDelete} />
			              		</motion.div>
			            	) : (
			            		<motion.div 
			            			className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl"
			            			initial={{ opacity: 0 }}
			            			animate={{ opacity: 1 }}
			            			transition={{ duration: 0.5 }}
			            		>
			            			<FiGrid className="mx-auto mb-4 text-gray-400" size={48} />
			            			<p className="text-lg">No home page data found.</p>
			            		</motion.div>
			            	)}
		        		</div>

		        		{/* Add More Section */}
		        		<div className={`border-t ${isGolden ? 'border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50' : 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50'} p-8 shadow-inner`}>
		        			<motion.div 
		        				className="flex items-center justify-center gap-3 mb-6"
		        				initial={{ opacity: 0, y: 20 }}
		        				animate={{ opacity: 1, y: 0 }}
		        				transition={{ duration: 0.5, delay: 0.6 }}
		        			>
		        				<div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
		        					<MdAdd className="text-white" size={24} />
		        				</div>
		        				<h3 className="text-2xl font-bold text-gray-800">Add More Content</h3>
		        			</motion.div>

		        			{/* Contents Section */}
		        			<motion.div 
		        				className="mb-8"
		        				initial={{ opacity: 0, y: 20 }}
		        				animate={{ opacity: 1, y: 0 }}
		        				transition={{ duration: 0.5, delay: 0.7 }}
		        			>
		        				<div className="flex items-center gap-2 mb-4">
		        					<MdMovie className={`${isGolden ? 'text-amber-700' : 'text-emerald-700'}`} size={24} />
		        					<h4 className="text-lg font-semibold text-gray-700">Movies & Series</h4>
		        				</div>
			            		{isLoading ? (
			            			<motion.div 
			            				className="flex justify-center items-center h-32 bg-white rounded-xl shadow-sm"
			            				initial={{ opacity: 0 }}
			            				animate={{ opacity: 1 }}
			            			>
			            				<motion.div 
			            					className={`w-8 h-8 border-2 ${isGolden ? 'border-amber-300 border-t-amber-700' : 'border-emerald-300 border-t-emerald-700'} rounded-full animate-spin`}
			            					animate={{ rotate: 360 }}
			            					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
			            				/>
			            			</motion.div>
			            		) : contents && contents.length > 0 ? (
			            			<motion.div
			            				initial={{ opacity: 0, y: 10 }}
			            				animate={{ opacity: 1, y: 0 }}
			            				transition={{ duration: 0.4 }}
			            			>
			              				<TagList tags={contents} type_id={1} handleClick={handleClick} className="my-4 flex-wrap" />
			              			</motion.div>
			            		) : (
			            			<div className="text-center py-8 text-gray-500 bg-white rounded-xl shadow-sm">
			            				<MdMovie className="mx-auto mb-2 text-gray-400" size={32} />
			                			<p>No content found.</p>
			              			</div>
			            		)}
		        			</motion.div>

		        			{/* Genres Section */}
		        			<motion.div
		        				initial={{ opacity: 0, y: 20 }}
		        				animate={{ opacity: 1, y: 0 }}
		        				transition={{ duration: 0.5, delay: 0.8 }}
		        			>
		        				<div className="flex items-center gap-2 mb-4">
		        					<BiCategoryAlt className="text-purple-600" size={20} />
		        					<h4 className="text-lg font-semibold text-gray-700">Genres</h4>
		        				</div>
			            		{isLoading ? (
			            			<motion.div 
			            				className="flex justify-center items-center h-32 bg-white rounded-xl shadow-sm"
			            				initial={{ opacity: 0 }}
			            				animate={{ opacity: 1 }}
			            			>
			            				<motion.div 
			            					className="w-8 h-8 border-2 border-purple-200 rounded-full border-t-purple-600"
			            					animate={{ rotate: 360 }}
			            					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
			            				/>
			            			</motion.div>
			            		) : genres && genres.length > 0 ? (
			            			<motion.div
			            				initial={{ opacity: 0, y: 10 }}
			            				animate={{ opacity: 1, y: 0 }}
			            				transition={{ duration: 0.4 }}
			            			>
			              				<TagList tags={genres} type_id={2} handleClick={handleClick} className="my-4 flex-wrap" />
			              			</motion.div>
			            		) : (
			            			<div className="text-center py-8 text-gray-500 bg-white rounded-xl shadow-sm">
			            				<BiCategoryAlt className="mx-auto mb-2 text-gray-400" size={32} />
			                			<p>No genres found.</p>
			              			</div>
			            		)}
		        			</motion.div>
		        		</div>

		        		{/* Pagination */}
			            {totalItems > 1 && (
			            	<motion.div 
			            		className="p-6 bg-gray-50 border-t border-gray-200"
			            		initial={{ opacity: 0, y: 20 }}
			            		animate={{ opacity: 1, y: 0 }}
			            		transition={{ duration: 0.5, delay: 0.9 }}
			            	>
		                        <div className="flex items-center justify-center gap-4">
		                            <motion.button
		                                className={`p-3 text-gray-700 rounded-full transition-all duration-300 ${page === 1 ? "cursor-not-allowed opacity-50" : `${isGolden ? 'hover:bg-amber-100 hover:text-amber-700 hover:shadow-md' : 'hover:bg-emerald-100 hover:text-emerald-700 hover:shadow-md'}`}`}
		                                onClick={() => handlePageChange(page - 1)}
		                                disabled={page === 1}
		                                whileHover={{ scale: page === 1 ? 1 : 1.1 }}
		                                whileTap={{ scale: page === 1 ? 1 : 0.95 }}
		                            >
		                                <MdChevronLeft size={24} />
		                            </motion.button>

		                            {/* Page Numbers (1, 2, 3) */}
		                            <div className="flex items-center space-x-2">
		                                {getPageNumbers().map((pageNumber) => (
		                                    <motion.button
		                                        key={pageNumber}
		                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${page === pageNumber ? `${isGolden ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg shadow-amber-300' : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-300'}` : `text-gray-700 ${isGolden ? 'hover:bg-amber-100 hover:text-amber-700' : 'hover:bg-emerald-100 hover:text-emerald-700'}`}`}
		                                        onClick={() => handlePageChange(pageNumber)}
		                                        disabled={pageNumber > totalItems}
		                                        whileHover={{ scale: 1.05 }}
		                                        whileTap={{ scale: 0.95 }}
		                                    >
		                                        {pageNumber}
		                                    </motion.button>
		                                ))}
		                            </div>

		                            <motion.button
		                                className={`p-3 text-gray-700 rounded-full transition-all duration-300 ${page === totalItems ? "cursor-not-allowed opacity-50" : `${isGolden ? 'hover:bg-amber-100 hover:text-amber-700 hover:shadow-md' : 'hover:bg-emerald-100 hover:text-emerald-700 hover:shadow-md'}`}`}
		                                onClick={() => handlePageChange(page + 1)}
		                                disabled={page === totalItems}
		                                whileHover={{ scale: page === totalItems ? 1 : 1.1 }}
		                                whileTap={{ scale: page === totalItems ? 1 : 0.95 }}
		                            >
		                                <MdChevronRight size={24} />
		                            </motion.button>
		                        </div>
		                    </motion.div>
		                )}
			        </motion.div>
		        </motion.div>
			</Outer>
		</Fragment>
	);
};

export { Index };
export default Index;