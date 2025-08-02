import { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Outer, Navbar, DataList, DataForm } from "../../components";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useTheme } from '../../contexts/ThemeContext';

const Tags = () => {
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
        // Temporarily disable real API call since server endpoint is not available
        // TODO: Re-enable when API server has /admin/tags endpoint
        // const response = await axiosPrivate.get("/admin/tags", {
        //   signal: controller.signal,
        // });

        // Use mock data for development with HR requested values
        const mockData = [
          { id: 1, name: "top10" },
          { id: 2, name: "trending now" },
          { id: 3, name: "popular this week" },
          { id: 4, name: "most watched" },
          { id: 5, name: "editor's choice" },
          { id: 6, name: "new releases" }
        ];

        if (isMounted) {
          setListData(mockData);
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
      // Temporarily disable real API call since server endpoint is not available
      // const response = await axiosPrivate.delete(`/admin/tags/${id}`);

      // Mock successful delete for development
      console.log(`Mock: Deleting tag with ID ${id}`);
      
      // Simulate successful response
      setListData((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
      
    } catch (err) {
      console.error("Error deleting item:", err);
      setErrMsg("Error deleting tag");
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
        // Mock edit existing tag
        console.log(`Mock: Editing tag ID ${id} with name "${val}"`);
        
        setListData((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, name: val } : item
          )
        );
      } else {
        // Mock add new tag
        const newId = Math.max(...listData.map(item => item.id), 0) + 1;
        const newTag = { id: newId, name: val };
        
        console.log(`Mock: Adding new tag "${val}" with ID ${newId}`);
        
        setListData((prev) => [...prev, newTag]);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setErrMsg("Error saving tag");
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
            Content Tag
          </h1>

          {errMsg && (
            <div className="mb-4 px-4 py-2 text-red-600 bg-red-100 border border-red-200 rounded w-full max-w-4xl">
              {errMsg}
            </div>
          )}

          {isLoading ? (
              <div className="relative z-10 flex justify-center items-center h-50 pt-10">
                <div className="animate-spin h-12 w-12 border-4 border-blue-800 rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <div className="w-full max-w-4xl border-0 p-4 rounded bg-gray-50">
                {/* Header Section */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Add Tag</h2>
                </div>

                <DataForm handleSubmit={handleFormSubmit} value={newCategory} id={id} isAge={false} />

                {/* Data Table Section */}
                <div className={`w-full max-w-4xl overflow-x-auto shadow-md rounded-lg ${
                  isGolden ? 'bg-gradient-to-br from-amber-50 to-orange-50' : 
                  isEmerald ? 'bg-gradient-to-br from-emerald-50 to-teal-50' : 'bg-white'
                }`}>
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
                    <div className={`text-center py-10 ${
                      isGolden ? 'text-amber-600' : 
                      isEmerald ? 'text-emerald-600' : 'text-gray-500'
                    }`}>
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                            isGolden ? 'border-amber-600' : 
                            isEmerald ? 'border-emerald-600' : 'border-gray-500'
                          }`}></div>
                          <span className="ml-2">Loading tags...</span>
                        </div>
                      ) : (
                        "No content tag found."
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          }
        </div>
      </Outer>
    </Fragment>
  );
};

export default Tags;