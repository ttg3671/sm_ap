import { useState, useEffect, Fragment } from "react";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from "react-router-dom";
import { Outer, Navbar, ContentCardList } from "../../components";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useTheme } from '../../contexts/ThemeContext';

const Movies = () => {
    const [contentList, setContentList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");
    const [page, setPage] = useState(1); // Current page
    const [itemsPerPage] = useState(10); // Items per page (can be customized)
    const [totalItems, setTotalItems] = useState(0); // Total items for pagination (renamed from totalPages to be clearer about its API source)
    const [tags, setTags] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();
    const { isGolden, isEmerald } = useTheme();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getSeries = async () => {
            try {
                setIsLoading(true); // Set loading to true before each API call
                const response = await axiosPrivate.get(`/api/v1/admin/movies?pgNo=${page}&page_items=${itemsPerPage}`, {
                    signal: controller.signal,
                });

                // console.log(response.data);

                if (isMounted && response.data?.isSuccess) {
                    setContentList(response.data?.data || []);
                    setPage(response.data?.currentPage || 1);
                    setTotalItems(response.data?.totalPages || 1); // Assuming API returns total pages
                    setIsLoading(false);
                }
            } catch (error) {
                // console.log(error, error.response?.data?.message);
                if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
                    return;
                } else if (error.response?.status === 401) {
                    navigate("/", { state: { from: location }, replace: true });
                } else if (error.response?.status == 400 || error.response) {
                    setErrMsg(error.response?.data?.message);
                    setIsLoading(false);
                    const interval = setTimeout(() => {
                        if (isMounted) setErrMsg("");
                    }, 3000); // Increased timeout to see the error message
                    return () => clearTimeout(interval);
                } else {
                    setErrMsg("Something went wrong.");
                    setIsLoading(false);
                }
            }
        };

        getSeries();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [page]); // Added dependencies for useEffect

    useEffect(() =>{
        let isMounted = true;
        const controller = new AbortController();

        const getSeries = async () => {
            try {
                setIsLoading(true); // Set loading to true before each API call
                const response = await axiosPrivate.get("/api/v1/admin/contents", {
                    signal: controller.signal,
                });

                // console.log(response.data);

                if (isMounted && response.data?.isSuccess) {
                    setTags(response.data?.data|| []);
                    setIsLoading(false);
                }
            } catch (error) {
                // console.log(error, error.response?.data?.message);
                if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
                    return;
                } else if (error.response?.status === 401) {
                    navigate("/", { state: { from: location }, replace: true });
                } else if (error.response?.status == 400 || error.response) {
                    setErrMsg(error.response?.data?.message);
                    setIsLoading(false);
                    const interval = setTimeout(() => {
                        if (isMounted) setErrMsg("");
                    }, 3000); // Increased timeout to see the error message
                    return () => clearTimeout(interval);
                } else {
                    setErrMsg("Something went wrong.");
                    setIsLoading(false);
                }
            }
        };

        getSeries();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    // Handle page change
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

    const handleDelete = async (id, type) => {
        try {
            setIsLoading(true); // Start loading

            let response;
            
            // Check for the type and make appropriate delete request
            if (Number(type) === 1) {
                response = await axiosPrivate.delete(`/api/v1/admin/web-series/${id}`);
            }
            if (Number(type) === 2) {
                response = await axiosPrivate.delete(`/api/v1/admin/movies/${id}`);
            }
            if (Number(type) === 3) {
                response = await axiosPrivate.delete(`/api/v1/admin/episodes/${id}`);
            }

            if (response?.data?.isSuccess) {
                // If deletion was successful, remove the item from the content list
                setContentList((prevContentList) => 
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

    return (
        <Fragment>
            <Outer className="bg-gray-100">
                <Navbar />

                <div className="col-span-full flex flex-col items-center justify-start pt-24 px-4 w-full">
                    <h1 className="text-2xl font-semibold mb-4 text-gray-800 tracking-wide">
                        Movies
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
                        ) : (
                            // Render ContentCardList only if contentList has items
                            contentList.length > 0 ? (
                                contentList.map((content, index) => (
                                <ContentCardList key={index} contentList={content} tagList={tags} handleDelete={handleDelete} />
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-600">
                                No movies found.
                                </div>
                            )
                        )}
                    </div>

                    {/* Pagination Controls - Show only if totalItems is greater than 1, or if you strictly want to show 1,2,3 always */}
                    {totalItems > 1 && ( // Even if totalItems is 1, you might want to show the pagination with page 1 enabled
                        <div className="mt-6 flex items-center justify-center gap-4">
                            <button
                                className={`p-2 rounded-full transition-all duration-200 ${
                                    page === 1 
                                        ? "cursor-not-allowed opacity-50 text-gray-400" 
                                        : isGolden 
                                            ? "text-amber-700 hover:bg-amber-100" 
                                            : isEmerald 
                                                ? "text-emerald-700 hover:bg-emerald-100" 
                                                : "text-gray-800 hover:bg-gray-200"
                                }`}
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
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                                            page === pageNumber 
                                                ? isGolden 
                                                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg" 
                                                    : isEmerald 
                                                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg" 
                                                        : "bg-blue-500 text-white shadow-lg"
                                                : isGolden 
                                                    ? "text-amber-700 hover:bg-amber-100" 
                                                    : isEmerald 
                                                        ? "text-emerald-700 hover:bg-emerald-100" 
                                                        : "text-gray-700 hover:bg-gray-200"
                                        }`}
                                        onClick={() => handlePageChange(pageNumber)}
                                        disabled={pageNumber > totalItems} // Disable if page number exceeds total pages
                                    >
                                        {pageNumber}
                                    </button>
                                ))}
                            </div>

                            <button
                                className={`p-2 rounded-full transition-all duration-200 ${
                                    page === totalItems 
                                        ? "cursor-not-allowed opacity-50 text-gray-400" 
                                        : isGolden 
                                            ? "text-amber-700 hover:bg-amber-100" 
                                            : isEmerald 
                                                ? "text-emerald-700 hover:bg-emerald-100" 
                                                : "text-gray-800 hover:bg-gray-200"
                                }`}
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalItems}
                            >
                                <MdChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </div>
            </Outer>
        </Fragment>
    );
};

export default Movies;