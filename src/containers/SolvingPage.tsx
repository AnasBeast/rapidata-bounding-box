import { useCallback, useEffect, useState } from "react";
import { BoundingBoxData, addUserGuess, getSingleBoundingBox } from "../services/boundingBoxService";
import BoundingBox, { useBoundingBoxContext } from "../components/BoundingBox";

const SolvingPage = () => {
    const [boundingBoxData, setBoundingBoxData] = useState<BoundingBoxData>();
    const [imgDimensions, setImgDimensions] = useState<{ width: number, height: number } | null>(null);
    const [imgLoaded, setImgLoaded] = useState<boolean>(false);
    const { boundingBoxs } = useBoundingBoxContext();

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

    const handleSubmit = async () => {
        if(!imgDimensions || !boundingBoxData) return;
        
        const boundingBoxes = boundingBoxs.map((boundingBox) => {
            let topLeftX = (boundingBox.x / imgDimensions.width) * 100;
            let topLeftY = 100 - (boundingBox.y / imgDimensions.height) * 100;

            let bottomRightX = ((boundingBox.x + boundingBox.width) / imgDimensions.width) * 100;
            let bottomRightY = 100 - ((boundingBox.y + boundingBox.height) / imgDimensions.height) * 100;

            return {
                topLeft: {
                    x: parseFloat(topLeftX.toFixed(4)),
                    y: parseFloat(topLeftY.toFixed(4))
                },
                bottomRight: {
                    x: parseFloat(bottomRightX.toFixed(4)),
                    y: parseFloat(bottomRightY.toFixed(4))
                }
            }
        })
        await addUserGuess({
            id: boundingBoxData.id,
            boundingBox: boundingBoxes
        });
    }

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
            <button className="w-full mt-6 bg-[#1D4ED8] hover:opacity-75 text-[#fdfdfd] font-bold py-2 px-4 rounded disabled:bg-[#B5B5C3]" disabled={!(boundingBoxs.length >= 1)} onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default SolvingPage;