import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";
import { useEffect, useRef, useState } from "react";

export interface SegmentationResult {
  segmentationMap: Uint8Array;
  /**
   * Map of detected label names to their RGB color in the segmentation map.
   */
  legend: Record<string, [number, number, number]>;
  width: number;
  height: number;
}

export function useDeepLab() {
  const modelRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[useDeepLab] Loading DeepLab model");
    import("@tensorflow-models/deeplab")
      .then(m => m.load({ base: "pascal", quantizationBytes: 2 }))
      .then(model => {
        console.log("[useDeepLab] Model loaded");
        modelRef.current = model;
        setReady(true);
      })
      .catch(err => {
        console.error("[useDeepLab] Failed to load model", err);
        setModelError(err.message);
      });
  }, []);

  const segment = async (img: HTMLImageElement): Promise<SegmentationResult> => {
    if (!modelRef.current) throw new Error("Modelo não está pronto");
    if (modelError) throw new Error(modelError);
    console.log("[useDeepLab] Segmenting image");
    await tf.nextFrame();
    const result = await modelRef.current.segment(img);
    console.log("[useDeepLab] Segmentation done");
    return result;
  };

  return { ready, segment, modelError };
}
