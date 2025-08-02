import { useState, useEffect } from "react";

const DataForm = ({ handleSubmit, value = "", series_id = null, id = null, isAge }) => {
  const [val, setVal] = useState(value !== null && value !== undefined ? String(value) : "");

  // console.log(value, series_id, id);

  useEffect(() => {
    setVal(value !== null && value !== undefined ? String(value) : "");
  }, [value]);


  const onSubmit = (e) => {
    e.preventDefault();
    if (!val.trim()) return;
    handleSubmit(e, val, series_id, id); // Send value + optional id back to parent
    setVal(""); // Clear input after submission
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full flex flex-col md:flex-row items-stretch gap-3 mb-6"
    >
      <input
        type={!isAge ? "text" : "number"}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Enter here..."
        className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-emerald-400 text-gray-900 font-semibold rounded-lg hover:bg-emerald-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        {id ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default DataForm;
