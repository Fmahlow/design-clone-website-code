import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";
import { useEffect, useRef, useState } from "react";

export interface SegmentationResult {
  segmentationMap: Uint8Array;
  legend: Record<number, string>;
  width: number;
  height: number;
}

export function useDeepLab() {
  const modelRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  useEffect(() => {
    import("@tensorflow-models/deeplab")
      .then(m => m.load({ base: "pascal", quantizationBytes: 2 }))
      .then(model => {
        modelRef.current = model;
        setReady(true);
      })
      .catch(err => setModelError(err.message));
  }, []);

  const segment = async (img: HTMLImageElement): Promise<SegmentationResult> => {
    if (!modelRef.current) throw new Error("Modelo não está pronto");
    if (modelError) throw new Error(modelError);
    await tf.nextFrame();
    return modelRef.current.segment(img);
  };

  return { ready, segment, modelError };
}
