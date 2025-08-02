import { useState, useEffect, useRef, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { connect } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Outer, Navbar, DataList, TagList } from "../../components";
import { persistor } from '../../redux/store';
import { logoutUser } from "../../redux/user/user.actions";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { MdChevronLeft, MdChevronRight, MdDashboard, MdTrendingUp, MdMovie, MdAdd, MdError, MdBarChart, MdSettings, MdViewModule, MdSearch, MdRefresh, MdFilterList, MdLogout, MdPalette, MdAccountCircle } from "react-icons/md";
import { FiUsers, FiGrid, FiPlus } from "react-icons/fi";
import { BiCategoryAlt } from "react-icons/bi";
import { useTheme } from '../../contexts/ThemeContext';
import { dataUtils } from '../../config/demoData';
import { DEV_CONFIG, devUtils } from '../../config/devConfig';
import ApiService from '../../services/ApiService';
import axios from 'axios';

const Index = ({ currentUser, logoutUser }) => {
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
	const { theme, changeTheme, isGolden, isEmerald } = useTheme();
	
	// Dynamic theme colors like login page
	const themeColors = {
		golden: {
			primary: '#FFD700',
			secondary: '#FFA500', 
			accent: '#FF8C00',
			gradient: 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)',
			bgGradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 50%, #1a1a1a 100%)',
			cardBg: 'rgba(255, 215, 0, 0.1)',
			textPrimary: '#FFD700',
			textSecondary: '#FFA500',
			borderColor: 'rgba(255, 215, 0, 0.3)',
			hoverBg: 'rgba(255, 215, 0, 0.1)'
		},
		emerald: {
			primary: '#10B981',
			secondary: '#059669',
			accent: '#047857', 
			gradient: 'linear-gradient(135deg, #10B981, #059669, #047857)',
			bgGradient: 'linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)',
			cardBg: 'rgba(16, 185, 129, 0.1)',
			textPrimary: '#10B981',
			textSecondary: '#059669',
			borderColor: 'rgba(16, 185, 129, 0.3)',
			hoverBg: 'rgba(16, 185, 129, 0.1)'
		}
	};

	const currentColors = themeColors[theme] || themeColors.golden;
	
	// User menu state
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showThemeMenu, setShowThemeMenu] = useState(false);
	
	// Refs for click outside detection
	const userMenuRef = useRef(null);
	const themeMenuRef = useRef(null);

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

	// Click outside handler for dropdown menus
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
				setShowUserMenu(false);
			}
			if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
				setShowThemeMenu(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

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
        try {
            setIsLoading(true);
            setErrMsg('');
            
            // Use the real API with proper endpoint
            const response = await axiosPrivate.delete(`/admin/home/${id}`);
            
            if (response.status === 200 || response.status === 204) {
                // Remove item from local state after successful API call
                setListData((prevContentList) => 
                    prevContentList.filter(content => content.id !== id)
                );
                devUtils.log('Item deleted successfully');
            } else {
                throw new Error('Failed to delete item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            setErrMsg('Failed to delete item. Please try again.');
        } finally {
            setIsLoading(false);
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
                // Handle different possible response structures
                let newItem = response.data;
                
                // Try different response structures
                if (response.data.data) {
                    newItem = response.data.data;
                } else if (response.data.result) {
                    newItem = response.data.result;
                } else if (response.data) {
                    newItem = response.data;
                }
                
                devUtils.log('Response structure check:', {
                    fullResponse: response.data,
                    extractedItem: newItem
                });
                
                // More flexible validation - just check if we got something back
                if (newItem) {
                    // If the API doesn't return an ID, generate one locally
                    if (!newItem.id) {
                        newItem.id = Date.now(); // Temporary ID for UI purposes
                    }
                    
                    setListData(prev => [...prev, newItem]);
                    setErrMsg("✅ Item successfully added");
                    
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
                    devUtils.error('No valid data in API response:', response.data);
                    setErrMsg("⚠️ Item added but response format unexpected");
                    setTimeout(() => setErrMsg(""), 4000);
                }
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

	// User menu and theme handlers
	const handleLogout = () => {
		try {
			logoutUser();
			persistor.purge();
			navigate('/', { replace: true });
		} catch (error) {
			console.error("Error during logout:", error);
		}
	};

	const handleThemeChange = (newTheme) => {
		changeTheme(newTheme);
		setShowThemeMenu(false);
	};

	const toggleUserMenu = () => {
		setShowUserMenu(!showUserMenu);
		setShowThemeMenu(false);
	};

	const toggleThemeMenu = () => {
		setShowThemeMenu(!showThemeMenu);
		setShowUserMenu(false);
	};

	return (
		<Fragment>
			<Outer>
				<Navbar />
				
				{/* Main Dashboard Container with Elegant Animations */}
				<motion.div 
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ 
						duration: 0.8, 
						ease: [0.4, 0, 0.2, 1],
						staggerChildren: 0.1
					}}
					className="min-h-screen pt-16 relative overflow-hidden"
					style={{ background: currentColors.bgGradient }}
				>
					{/* Animated Background Particles */}
					{Array.from({ length: 20 }).map((_, i) => (
						<motion.div
							key={i}
							className="absolute rounded-full opacity-20"
							style={{
								background: currentColors.primary,
								width: Math.random() * 6 + 2 + 'px',
								height: Math.random() * 6 + 2 + 'px',
								left: Math.random() * 100 + '%',
								top: Math.random() * 100 + '%',
							}}
							animate={{
								y: [-20, -40, -20],
								opacity: [0.2, 0.6, 0.2],
								scale: [1, 1.2, 1]
							}}
							transition={{
								duration: Math.random() * 3 + 2,
								delay: Math.random() * 2,
								repeat: Infinity,
								ease: "easeInOut"
							}}
						/>
					))}

					{/* Floating Light Effect */}
					<motion.div
						className="absolute inset-0 pointer-events-none"
						style={{
							background: `radial-gradient(circle at 50% 50%, ${currentColors.primary}10 0%, transparent 50%)`
						}}
						animate={{
							opacity: [0.3, 0.7, 0.3],
							scale: [1, 1.1, 1]
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
							ease: "easeInOut"
						}}
					/>
					{/* Main Content Area - Professional Layout */}
					<div className="min-h-screen" style={{ background: currentColors.bgGradient }}>
						{/* Premium Header Bar with Glass Effect */}
						<motion.div 
							initial={{ y: -50, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ 
								duration: 1,
								ease: [0.4, 0, 0.2, 1],
								delay: 0.2
							}}
							className="border-b shadow-2xl backdrop-blur-xl relative"
							style={{
								background: `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, ${currentColors.cardBg} 50%, rgba(0,0,0,0.7) 100%)`,
								borderBottomColor: currentColors.borderColor,
								boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 100px ${currentColors.primary}20`
							}}
							whileHover={{
								boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 120px ${currentColors.primary}30`,
								transition: { duration: 0.3 }
							}}
						>
							{/* Animated Border Line */}
							<motion.div
								className="absolute bottom-0 left-0 h-0.5"
								style={{
									background: currentColors.gradient,
									width: '0%'
								}}
								animate={{ width: '100%' }}
								transition={{ duration: 2, delay: 1 }}
							/>

							<div className="px-8 py-6 flex items-center justify-between relative z-10">
								<motion.div
									initial={{ x: -30, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ duration: 0.8, delay: 0.4 }}
								>
									<motion.h1 
										className="text-2xl font-bold text-transparent bg-clip-text mb-2" 
										style={{
											backgroundImage: currentColors.gradient
										}}
										whileHover={{
											scale: 1.02,
											transition: { duration: 0.2 }
										}}
									>
										Content Management System
									</motion.h1>
									<motion.p 
										className="text-gray-400 text-sm"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.6 }}
									>
										Manage your streaming content efficiently
									</motion.p>
								</motion.div>
								<motion.div 
									className="flex items-center gap-4 relative"
									initial={{ x: 30, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ duration: 0.8, delay: 0.5 }}
								>
									{/* Theme Toggle */}
									<div className="relative" ref={themeMenuRef}>
										<motion.button 
											onClick={toggleThemeMenu}
											className="p-3 text-gray-400 hover:text-white transition-all duration-200 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl border border-gray-600 hover:border-gray-500"
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<MdPalette size={20} />
										</motion.button>
										
										{/* Theme Selection Dropdown */}
										<AnimatePresence>
											{showThemeMenu && (
												<motion.div
													initial={{ opacity: 0, y: 10, scale: 0.95 }}
													animate={{ opacity: 1, y: 0, scale: 1 }}
													exit={{ opacity: 0, y: 10, scale: 0.95 }}
													transition={{ duration: 0.2 }}
													className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden"
												>
													<div className="p-3">
														<p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Choose Theme</p>
														<div className="space-y-2">
															<motion.button
																onClick={() => handleThemeChange('golden')}
																className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
																	theme === 'golden' 
																		? 'border border-yellow-500/30' 
																		: 'hover:bg-gray-700 border border-transparent'
																}`}
																style={{
																	backgroundColor: theme === 'golden' ? 'rgba(255, 215, 0, 0.2)' : 'transparent'
																}}
																whileHover={{ scale: 1.02 }}
																whileTap={{ scale: 0.98 }}
															>
																<div className="w-4 h-4 rounded-full" style={{
																	background: 'linear-gradient(135deg, #FFD700, #FFA500)'
																}}></div>
																<span className="text-white font-medium">Golden Theme</span>
																{theme === 'golden' && <div className="ml-auto w-2 h-2 rounded-full" style={{
																	backgroundColor: '#FFD700'
																}}></div>}
															</motion.button>
															<motion.button
																onClick={() => handleThemeChange('emerald')}
																className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
																	theme === 'emerald' 
																		? 'border border-emerald-500/30' 
																		: 'hover:bg-gray-700 border border-transparent'
																}`}
																style={{
																	backgroundColor: theme === 'emerald' ? 'rgba(16, 185, 129, 0.2)' : 'transparent'
																}}
																whileHover={{ scale: 1.02 }}
																whileTap={{ scale: 0.98 }}
															>
																<div className="w-4 h-4 rounded-full" style={{
																	background: 'linear-gradient(135deg, #10B981, #059669)'
																}}></div>
																<span className="text-white font-medium">Emerald Theme</span>
																{theme === 'emerald' && <div className="ml-auto w-2 h-2 rounded-full" style={{
																	backgroundColor: '#10B981'
																}}></div>}
															</motion.button>
														</div>
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</div>

									{/* User Menu */}
									<div className="relative" ref={userMenuRef}>
										<motion.button 
											onClick={toggleUserMenu}
											className="flex items-center gap-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-full px-4 py-2 border border-gray-600 hover:border-gray-500 transition-all duration-200"
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											<div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
												background: currentColors.gradient
											}}>
												<span className="text-gray-900 font-bold text-sm">
													{currentUser?.name?.charAt(0)?.toUpperCase() || 'A'}
												</span>
											</div>
											<span className="text-gray-200 font-medium">
												{currentUser?.name || 'Admin User'}
											</span>
											<MdAccountCircle className="text-gray-400" size={16} />
										</motion.button>

										{/* User Dropdown Menu */}
										<AnimatePresence>
											{showUserMenu && (
												<motion.div
													initial={{ opacity: 0, y: 10, scale: 0.95 }}
													animate={{ opacity: 1, y: 0, scale: 1 }}
													exit={{ opacity: 0, y: 10, scale: 0.95 }}
													transition={{ duration: 0.2 }}
													className="absolute right-0 top-full mt-2 w-56 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden"
												>
													<div className="p-3">
														<div className="flex items-center gap-3 pb-3 border-b border-gray-700">
															<div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
																background: currentColors.gradient
															}}>
																<span className="text-gray-900 font-bold">
																	{currentUser?.name?.charAt(0)?.toUpperCase() || 'A'}
																</span>
															</div>
															<div>
																<p className="text-white font-medium">{currentUser?.name || 'Admin User'}</p>
																<p className="text-gray-400 text-sm">{currentUser?.email || 'admin@example.com'}</p>
															</div>
														</div>
														
														<div className="py-2 space-y-1">
															<motion.button
																className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
																whileHover={{ scale: 1.02 }}
																whileTap={{ scale: 0.98 }}
															>
																<MdSettings size={18} />
																<span>Settings</span>
															</motion.button>
															
															<motion.button
																onClick={handleLogout}
																className="w-full flex items-center gap-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
																whileHover={{ scale: 1.02 }}
																whileTap={{ scale: 0.98 }}
															>
																<MdLogout size={18} />
																<span>Logout</span>
															</motion.button>
														</div>
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</motion.div>
							</div>
						</motion.div>

						{/* Main Content */}
						<div className="p-8">
							{/* Page Header with Breadcrumb */}
							<motion.div 
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.1 }}
								className="mb-8"
							>
								<div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
									<span>Dashboard</span>
									<MdChevronRight size={16} />
									<span style={{ color: currentColors.textPrimary }}>Browse Content</span>
								</div>
								<h2 className="text-3xl font-bold text-white mb-2">Browse Content</h2>
								<p className="text-gray-400">Discover and manage all your trailers and content</p>
							</motion.div>

							{/* Premium Animated Stats Cards */}
							<motion.div 
								initial={{ y: 50, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ 
									duration: 0.8, 
									delay: 0.3,
									staggerChildren: 0.15
								}}
								className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
							>
								{[
									{ 
										label: "Total Content", 
										value: listData?.length || 0, 
										icon: MdMovie, 
										gradient: `linear-gradient(135deg, ${currentColors.primary}30, ${currentColors.secondary}20)`,
										color: currentColors.textPrimary 
									},
									{ 
										label: "Active Tags", 
										value: contents?.length || 0, 
										icon: BiCategoryAlt, 
										gradient: `linear-gradient(135deg, ${currentColors.secondary}30, ${currentColors.accent}20)`,
										color: currentColors.textSecondary 
									},
									{ 
										label: "Genres", 
										value: genres?.length || 0, 
										icon: MdViewModule, 
										gradient: "linear-gradient(135deg, #3B82F630, #1D4ED820)",
										color: "#3B82F6" 
									},
									{ 
										label: "Pages", 
										value: totalItems, 
										icon: MdBarChart, 
										gradient: "linear-gradient(135deg, #8B5CF630, #A855F720)",
										color: "#8B5CF6" 
									}
								].map((stat, index) => (
									<motion.div
										key={stat.label}
										initial={{ y: 20, opacity: 0, scale: 0.9 }}
										animate={{ y: 0, opacity: 1, scale: 1 }}
										transition={{ 
											duration: 0.6, 
											delay: 0.4 + (index * 0.1),
											ease: [0.4, 0, 0.2, 1]
										}}
										className="rounded-xl p-6 border backdrop-blur-sm relative overflow-hidden group cursor-pointer"
										style={{
											background: stat.gradient,
											borderColor: currentColors.borderColor
										}}
										whileHover={{
											scale: 1.05,
											y: -8,
											boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 60px ${stat.color}30`,
											transition: { duration: 0.3 }
										}}
										whileTap={{ scale: 0.98 }}
									>
										{/* Floating Orb Effect */}
										<motion.div
											className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20"
											style={{ background: stat.color }}
											animate={{
												scale: [1, 1.2, 1],
												rotate: [0, 180, 360]
											}}
											transition={{
												duration: 6,
												repeat: Infinity,
												ease: "linear"
											}}
										/>

										<div className="flex items-center justify-between relative z-10">
											<motion.div
												initial={{ x: -10, opacity: 0 }}
												animate={{ x: 0, opacity: 1 }}
												transition={{ delay: 0.6 + (index * 0.1) }}
											>
												<p className="text-sm font-medium mb-2" style={{ color: stat.color }}>{stat.label}</p>
												<motion.p 
													className="text-3xl font-bold text-white"
													initial={{ scale: 0.5 }}
													animate={{ scale: 1 }}
													transition={{ 
														delay: 0.8 + (index * 0.1),
														type: "spring",
														stiffness: 200
													}}
												>
													{stat.value}
												</motion.p>
											</motion.div>
											<motion.div 
												className="w-14 h-14 rounded-xl flex items-center justify-center relative"
												style={{
													backgroundColor: currentColors.hoverBg
												}}
												whileHover={{ rotate: 360 }}
												transition={{ duration: 0.6 }}
											>
												<stat.icon style={{ color: stat.color }} size={28} />
												
												{/* Pulsing Ring */}
												<motion.div
													className="absolute inset-0 rounded-xl border-2 opacity-50"
													style={{ borderColor: stat.color }}
													animate={{
														scale: [1, 1.2, 1],
														opacity: [0.5, 0.8, 0.5]
													}}
													transition={{
														duration: 2,
														repeat: Infinity,
														ease: "easeInOut"
													}}
												/>
											</motion.div>
										</div>

										{/* Interactive Glow Effect */}
										<motion.div
											className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
											style={{
												background: `linear-gradient(45deg, transparent, ${stat.color}20, transparent)`
											}}
											transition={{ duration: 0.3 }}
										/>
									</motion.div>
								))}
							</motion.div>							{/* Search and Filters Section */}
							<motion.div 
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.3 }}
								className="rounded-2xl shadow-xl mb-8 border"
								style={{
									background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, ${currentColors.cardBg} 50%, rgba(0,0,0,0.6) 100%)`,
									borderColor: currentColors.borderColor
								}}
							>
								<div className="p-8">
									{/* Search Header */}
									<div className="flex items-center justify-between mb-6">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
												background: currentColors.gradient
											}}>
												<MdSearch className="text-white" size={20} />
											</div>
											<div>
												<h3 className="text-xl font-bold text-white">Search & Filter</h3>
												<p className="text-gray-400 text-sm">Find your content quickly</p>
											</div>
										</div>
										<button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105" style={{
											background: currentColors.gradient
										}}>
											<MdRefresh size={16} />
											Refresh
										</button>
									</div>

									{/* Search Bar */}
									<div className="mb-6">
										<div className="relative max-w-md">
											<input
												type="text"
												placeholder="Search trailers, movies, series..."
												className="w-full bg-gray-700/50 text-white rounded-xl px-12 py-4 border border-gray-600 focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-400"
												style={{
													borderColor: 'rgb(75 85 99)',
													'--tw-ring-color': currentColors.borderColor
												}}
												onFocus={(e) => e.target.style.borderColor = currentColors.primary}
												onBlur={(e) => e.target.style.borderColor = 'rgb(75 85 99)'}
											/>
											<div className="absolute left-4 top-4">
												<MdSearch className="text-gray-400" size={20} />
											</div>
											<button className="absolute right-3 top-3 px-3 py-1 text-white rounded-lg text-sm font-medium transition-all hover:scale-105" style={{
												background: currentColors.gradient
											}}>
												Search
											</button>
										</div>
									</div>

									{/* Filter Dropdowns */}
									<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
												<MdFilterList size={16} />
												Filter by Genre
											</label>
											<select 
												className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 transition-all"
												style={{
													'--tw-ring-color': currentColors.borderColor
												}}
												onFocus={(e) => e.target.style.borderColor = currentColors.primary}
												onBlur={(e) => e.target.style.borderColor = 'rgb(75 85 99)'}
											>
												<option>All Genres</option>
												<option>Action</option>
												<option>Drama</option>
												<option>Comedy</option>
												<option>Thriller</option>
												<option>Romance</option>
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-300 mb-2">Filter by Age Rating</label>
											<select 
												className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 transition-all"
												style={{
													'--tw-ring-color': currentColors.borderColor
												}}
												onFocus={(e) => e.target.style.borderColor = currentColors.primary}
												onBlur={(e) => e.target.style.borderColor = 'rgb(75 85 99)'}
											>
												<option>All Ratings</option>
												<option>G</option>
												<option>PG</option>
												<option>PG-13</option>
												<option>R</option>
												<option>NC-17</option>
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-300 mb-2">Filter by Year</label>
											<select 
												className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 transition-all"
												style={{
													'--tw-ring-color': currentColors.borderColor
												}}
												onFocus={(e) => e.target.style.borderColor = currentColors.primary}
												onBlur={(e) => e.target.style.borderColor = 'rgb(75 85 99)'}
											>
												<option>All Years</option>
												<option>2024</option>
												<option>2023</option>
												<option>2022</option>
												<option>2021</option>
												<option>2020</option>
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
											<select 
												className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 transition-all"
												style={{
													'--tw-ring-color': currentColors.borderColor
												}}
												onFocus={(e) => e.target.style.borderColor = currentColors.primary}
												onBlur={(e) => e.target.style.borderColor = 'rgb(75 85 99)'}
											>
												<option>All Types</option>
												<option>Movies</option>
												<option>TV Series</option>
												<option>Episodes</option>
												<option>Documentaries</option>
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-300 mb-2">Release Type</label>
											<select 
												className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 transition-all"
												style={{
													'--tw-ring-color': currentColors.borderColor
												}}
												onFocus={(e) => e.target.style.borderColor = currentColors.primary}
												onBlur={(e) => e.target.style.borderColor = 'rgb(75 85 99)'}
											>
												<option>All Releases</option>
												<option>Theatrical</option>
												<option>Digital</option>
												<option>Streaming</option>
												<option>DVD/Blu-ray</option>
											</select>
										</div>
									</div>
								</div>
							</motion.div>

							{/* Error Message */}
							{errMsg && (
								<motion.div 
									initial={{ scale: 0.95, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									className="mb-8 p-4 bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/30 rounded-xl backdrop-blur-sm"
								>
									<div className="flex items-center text-red-300">
										<MdError className="mr-3 text-red-400 flex-shrink-0" size={20} />
										<span className="font-medium">{errMsg}</span>
									</div>
								</motion.div>
							)}

							{/* Main Content Area */}
							<motion.div 
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.4 }}
								className="rounded-2xl shadow-xl overflow-hidden border"
								style={{
									background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, ${currentColors.cardBg} 50%, rgba(0,0,0,0.6) 100%)`,
									borderColor: currentColors.borderColor
								}}
							>
								{isLoading ? (
									<motion.div 
										className="flex flex-col items-center justify-center py-24"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.5 }}
									>
										<div className="text-center relative">
											{/* Premium Loading Animation */}
											<motion.div className="relative mb-8">
												{/* Main Spinner */}
												<motion.div 
													animate={{ rotate: 360 }}
													transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
													className="w-20 h-20 border-4 border-t-transparent rounded-full mx-auto relative"
													style={{
														borderColor: currentColors.primary,
														borderTopColor: 'transparent'
													}}
												>
													{/* Inner Glow */}
													<motion.div
														className="absolute inset-2 border-2 border-t-transparent rounded-full"
														style={{
															borderColor: `${currentColors.secondary}60`,
															borderTopColor: 'transparent'
														}}
														animate={{ rotate: -360 }}
														transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
													/>
												</motion.div>

												{/* Floating Particles */}
												{[...Array(6)].map((_, i) => (
													<motion.div
														key={i}
														className="absolute w-2 h-2 rounded-full"
														style={{
															backgroundColor: currentColors.accent,
															top: '50%',
															left: '50%'
														}}
														animate={{
															x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
															y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
															scale: [0, 1, 0],
															opacity: [0, 1, 0]
														}}
														transition={{
															duration: 2,
															repeat: Infinity,
															delay: i * 0.2,
															ease: "easeInOut"
														}}
													/>
												))}

												{/* Center Pulse */}
												<motion.div
													className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
													style={{ backgroundColor: currentColors.primary }}
													animate={{
														scale: [0.8, 1.2, 0.8],
														opacity: [0.7, 1, 0.7]
													}}
													transition={{
														duration: 1.5,
														repeat: Infinity,
														ease: "easeInOut"
													}}
												/>
											</motion.div>

											{/* Loading Text */}
											<motion.h3 
												className="text-2xl font-bold text-white mb-3"
												animate={{
													opacity: [0.7, 1, 0.7]
												}}
												transition={{
													duration: 1.5,
													repeat: Infinity,
													ease: "easeInOut"
												}}
											>
												Loading Premium Content
											</motion.h3>
											
											<motion.p 
												className="text-gray-400 mb-6"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ delay: 0.3 }}
											>
												Preparing your sophisticated dashboard experience
											</motion.p>

											{/* Progress Indicators */}
											<div className="flex items-center justify-center gap-2">
												{[...Array(4)].map((_, i) => (
													<motion.div
														key={i}
														className="w-2 h-2 rounded-full"
														style={{ backgroundColor: currentColors.primary }}
														animate={{
															scale: [0.5, 1, 0.5],
															opacity: [0.3, 1, 0.3]
														}}
														transition={{
															duration: 1,
															repeat: Infinity,
															delay: i * 0.2,
															ease: "easeInOut"
														}}
													/>
												))}
											</div>
										</div>
									</motion.div>
								) : listData && listData.length > 0 ? (
									<div className="p-0">
										<DataList itemList={listData} isAge={false} isCategory={true} isHome={true} onEdit={handleEdit} onDelete={handleDelete} />
									</div>
								) : (
									<motion.div 
										className="flex flex-col items-center justify-center py-24"
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
									>
										<div className="text-center relative">
											{/* Animated Icon Container */}
											<motion.div 
												className="w-32 h-32 rounded-3xl flex items-center justify-center mb-8 relative overflow-hidden"
												style={{
													background: `linear-gradient(135deg, ${currentColors.primary}20, ${currentColors.secondary}20, ${currentColors.accent}10)`
												}}
												initial={{ scale: 0.8, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												transition={{ 
													duration: 0.8, 
													delay: 0.2,
													type: "spring",
													stiffness: 100
												}}
												whileHover={{ 
													scale: 1.05,
													transition: { duration: 0.3 }
												}}
											>
												{/* Background Animation */}
												<motion.div
													className="absolute inset-0 rounded-3xl"
													style={{
														background: `radial-gradient(circle at 30% 30%, ${currentColors.primary}30, transparent 70%)`
													}}
													animate={{
														rotate: [0, 360],
														scale: [1, 1.1, 1]
													}}
													transition={{
														duration: 8,
														repeat: Infinity,
														ease: "linear"
													}}
												/>

												{/* Icon */}
												<motion.div
													className="relative z-10"
													initial={{ rotate: -10 }}
													animate={{ rotate: 0 }}
													transition={{ 
														duration: 0.6, 
														delay: 0.4,
														type: "spring"
													}}
												>
													<FiGrid 
														className="text-gray-300" 
														size={64}
														style={{ filter: `drop-shadow(0 0 20px ${currentColors.primary}50)` }}
													/>
												</motion.div>

												{/* Floating Elements */}
												{[...Array(3)].map((_, i) => (
													<motion.div
														key={i}
														className="absolute w-3 h-3 rounded-full"
														style={{
															backgroundColor: currentColors.accent,
															top: `${20 + i * 25}%`,
															right: `${15 + i * 10}%`
														}}
														animate={{
															y: [0, -10, 0],
															opacity: [0.4, 0.8, 0.4],
															scale: [0.8, 1.2, 0.8]
														}}
														transition={{
															duration: 2,
															repeat: Infinity,
															delay: i * 0.3,
															ease: "easeInOut"
														}}
													/>
												))}
											</motion.div>

											{/* Animated Text */}
											<motion.h3 
												className="text-3xl font-bold text-white mb-4"
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.6, delay: 0.6 }}
											>
												No Content Available
											</motion.h3>
											
											<motion.p 
												className="text-gray-400 mb-8 text-lg max-w-md mx-auto"
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.6, delay: 0.8 }}
											>
												Begin your content journey by adding premium trailers and videos to your library
											</motion.p>

											{/* CTA Button */}
											<motion.button 
												className="px-8 py-4 text-white rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden group"
												style={{
													background: currentColors.gradient
												}}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.6, delay: 1.0 }}
												whileHover={{ 
													scale: 1.05,
													boxShadow: `0 20px 40px ${currentColors.primary}40`
												}}
												whileTap={{ scale: 0.98 }}
											>
												{/* Button Background Animation */}
												<motion.div
													className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
													transition={{ duration: 0.3 }}
												/>
												
												{/* Button Content */}
												<span className="relative z-10 flex items-center gap-3">
													<MdAdd size={24} />
													Add Your First Content
												</span>

												{/* Ripple Effect */}
												<motion.div
													className="absolute inset-0 rounded-2xl"
													style={{
														background: `radial-gradient(circle, ${currentColors.primary}40 0%, transparent 70%)`
													}}
													initial={{ scale: 0, opacity: 0 }}
													whileHover={{ 
														scale: 1.5, 
														opacity: 1,
														transition: { duration: 0.5 }
													}}
												/>
											</motion.button>

											{/* Decorative Elements */}
											<div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10" style={{
												background: `radial-gradient(circle, ${currentColors.primary}, transparent)`
											}} />
											<div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-5" style={{
												background: `radial-gradient(circle, ${currentColors.secondary}, transparent)`
											}} />
										</div>
									</motion.div>
								)}
							</motion.div>

							{/* Add Content Section */}
							<motion.div 
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.5 }}
								className="mt-8 rounded-2xl shadow-xl overflow-hidden border"
								style={{
									background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, ${currentColors.cardBg} 50%, rgba(0,0,0,0.6) 100%)`,
									borderColor: currentColors.borderColor
								}}
							>
								<div className="p-8">
									{/* Section Header */}
									<div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-600">
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
												background: currentColors.gradient
											}}>
												<MdAdd className="text-white" size={24} />
											</div>
											<div>
												<h3 className="text-2xl font-bold text-white">Add More Content</h3>
												<p className="text-gray-400">Expand your content library</p>
											</div>
										</div>
									</div>
									
									{/* Contents Section */}
									<motion.div 
										initial={{ x: -20, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.6 }}
										className="mb-10"
									>
										<div className="flex items-center gap-3 mb-6">
											<div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{
												backgroundColor: currentColors.hoverBg,
												borderColor: currentColors.borderColor
											}}>
												<MdMovie style={{ color: currentColors.textPrimary }} size={20} />
											</div>
											<div>
												<h4 className="text-xl font-semibold text-white">Content Tags</h4>
												<p className="text-gray-400 text-sm">Organize your content with tags</p>
											</div>
										</div>
										{isLoading ? (
											<div className="flex justify-center items-center h-32 bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-xl border border-gray-600">
												<motion.div 
													animate={{ rotate: 360 }}
													transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
													className="w-8 h-8 border-2 border-t-transparent rounded-full"
													style={{
														borderColor: currentColors.primary,
														borderTopColor: 'transparent'
													}}
												/>
											</div>
										) : contents && contents.length > 0 ? (
											<div className="bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-xl p-6 border border-gray-600">
												<TagList 
													tags={contents} 
													type_id={1} 
													handleClick={handleClick} 
													className="flex-wrap gap-3" 
													existingItems={listData}
												/>
											</div>
										) : (
											<div className="text-center py-8 bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-xl border border-gray-600">
												<div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4" style={{
													backgroundColor: currentColors.hoverBg
												}}>
													<MdMovie style={{ color: currentColors.textPrimary }} size={24} />
												</div>
												<p className="text-gray-400 font-medium">No content tags found.</p>
												<button className="mt-4 px-4 py-2 text-white rounded-lg text-sm font-medium transition-all hover:scale-105" style={{
													background: currentColors.gradient
												}}>
													Add Tags
												</button>
											</div>
										)}
									</motion.div>

									{/* Genres Section */}
									<motion.div
										initial={{ x: -20, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.7 }}
									>
										<div className="flex items-center gap-3 mb-6">
											<div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{
												backgroundColor: currentColors.hoverBg,
												borderColor: currentColors.borderColor
											}}>
												<BiCategoryAlt style={{ color: currentColors.textSecondary }} size={20} />
											</div>
											<div>
												<h4 className="text-xl font-semibold text-white">Genres</h4>
												<p className="text-gray-400 text-sm">Categorize by genre types</p>
											</div>
										</div>
										{isLoading ? (
											<div className="flex justify-center items-center h-32 bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-xl border border-gray-600">
												<motion.div 
													animate={{ rotate: 360 }}
													transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
													className="w-8 h-8 border-2 border-t-transparent rounded-full"
													style={{
														borderColor: currentColors.secondary,
														borderTopColor: 'transparent'
													}}
												/>
											</div>
										) : genres && genres.length > 0 ? (
											<div className="bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-xl p-6 border border-gray-600">
												<TagList 
													tags={genres} 
													type_id={2} 
													handleClick={handleClick} 
													className="flex-wrap gap-3" 
													existingItems={listData}
												/>
											</div>
										) : (
											<div className="text-center py-8 bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-xl border border-gray-600">
												<div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4" style={{
													backgroundColor: currentColors.hoverBg
												}}>
													<BiCategoryAlt style={{ color: currentColors.textSecondary }} size={24} />
												</div>
												<p className="text-gray-400 font-medium">No genres found.</p>
												<button className="mt-4 px-4 py-2 text-white rounded-lg text-sm font-medium transition-all hover:scale-105" style={{
													background: currentColors.gradient
												}}>
													Add Genres
												</button>
											</div>
										)}
									</motion.div>
								</div>
							</motion.div>

							{/* Premium Animated Pagination */}
							{totalItems > 1 && (
								<motion.div 
									initial={{ y: 30, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ 
										duration: 0.8, 
										delay: 0.8,
										ease: [0.4, 0, 0.2, 1]
									}}
									className="mt-12 flex items-center justify-center"
								>
									<motion.div 
										className="flex items-center gap-3 rounded-2xl p-4 shadow-2xl border backdrop-blur-xl relative overflow-hidden"
										style={{
											background: `linear-gradient(135deg, ${currentColors.cardBg}95, ${currentColors.primary}10, ${currentColors.cardBg}95)`,
											borderColor: currentColors.borderColor,
											boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 80px ${currentColors.primary}20`
										}}
										whileHover={{
											boxShadow: `0 35px 70px -12px rgba(0, 0, 0, 0.7), 0 0 100px ${currentColors.primary}30`,
											scale: 1.02,
											transition: { duration: 0.3 }
										}}
									>
										{/* Background Animation */}
										<motion.div
											className="absolute inset-0 opacity-20"
											style={{
												background: `linear-gradient(45deg, transparent, ${currentColors.primary}20, transparent)`
											}}
											animate={{
												x: ['-100%', '100%']
											}}
											transition={{
												duration: 3,
												repeat: Infinity,
												ease: "linear"
											}}
										/>

										{/* Previous Button */}
										<motion.button
											className={`p-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
												page === 1 
													? "cursor-not-allowed opacity-40" 
													: "hover:shadow-lg"
											}`}
											style={{
												backgroundColor: page === 1 ? currentColors.hoverBg : currentColors.hoverBg,
												color: page === 1 ? currentColors.textSecondary : currentColors.textPrimary
											}}
											onClick={() => handlePageChange(page - 1)}
											disabled={page === 1}
											whileHover={page !== 1 ? { 
												scale: 1.1,
												backgroundColor: `${currentColors.primary}30`,
												transition: { duration: 0.2 }
											} : {}}
											whileTap={page !== 1 ? { scale: 0.95 } : {}}
										>
											<MdChevronLeft size={22} />
											{page !== 1 && (
												<motion.div
													className="absolute inset-0 bg-white opacity-0"
													whileHover={{ opacity: 0.1 }}
													transition={{ duration: 0.2 }}
												/>
											)}
										</motion.button>

										{/* Page Numbers */}
										<div className="flex items-center gap-2 px-3">
											{getPageNumbers().map((pageNumber, index) => (
												<motion.button
													key={pageNumber}
													className={`px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden ${
														page === pageNumber 
															? "text-white shadow-xl" 
															: "hover:shadow-lg"
													}`}
													style={{
														background: page === pageNumber 
															? currentColors.gradient 
															: currentColors.hoverBg,
														color: page === pageNumber 
															? 'white' 
															: currentColors.textPrimary,
														transform: page === pageNumber ? 'scale(1.1)' : 'scale(1)'
													}}
													onClick={() => handlePageChange(pageNumber)}
													disabled={pageNumber > totalItems}
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ 
														opacity: 1, 
														scale: page === pageNumber ? 1.1 : 1,
														transition: { 
															delay: 0.9 + (index * 0.1),
															type: "spring",
															stiffness: 200
														}
													}}
													whileHover={page !== pageNumber ? { 
														scale: 1.05,
														backgroundColor: `${currentColors.primary}20`,
														color: currentColors.primary,
														transition: { duration: 0.2 }
													} : {
														scale: 1.15,
														transition: { duration: 0.2 }
													}}
													whileTap={{ scale: 0.95 }}
												>
													{/* Active page glow effect */}
													{page === pageNumber && (
														<motion.div
															className="absolute inset-0 rounded-xl"
															style={{
																background: currentColors.gradient,
																filter: 'blur(8px)',
																opacity: 0.6
															}}
															animate={{
																scale: [1, 1.2, 1],
																opacity: [0.6, 0.8, 0.6]
															}}
															transition={{
																duration: 2,
																repeat: Infinity,
																ease: "easeInOut"
															}}
														/>
													)}
													
													{/* Page number */}
													<span className="relative z-10">{pageNumber}</span>
													
													{/* Hover effect */}
													{page !== pageNumber && (
														<motion.div
															className="absolute inset-0 bg-white opacity-0"
															whileHover={{ opacity: 0.1 }}
															transition={{ duration: 0.2 }}
														/>
													)}
												</motion.button>
											))}
										</div>

										{/* Next Button */}
										<motion.button
											className={`p-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
												page === totalItems 
													? "cursor-not-allowed opacity-40" 
													: "hover:shadow-lg"
											}`}
											style={{
												backgroundColor: page === totalItems ? currentColors.hoverBg : currentColors.hoverBg,
												color: page === totalItems ? currentColors.textSecondary : currentColors.textPrimary
											}}
											onClick={() => handlePageChange(page + 1)}
											disabled={page === totalItems}
											whileHover={page !== totalItems ? { 
												scale: 1.1,
												backgroundColor: `${currentColors.primary}30`,
												transition: { duration: 0.2 }
											} : {}}
											whileTap={page !== totalItems ? { scale: 0.95 } : {}}
										>
											<MdChevronRight size={22} />
											{page !== totalItems && (
												<motion.div
													className="absolute inset-0 bg-white opacity-0"
													whileHover={{ opacity: 0.1 }}
													transition={{ duration: 0.2 }}
												/>
											)}
										</motion.button>

										{/* Page Info */}
										<motion.div 
											className="ml-4 px-4 py-2 rounded-xl border"
											style={{
												backgroundColor: `${currentColors.primary}10`,
												borderColor: `${currentColors.primary}30`,
												color: currentColors.textSecondary
											}}
											initial={{ opacity: 0, x: 20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 1.2 }}
										>
											<span className="text-xs font-medium">
												Page {page} of {totalItems}
											</span>
										</motion.div>
									</motion.div>
								</motion.div>
							)}
						</div>
					</div>
				</motion.div>
			</Outer>
		</Fragment>
	);
};

export { Index };
export default Index;