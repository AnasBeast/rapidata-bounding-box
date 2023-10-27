import { useEffect, useState } from "react";
import { BoundingBoxData, getSingleBoundingBox } from "../services/boundingBoxService";
import BoundingBox from "../components/BoundingBox";

const SolvingPage = () => {
    const [boundingBoxData, setBoundingBoxData] = useState<BoundingBoxData>();

    useEffect(() => {
        async function fetchData() {
            const data = await getSingleBoundingBox();
            setBoundingBoxData(data);
        }
        fetchData();
    }, []);

    if(!boundingBoxData) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <div className="mt-4 relative">
            <h2 className="mt-4 font-bold text-4xl text-[#fdfdfd]">Annotate the car!</h2>
            <BoundingBox />
            <img src={"/" + boundingBoxData.fileName} className="relative z-0 mt-4 h-[480px] aspect-auto" alt="car image" />
            <button className="w-full mt-6 bg-[#1D4ED8] hover:opacity-75 text-[#fdfdfd] font-bold py-2 px-4 rounded">Submit</button>
        </div>
    );
}

export default SolvingPage;