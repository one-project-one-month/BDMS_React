import { Typography } from "@/components/ui/typography";

type CardType = "emergency" | "news" | "awareness";

type CardProps = {
  title: string;
  content: string;
  image: string;
  type: CardType;
  isActive: boolean;
};

function Card({ title, content, image, type }: CardProps) {
  return (
    <div className="bg-white max-w-5xl shadow-red-300 shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden mx-auto ">
      {/* TEXT AREA */}
      <div className="w-full md:flex-1 pt-16 pb-6 px-8 flex flex-col">
        <Typography
          className={`text-xl font-bold ${type === "emergency" ? "text-primary" : "text-dark-primary"}`}
        >
          {title}
        </Typography>

        <Typography
          className={`my-3 md:text-base/5 ${type === "emergency" ? "text-primary" : "text-dark-primary"}`}
        >
          {content}
        </Typography>

        {type === "emergency" && (
          <button className="bg-red-500 text-white font-semibold px-6 py-2 rounded-md w-fit mt-4 shadow-sm active:scale-95 transition-transform">
            <div className="flex items-center gap-2">
              <svg
                width="18"
                height="17"
                className="size-5"
                aria-hidden="true"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 0C9.51676 0 9.99133 0.286875 10.2374 0.74375L17.8305 14.9104C18.0661 15.3496 18.0555 15.8808 17.8024 16.3094C17.5493 16.7379 17.0888 17 16.5931 17H1.40686C0.9112 17 0.45069 16.7379 0.197585 16.3094C-0.0555193 15.8808 -0.0660651 15.3496 0.169463 14.9104L7.7626 0.74375C8.00867 0.286875 8.48324 0 9 0ZM9 12.4667C8.37778 12.4667 7.87509 12.9731 7.87509 13.6C7.87509 14.2269 8.37778 14.7333 9 14.7333C9.62222 14.7333 10.1249 14.2269 10.1249 13.6C10.1249 12.9731 9.62222 12.4667 9 12.4667ZM9 5.66667C8.36021 5.66667 7.85048 6.21563 7.89618 6.86021L8.15632 10.5435C8.18796 10.9862 8.55707 11.3333 8.99648 11.3333C9.43942 11.3333 9.80501 10.9898 9.83665 10.5435L10.0968 6.86021C10.1425 6.21563 9.63628 5.66667 8.99297 5.66667H9Z"
                  fill="white"
                />
              </svg>
              <a href="#">Emergency</a>
            </div>
          </button>
        )}
      </div>

      {/* BORDER */}
      <div className="hidden md:block w-0.75 h-32.5 bg-primary self-center shrink-0 md:mx-20"></div>

      {/* IMAGE AREA */}
      <div className="w-full md:flex-1 flex items-center justify-center p-6">
        <img
          src={image}
          alt={title}
          className="w-full h-48 md:h-64 object-cover rounded-lg shadow-inner"
        />
      </div>
    </div>
  );
}
export default Card;
