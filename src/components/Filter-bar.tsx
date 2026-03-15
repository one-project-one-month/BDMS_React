type FilterBarProps = {
  category: string;
  setCategory: (value: string) => void;
};
function FilterBar({ category, setCategory }: FilterBarProps) {
  const baseStyle = "flex items-center gap-2 px-4 py-2 rounded-lg w-fit transition-all duration-200 relative font-medium";
  const inactiveStyle = "border-[3px] border-gray-400 text-gray-400 mx-1";
  const activeStyle = "bg-red-500 text-white border-[3px] border-red-500 mx-1";
  const allActiveStyle = `${activeStyle} shadow-lg shadow-rose-400`;

  return (
    <div className="max-w-5xl mx-auto flex flex-wrap gap-4 mt-5 mb-3">

      {/* ALL BUTTON */}
      <button
        onClick={() => setCategory("all")} className={`${baseStyle} ${category === "all" ? allActiveStyle: inactiveStyle
        }`}
      >
        All
      </button>

      {/* EMERGENCY BUTTON  */}
      <button
        onClick={() => setCategory("emergency")}
        className={`${baseStyle} ${
          category === "emergency" ? activeStyle : inactiveStyle
        }`}
      >
        {category !== "emergency" && (
          <span className="absolute -top-2 -right-2 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-5 bg-red-500 shadow-red-400 shadow-md"></span>
          </span>
        )}
        <img src="/assets/alert.svg" alt="" className="w-5 h-5" />
        Emergency
      </button>

      {/* NEWS BUTTON */}
      <button
        onClick={() => setCategory("news")}
        className={`${baseStyle} ${
          category === "news" ? activeStyle : inactiveStyle
        }`}
      >
        <img src="/assets/news.svg" alt="" className="w-5 h-5" />
        News
      </button>

      {/* AWARENESS BUTTON */}
      <button
        onClick={() => setCategory("awareness")}
        className={`${baseStyle} ${
          category === "awareness" ? activeStyle : inactiveStyle
        }`}
      >
        <img src="/assets/awareness.svg" alt="" className="w-5 h-5" />
        Awareness
      </button>

    </div>
  );
}

export default FilterBar;
