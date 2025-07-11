import { useEffect, useState } from "react";

declare global {
  interface Window {
    yolov8?: any;
    yoloModel?: any;
  }
}

export function useYolo() {
  const [model, setModel] = useState<any | null>(null);

  useEffect(() => {
    if (model) return;

    async function loadModel() {
      if (window.yoloModel) {
        setModel(window.yoloModel);
        return;
      }
      if (!window.yolov8) {
        await new Promise<void>(resolve => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/yolov8-tfjs/dist/yolov8.min.js";
          script.onload = () => resolve();
          document.body.appendChild(script);
        });
      }
      window.yoloModel = await window.yolov8.load();
      setModel(window.yoloModel);
    }

    loadModel();
  }, [model]);

  const detect = async (img: HTMLImageElement) => {
    if (!model) return [] as any[];
    const preds = await model.detect(img);
    return preds;
  };

  return { model, detect };
}
