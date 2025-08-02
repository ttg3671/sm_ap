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
      <Outer>
        <Navbar />

        <div className="min-h-screen bg-gray-900 text-white">
          {/* Main Content Area - properly aligned with sidebar */}
          <div className="ml-64 min-h-screen">
            {/* Top Header Bar */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-emerald-400">Content Management System</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 font-semibold text-sm">A</span>
                </div>
                <span className="text-gray-300 font-medium">Admin User</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* Page Header */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-emerald-400 mb-2">Content Tags</h2>
                <p className="text-gray-400">Manage and organize your content tags</p>
              </div>

              {/* Error Message */}
              {errMsg && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                  <div className="flex items-center text-red-300">
                    <span>{errMsg}</span>
                  </div>
                </div>
              )}

              {/* Add Tag Form */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Add New Tag</h3>
                  <DataForm handleSubmit={handleFormSubmit} value={newCategory} id={id} isAge={false} />
                </div>
              </div>

              {/* Tags List */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
                {isLoading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : listData && listData.length > 0 ? (
                  <div className="p-0">
                    <DataList
                      itemList={listData}
                      isAge={false}
                      isCategory={false}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="text-center">
                      <div className="text-gray-500 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">No tags found</h3>
                      <p className="text-gray-400">Start by adding your first content tag</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Outer>
    </Fragment>
  );
};

export default Tags;