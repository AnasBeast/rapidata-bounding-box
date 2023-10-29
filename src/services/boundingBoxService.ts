export interface BoundingBoxData {
  id: string;
  fileName: string;
  target: string;
}

export async function getSingleBoundingBox(): Promise<BoundingBoxData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responseData = {
        id: "02863e47-8565-4c0d-ac39-5c3b69762fee",
        fileName: "vid_4_28840.jpg",
        target: "car",
      };
      resolve(responseData);
    }, 300);
  });
}

interface Point {
  x: number;
  y: number;
}

interface BoundingBox {
  topLeft: Point;
  bottomRight: Point;
}

interface UserGuess {
  id: string;
  boundingBox: BoundingBox[];
}


export async function addUserGuess(userGuess: UserGuess) {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(userGuess);
        resolve(true)
      }, 1000)
    })
  } catch (e) {
    console.log("Failed to submit bounding boxes", e);
  }
}
