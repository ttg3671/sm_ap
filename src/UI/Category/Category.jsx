import { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Outer, Navbar, DataList } from "../../components";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const Category = () => {
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getCategory = async () => {
      try {
        const response = await axiosPrivate.get("/api/v1/admin/categories", {
          signal: controller.signal,
        });

        if (isMounted && response.data?.isSuccess) {
          setListData(response.data?.data || []);
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

    getCategory();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [navigate, location]);

  return (
    <Fragment>
      <Outer className="bg-gray-100">
        <Navbar />

        <div className="col-span-full flex flex-col items-center justify-start pt-24 px-4 w-full">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800 tracking-wide">
            Category
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
              <DataList itemList={listData} isAge={false} isCategory={true} isHome={false} />
            ) : (
              <div className="text-center py-10 text-gray-500">
                No categories found.
              </div>
            )}
          </div>
        </div>
      </Outer>
    </Fragment>
  );
};

export default Category;
