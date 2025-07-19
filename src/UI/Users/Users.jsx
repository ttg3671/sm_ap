import { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Outer, Navbar, DataList } from "../../components";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const Users = () => {
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const [page, setPage] = useState(1); // Current page
  const [itemsPerPage] = useState(10); // Items per page (can be customized)
  const [totalItems, setTotalItems] = useState(0); 

  const navigate = useNavigate();
  const location = useLocation();

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    setIsLoading(true);

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(`/api/v1/admin/users?pgNo=${page}&page_items=${itemsPerPage}`, {
          signal: controller.signal,
        });

        // console.log(response.data?.currentPage);

        if (isMounted && response.data?.isSuccess) {
          setListData(response.data?.data || []);
          setPage(response.data?.currentPage || 1);
          setTotalItems(response.data?.totalPages || 1);
          setIsLoading(false);
        }
      } catch (error) {
        if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          return;
        } else if (error.response?.status === 401) {
          navigate("/", { state: { from: location }, replace: true });
        } else if (error.response?.status === 400 || error.response) {
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

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
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

  return (
    <Fragment>
      <Outer className="bg-gray-100">
        <Navbar />

        <div className="col-span-full flex flex-col items-center justify-start pt-24 px-4 w-full">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800 tracking-wide">
            USERS
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
              <DataList itemList={listData} isAge={false} isCategory={true} isHome={false} isUser={true} />
            ) : (
              <div className="text-center py-10 text-gray-500">
                No users found.
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
  );
};

export default Users;