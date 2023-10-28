import { useCallback, useEffect, useState } from "react";
import { BoundingBoxData, getSingleBoundingBox } from "../services/boundingBoxService";
import BoundingBox from "../components/BoundingBox";

const SolvingPage = () => {
    const [boundingBoxData, setBoundingBoxData] = useState<BoundingBoxData>();
    const [imgDimensions, setImgDimensions] = useState<{ width: number, height: number } | null>(null);
    const [imgLoaded, setImgLoaded] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            const data = await getSingleBoundingBox();
            setBoundingBoxData(data);
        }
        fetchData();
    }, []);

    const handleImageLoad = (img: HTMLImageElement) => {
        setImgDimensions({
            width: img.width,
            height: img.height
        })
        setImgLoaded(true);
    }

    const imgRefCallback = useCallback((node: HTMLImageElement | null) => {
        if (node !== null) {
            node.onload = () => handleImageLoad(node)
        }
    }, [])

    if(!boundingBoxData) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <div className="mt-4 relative">
            <h2 className="mt-4 font-bold text-4xl text-[#fdfdfd]">Annotate the car!</h2>
            {imgLoaded && <BoundingBox width={imgDimensions!.width} height={imgDimensions!.height} />}
            <img ref={imgRefCallback} src={"/" + boundingBoxData.fileName} className="relative z-0 mt-4 h-[50vh] aspect-auto" alt="car image" />
            <button className="w-full mt-6 bg-[#1D4ED8] hover:opacity-75 text-[#fdfdfd] font-bold py-2 px-4 rounded">Submit</button>
        </div>
    );
}

export default SolvingPage;