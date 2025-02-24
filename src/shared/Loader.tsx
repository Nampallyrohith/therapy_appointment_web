import { FourSquare } from "react-loading-indicators";

const Loader = () => {
  return (
    <div className="w-3/4 h-screen mx-auto flex flex-col items-center justify-center">
      <FourSquare
        color="#FFBF69"
        size="medium"
        text="Loading..."
        textColor=""
      />
    </div>
  );
};

export default Loader;
