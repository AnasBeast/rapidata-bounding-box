import { Dispatch } from "react";

interface ToolBarProps {
    currentTool: string;
    setCurrentTool: Dispatch<React.SetStateAction<string>>,
    selectedRectangle: number | null;
    onDelete: () => void
}

const ToolBar = ({ currentTool, setCurrentTool, selectedRectangle, onDelete }: ToolBarProps) => {
  return (
    <div className="bg-[#0D111A] flex rounded-lg h-11 p-1 fill-[#1D4ED8] mt-9">
      <button
        className="w-1/2 flex items-center justify-center border-r border-[#2A2E36]"
        onClick={() => setCurrentTool("selection")}
      >
        <span className={currentTool === "selection" ? "rounded-lg p-2 bg-[#384148]" : "rounded-lg p-2 bg-transparent"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="20"
            height="20"
            viewBox="0 0 50 50"
          >
            <path d="M 29.699219 47 C 29.578125 47 29.457031 46.976563 29.339844 46.933594 C 29.089844 46.835938 28.890625 46.644531 28.78125 46.398438 L 22.945313 32.90625 L 15.683594 39.730469 C 15.394531 40.003906 14.96875 40.074219 14.601563 39.917969 C 14.238281 39.761719 14 39.398438 14 39 L 14 6 C 14 5.601563 14.234375 5.242188 14.601563 5.082031 C 14.964844 4.925781 15.390625 4.996094 15.683594 5.269531 L 39.683594 27.667969 C 39.972656 27.9375 40.074219 28.355469 39.945313 28.726563 C 39.816406 29.101563 39.480469 29.363281 39.085938 29.398438 L 28.902344 30.273438 L 35.007813 43.585938 C 35.117188 43.824219 35.128906 44.101563 35.035156 44.351563 C 34.941406 44.601563 34.757813 44.800781 34.515625 44.910156 L 30.113281 46.910156 C 29.980469 46.96875 29.84375 47 29.699219 47 Z"></path>
          </svg>
        </span>
      </button>

      <button
        className="w-1/2 flex items-center justify-center"
        onClick={() =>
          selectedRectangle !== null && selectedRectangle !== -1
            ? onDelete()
            : setCurrentTool("rectangle")
        }
      >
        <span className={currentTool === "rectangle" ? "rounded-lg p-1.5 bg-[#384148]" : "rounded-lg p-2 bg-transparent"}>
          {selectedRectangle !== null && selectedRectangle !== -1 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 30 30"
              width="24px"
              height="24px"
            >
              {" "}
              <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 5C5.44772 5 5 5.44772 5 6C5 6.55228 5.44772 7 6 7C6.55228 7 7 6.55228 7 6C7 5.44772 6.55228 5 6 5ZM3 6C3 4.34315 4.34315 3 6 3C7.30622 3 8.41746 3.83481 8.82929 5H15.1707C15.5825 3.83481 16.6938 3 18 3C19.6569 3 21 4.34315 21 6C21 7.30622 20.1652 8.41746 19 8.82929V15.1707C20.1652 15.5825 21 16.6938 21 18C21 19.6569 19.6569 21 18 21C16.6938 21 15.5825 20.1652 15.1707 19H8.82929C8.41746 20.1652 7.30622 21 6 21C4.34315 21 3 19.6569 3 18C3 16.6938 3.83481 15.5825 5 15.1707V8.82929C3.83481 8.41746 3 7.30622 3 6ZM7 8.82929V15.1707C7.85241 15.472 8.52801 16.1476 8.82929 17H15.1707C15.472 16.1476 16.1476 15.472 17 15.1707V8.82929C16.1476 8.52801 15.472 7.85241 15.1707 7H8.82929C8.52801 7.85241 7.85241 8.52801 7 8.82929ZM18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5ZM6 17C5.44772 17 5 17.4477 5 18C5 18.5523 5.44772 19 6 19C6.55228 19 7 18.5523 7 18C7 17.4477 6.55228 17 6 17ZM18 17C17.4477 17 17 17.4477 17 18C17 18.5523 17.4477 19 18 19C18.5523 19 19 18.5523 19 18C19 17.4477 18.5523 17 18 17Z"
              />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
};

export default ToolBar;
