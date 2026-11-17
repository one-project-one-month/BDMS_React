import type { CardType } from "../pages/website/announcement-page";

type FilterBarProps = {
  category: "all" | CardType;
  setCategory: (value: "all" | CardType) => void;
};

function FilterBar({ category, setCategory }: FilterBarProps) {
  const baseStyle =
    "flex items-center gap-2 px-4 py-2 rounded-lg w-fit transition-all duration-200 relative font-medium";
  const inactiveStyle =
    "border-[3px] border-gray-400 opacity-75 text-gray-400 mx-1";
  const activeStyle = "bg-red-500 text-white border-[3px] border-red-500 mx-1";
  const allActiveStyle = `${activeStyle} shadow-lg shadow-rose-400`;

  return (
    <div className="max-w-5xl mx-auto flex flex-wrap gap-4 mt-5 mb-3">
      {/* ALL BUTTON */}
      <button
        onClick={() => setCategory("all")}
        className={`${baseStyle} ${
          category === "all" ? allActiveStyle : inactiveStyle
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
        <svg
          width="20"
          height="20"
          className="size-5"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.99997 2C10.4593 2 10.8812 2.25313 11.1 2.65625L17.85 15.1562C18.0593 15.5437 18.05 16.0125 17.825 16.3906C17.6 16.7688 17.1906 17 16.75 17H3.24997C2.80935 17 2.39997 16.7688 2.17497 16.3906C1.94997 16.0125 1.9406 15.5437 2.14997 15.1562L8.89997 2.65625C9.11872 2.25313 9.5406 2 9.99997 2ZM9.99997 13C9.44685 13 8.99997 13.4469 8.99997 14C8.99997 14.5531 9.44685 15 9.99997 15C10.5531 15 11 14.5531 11 14C11 13.4469 10.5531 13 9.99997 13ZM9.99997 7C9.43122 7 8.9781 7.48438 9.01872 8.05313L9.24997 11.3031C9.2781 11.6938 9.60622 12 9.99685 12C10.3906 12 10.7156 11.6969 10.7437 11.3031L10.975 8.05313C11.0156 7.48438 10.5656 7 9.99372 7H9.99997Z"
            fill="#AAAAAA"
          />
        </svg>
        Emergency
      </button>

      {/* NEWS BUTTON */}
      <button
        onClick={() => setCategory("news")}
        className={`${baseStyle} ${
          category === "news" ? activeStyle : inactiveStyle
        }`}
      >
        <svg
          width="20"
          height="20"
          className="size-5"
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 15V5.75C2 5.33437 2.33437 5 2.75 5C3.16562 5 3.5 5.33437 3.5 5.75V14.75C3.5 15.1656 3.83438 15.5 4.25 15.5C4.66563 15.5 5 15.1656 5 14.75V5C5 3.89688 5.89687 3 7 3H16C17.1031 3 18 3.89688 18 5V15C18 16.1031 17.1031 17 16 17H4C2.89688 17 2 16.1031 2 15ZM7 6V8C7 8.55312 7.44688 9 8 9H10C10.5531 9 11 8.55312 11 8V6C11 5.44688 10.5531 5 10 5H8C7.44688 5 7 5.44688 7 6ZM7.75 13.5C7.33437 13.5 7 13.8344 7 14.25C7 14.6656 7.33437 15 7.75 15H15.25C15.6656 15 16 14.6656 16 14.25C16 13.8344 15.6656 13.5 15.25 13.5H7.75ZM7 11.25C7 11.6656 7.33437 12 7.75 12H15.25C15.6656 12 16 11.6656 16 11.25C16 10.8344 15.6656 10.5 15.25 10.5H7.75C7.33437 10.5 7 10.8344 7 11.25ZM13.25 7.5C12.8344 7.5 12.5 7.83437 12.5 8.25C12.5 8.66563 12.8344 9 13.25 9H15.25C15.6656 9 16 8.66563 16 8.25C16 7.83437 15.6656 7.5 15.25 7.5H13.25Z"
            fill="#AAAAAA"
          />
        </svg>
        News
      </button>

      {/* AWARENESS BUTTON */}
      <button
        onClick={() => setCategory("awareness")}
        className={`${baseStyle} ${
          category === "awareness" ? activeStyle : inactiveStyle
        }`}
      >
        <svg
          width="10"
          height="14"
          className="size-5"
          aria-hidden="true"
          viewBox="0 0 10 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.22552 0C7.17413 0 8.05741 0.491131 8.55159 1.29557C8.58568 1.35202 8.92081 1.89678 9.55416 2.92703C10.1534 3.90082 10.0739 5.14277 9.35535 6.03188L7.45246 8.40286L9.90066 11.4597C10.0569 11.6545 10.0256 11.9367 9.82966 12.0948L7.55755 13.9013C7.36158 14.0565 7.07472 14.0255 6.91851 13.8307L0.644646 6.03471C-0.0739091 5.14559 -0.153433 3.90365 0.445836 2.92985C1.08203 1.89678 1.41432 1.35202 1.45125 1.29557C1.94543 0.491131 2.82587 0 3.77732 0H6.22836H6.22552ZM5.00142 5.34035L6.38173 3.61292H3.61827L4.99858 5.34035H5.00142ZM1.67846 9.48956L4.12666 12.5323L3.08149 13.8307C2.92528 14.0255 2.63842 14.0565 2.44245 13.9013L0.170342 12.0948C-0.0256271 11.9396 -0.0568687 11.6545 0.099339 11.4597L1.67846 9.48956Z"
            fill="#AAAAAA"
          />
        </svg>
        Awareness
      </button>
    </div>
  );
}

export default FilterBar;
