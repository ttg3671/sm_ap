import { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Outer, Navbar, DataList, DataForm } from "../../components";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useTheme } from '../../contexts/ThemeContext';

const Genre = () => {
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { isGolden, isEmerald } = useTheme();

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getCategory = async () => {
      try {
        const response = await axiosPrivate.get("/admin/genres", {
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
        } else if (error.response?.status == 400 || error.response) {
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

  const [newCategory, setNewCategory] = useState("");
  const [ id, setId ] = useState(null);

  const handleEdit = (id, name) => {
    // console.log("Edit item", id, name);
    setNewCategory(name);       // prefill the form input
    setId(id);              // keep track of which item is being edited
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    // console.log("Delete item", id);
    setId(id);
    try {
      const response = await axiosPrivate.delete(`/admin/genres/${id}`);

      if (response.data?.isSuccess) {
        setListData((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
      } else {
        throw new error(response.data?.message || "Update failed");
      }
    } catch (err) {
      console.error("Error submitting form:", err?.response.data.message);
      setErrMsg(err?.response.data.message);
    } finally {
      setIsLoading(false);
      setId(null);
      setNewCategory(""); // clear form input
    }
  };

  const handleFormSubmit = async (e, val, series_id, id) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (id) {
        // Edit existing tag
        const response = await axiosPrivate.put(`/admin/genres/${id}`, {
          name: val,
        });

        if (response.data?.isSuccess) {
          setListData((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, name: val } : item
            )
          );
        } else {
          throw new Error(response.data?.message || "Update failed");
        }
      } else {
        // Add new tag
        const response = await axiosPrivate.post(`/api/v1/admin/genres`, {
          name: val,
        });

        // console.log(response.data);

        if (response.data?.isSuccess && response.data?.data) {
          setListData((prev) => [...prev, response.data.data]);
        } else {
          throw new Error(response.data?.message || "Creation failed");
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err?.response.data.message);
      setErrMsg(err?.response.data.message);
    } finally {
      setIsLoading(false);
      setId(null);
      setNewCategory(""); // clear form input
    }
  };

  return (
    <Fragment>
      <Outer className="bg-gray-100">
        <Navbar />

        <div className="col-span-full flex flex-col items-center justify-start pt-24 px-4 w-full">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800 tracking-wide">
            Genre
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
              <div className="w-full max-w-4xl border-0 p-4 rounded bg-gray-50">
                {/* Header Section */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Add Genre</h2>
                </div>

                <DataForm handleSubmit={handleFormSubmit} value={newCategory} id={id} isAge={false} />

                {/* Data Table Section */}
                <div className="w-full max-w-4xl overflow-x-auto bg-white shadow-md rounded-lg">
                  {listData && listData.length > 0 ? (
                    // <DataList itemList={listData} isAge={false} isCategory={false} />
                    <DataList
                      itemList={listData}
                      isAge={false}
                      isCategory={false}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      No genre found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Outer>
    </Fragment>
  );
};

export default Genre;