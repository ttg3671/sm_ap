import { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { Outer, Navbar, DataList, TagList } from "../../components";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { MdChevronLeft, MdChevronRight, MdDashboard, MdTrendingUp, MdMovie, MdAdd, MdError, MdBarChart } from "react-icons/md";
import { FiUsers, FiGrid, FiPlus } from "react-icons/fi";
import { BiCategoryAlt } from "react-icons/bi";
import { useTheme } from '../../contexts/ThemeContext';
import { dataUtils } from '../../config/demoData';
import { DEV_CONFIG, devUtils } from '../../config/devConfig';
import ApiService from '../../services/ApiService';
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

	// Initialize professional API service
	const [apiService] = useState(() => new ApiService(axiosPrivate));

    useEffect(() => {
        let isMounted = true;
        let timeoutId;

        const fetchData = async () => {
            if (!isMounted) return;

            // Debounce rapid calls
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(async () => {
                if (!isMounted) return;

                setIsLoading(true);
                setErrMsg('');

                try {
                    devUtils.log('Starting professional data fetch for Index page');
                    
                    // Use professional API service with proper error handling
                    const apiCalls = [
                        apiService.read(`/admin/home`, { page, limit: 6 }),
                        apiService.read(`/admin/genres`),
                        apiService.read(`/admin/contents`)
                    ];
                    
                    // Execute all requests with proper error handling
                    const results = await Promise.allSettled(apiCalls);
                    
                    if (!isMounted) return;
                    
                    let hasError = false;
                    let errorMessages = [];
                    
                    results.forEach((result, index) => {
                        if (result.status === 'fulfilled') {
                            const response = result.value;
                            const data = response.data?.data;
                            
                            switch (index) {
                                case 0: // Home data
                                    if (data?.result) {
                                        setListData(data.result);
                                        setTotalItems(data.totalPages || 1);
                                        setPage(data.currentPage || 1);
                                        devUtils.log('Home data loaded successfully');
                                    } else {
                                        devUtils.warn('Home data structure unexpected:', data);
                                        setListData([]);
                                    }
                                    break;
                                case 1: // Genres data
                                    if (data) {
                                        setGenres(data);
                                        devUtils.log('Genres data loaded successfully');
                                    } else {
                                        devUtils.warn('Genres data structure unexpected:', data);
                                        setGenres([]);
                                    }
                                    break;
                                case 2: // Contents data
                                    if (data) {
                                        setContents(data);
                                        devUtils.log('Contents data loaded successfully');
                                    } else {
                                        devUtils.warn('Contents data structure unexpected:', data);
                                        setContents([]);
                                    }
                                    break;
                                default:
                                    break;
                            }
                        } else {
                            // Handle API failures professionally
                            const error = result.reason;
                            devUtils.error(`API request ${index + 1} failed:`, error);
                            
                            // Check if it's a cancellation (ignore these)
                            if (error.message === 'canceled' || error.code === 'ERR_CANCELED') {
                                devUtils.log('Request was canceled - this is normal during navigation');
                                return;
                            }
                            
                            hasError = true;
                            
                            // Get user-friendly error message
                            if (error.standardizedError) {
                                errorMessages.push(error.standardizedError.userMessage);
                            } else {
                                errorMessages.push(`Failed to load ${['home', 'genres', 'contents'][index]} data`);
                            }
                        }
                    });
                    
                    if (hasError && errorMessages.length > 0) {
                        setErrMsg(`⚠️ ${errorMessages.join(', ')}. Some features may be limited.`);
                        
                        // Auto-clear error message after 5 seconds
                        setTimeout(() => {
                            if (isMounted) setErrMsg('');
                        }, 5000);
                    }
                    
                } catch (error) {
                    if (!isMounted) return;
                    
                    devUtils.error('Unexpected error during data fetch:', error);
                    
                    // Don't show errors for canceled requests
                    if (error.message !== 'canceled' && error.code !== 'ERR_CANCELED') {
                        setErrMsg('❌ Failed to load page data. Please refresh the page.');
                    }
                } finally {
                    if (isMounted) {
                        setIsLoading(false);
                    }
                }
            }, 100); // 100ms debounce
        };

        fetchData();

        // Cleanup function
        return () => {
            isMounted = false;
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [page, apiService]); // Only depend on page and apiService

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
    		devUtils.log('Starting professional API request for home data');
    		
    		// Debug logging to understand the data
    		devUtils.log('HandleClick called with:', { id, name, type, position });
    		devUtils.log('Current listData:', listData);
    		
    		setIsLoading(true);
    		setErrMsg(''); // Clear previous errors
            
            // Check if item already exists in the current list
            const existingItem = listData.find(item => {
                const matches = item.type_id === parseInt(id, 10) && 
                               item.type === String(type).trim();
                devUtils.log('Checking item:', item, 'matches:', matches);
                return matches;
            });
            
            if (existingItem) {
                devUtils.log('Item already exists, preventing API call:', existingItem);
                setErrMsg(`ℹ️ "${name}" is already added to the home page`);
                setIsLoading(false);
                setTimeout(() => setErrMsg(""), 3000);
                return;
            }
            
            // Professional input validation
            const validationErrors = [];
            if (!id) validationErrors.push('ID is required');
            if (!name?.trim()) validationErrors.push('Name is required');
            if (!type) validationErrors.push('Type is required');
            if (!position || position <= 0) validationErrors.push('Valid position is required');
            
            if (validationErrors.length > 0) {
                throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
            }
            
            // Professional business logic validation
            if (DEV_CONFIG.ENFORCE_BUSINESS_RULES) {
                const newItem = {
                    type_id: parseInt(id, 10),
                    type: String(type).trim(),
                    position: parseInt(position, 10)
                };
                
                const duplicateCheck = dataUtils.checkDuplicate(listData, newItem);
                if (duplicateCheck) {
                    setErrMsg(`❌ Business Rule Violation: Item "${duplicateCheck.name}" already exists with type "${duplicateCheck.type}" at position ${duplicateCheck.position}.`);
                    setIsLoading(false);
                    return;
                }
            }
            
            // Prepare professional API payload
            const payload = {
                name: String(name).trim(),
                title: String(name).trim(),
                type: String(type).trim(),
                type_id: parseInt(id, 10),
                position: parseInt(position, 10),
                video_id: 0,
                status: "Active",
                // Professional metadata
                created_by: sessionStorage.getItem('userEmail') || 'admin',
                created_at: new Date().toISOString()
            };
            
            devUtils.log('Professional API payload prepared:', payload);
            
            // Use professional API service with proper error handling
            const response = await apiService.create('/admin/home', payload);
            
            devUtils.log('Professional API response received:', response.data);
            
            if (response.status === 201 || response.status === 200) {
                // Professional success handling
                const newItem = response.data.data || response.data;
                
                // Professional data validation
                if (!newItem || !newItem.id) {
                    throw new Error('Invalid response structure from server');
                }
                
                setListData(prev => [...prev, newItem]);
                setErrMsg("✅ Item successfully added to production database");
                
                // Professional user tracking
                if (DEV_CONFIG.TRACK_USER_ACTIONS) {
                    devUtils.log('User action tracked:', {
                        action: 'CREATE_HOME_ITEM',
                        user: sessionStorage.getItem('userEmail'),
                        timestamp: new Date().toISOString(),
                        data: newItem
                    });
                }
                
                // Clear success message after reasonable time
                setTimeout(() => setErrMsg(""), 4000);
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
	      	
	    } catch (error) {
	      	devUtils.error("Professional error handling activated:", error);
	      	
	      	// Professional error handling based on market standards
	      	if (error.standardizedError) {
	      		const { type, userMessage, retryable } = error.standardizedError;
	      		
	      		// Special handling for duplicate items
	      		if (type === 'VALIDATION_ERROR' && userMessage.includes('already exists')) {
	      			setErrMsg(`ℹ️ "${name}" is already in the home page`);
	      		} else {
	      			setErrMsg(`❌ ${userMessage}`);
	      		}
	      		
	      		// Auto-clear non-critical errors
	      		if (type !== 'SERVER_ERROR') {
	      			setTimeout(() => setErrMsg(""), 5000);
	      		}
	      		
	      		// Professional retry suggestion for retryable errors
	      		if (retryable) {
	      			setErrMsg(prev => `${prev} (This error can be retried)`);
	      		}
	      		
	      		// Professional error categorization
	      		switch (type) {
	      			case 'VALIDATION_ERROR':
	      				devUtils.log('Business rule validation failed - user input issue');
	      				break;
	      			case 'UNAUTHORIZED':
	      				devUtils.log('Authentication issue - redirecting to login');
	      				navigate('/', { replace: true });
	      				return;
	      			case 'SERVER_ERROR':
	      				devUtils.log('Server infrastructure issue - ops team notified');
	      				break;
	      			case 'NETWORK_ERROR':
	      				devUtils.log('Network connectivity issue - user environment');
	      				break;
	      		}
	      	} else {
	      		// Handle non-API errors (validation, business logic, etc.)
	      		setErrMsg(`❌ ${error.message}`);
	      	}
	      	
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
		        					<h4 className="text-lg font-semibold text-gray-700">Tags</h4>
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
			              				<TagList 
			              					tags={contents} 
			              					type_id={1} 
			              					handleClick={handleClick} 
			              					className="my-4 flex-wrap" 
			              					existingItems={listData}
			              				/>
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
			              				<TagList 
			              					tags={genres} 
			              					type_id={2} 
			              					handleClick={handleClick} 
			              					className="my-4 flex-wrap" 
			              					existingItems={listData}
			              				/>
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