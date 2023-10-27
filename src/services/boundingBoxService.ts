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
        fileName: "https://th.bing.com/th/id/OIP.xQpJ3XdZ19bbWIGlx4x20AHaE7?pid=ImgDet&rs=1",
        target: "car",
      };
      resolve(responseData);
    }, 300);
  });
}
