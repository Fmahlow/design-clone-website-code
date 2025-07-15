// src/lib/useYolo.ts
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";
import { useEffect, useRef, useState } from "react";
import { COCO_CLASSES } from "./coco_classes";

const MODEL_URL = "/yolov8n_web_model/model.json";
const INPUT_SIZE = 640;
const STRIDES = [8, 16, 32];
const NUM_CLASSES = COCO_CLASSES.length;
const OBJ_THRESH = 0.25;   // confiança mínima
const IOU_THRESH = 0.45;   // IoU para NMS
const MAX_DETECTIONS = 50; // máximo de boxes pós-NMS

function sigmoid(v: number) {
  return 1 / (1 + Math.exp(-v));
}

// letterbox: mantém proporção, faz padding em preto
function letterbox(
  img: HTMLImageElement,
  size: number
): { canvas: HTMLCanvasElement; scale: number; dx: number; dy: number } {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, size, size);

  const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  const dx = (size - w) / 2;
  const dy = (size - h) / 2;

  ctx.drawImage(img, dx, dy, w, h);
  return { canvas, scale, dx, dy };
}

export function useYolo(modelUrl = MODEL_URL) {
  const modelRef = useRef<tf.GraphModel | null>(null);
  const [ready, setReady] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  useEffect(() => {
    tf.loadGraphModel(modelUrl)
      .then((m) => {
        modelRef.current = m;
        setReady(true);
      })
      .catch((err) => setModelError(err.message));
  }, [modelUrl]);

  const detect = async (img: HTMLImageElement) => {
    if (!modelRef.current) throw new Error("Modelo não está pronto");
    if (modelError)     throw new Error(modelError);

    // 1️⃣ letterbox + pré-processamento
    const { canvas: lb, scale, dx, dy } = letterbox(img, INPUT_SIZE);
    const input = tf.browser
      .fromPixels(lb)
      .toFloat()
      .div(255)
      .expandDims(0);

    // 2️⃣ inferência
    const raw = (await modelRef.current.executeAsync(input)) as tf.Tensor;
    const out = tf.transpose(raw, [0, 2, 1]);    // [1, preds, feat]
    const feats = tf.squeeze(out, [0]);         // [preds, feat]
    const data = feats.arraySync() as number[][];

    // 3️⃣ decodifica + threshold
    const dets: {
      x1: number; y1: number; w: number; h: number;
      score: number; className: string;
    }[] = [];
    let offset = 0;
    for (let si = 0; si < STRIDES.length; si++) {
      const stride = STRIDES[si];
      const gridSize = INPUT_SIZE / stride;
      const gridArea = gridSize * gridSize;
      for (let i = 0; i < gridArea; i++) {
        const row = data[offset + i].map(sigmoid);
        const cx = (row[0] * 2 - 0.5 + (i % gridSize)) * stride;
        const cy = (row[1] * 2 - 0.5 + Math.floor(i / gridSize)) * stride;
        const bw = Math.pow(row[2] * 2, 2) * stride;
        const bh = Math.pow(row[3] * 2, 2) * stride;
        const obj = row[4];
        const clsScores = row.slice(5, 5 + NUM_CLASSES);
        let bestIdx = 0, bestScore = clsScores[0];
        for (let c = 1; c < clsScores.length; c++) {
          if (clsScores[c] > bestScore) {
            bestScore = clsScores[c];
            bestIdx = c;
          }
        }
        const score = obj * bestScore;
        if (score > OBJ_THRESH) {
          dets.push({
            x1: cx - bw/2,
            y1: cy - bh/2,
            w: bw,
            h: bh,
            score,
            className: COCO_CLASSES[bestIdx],
          });
        }
      }
      offset += gridArea;
    }

    // 4️⃣ NMS
    if (dets.length === 0) {
      tf.dispose([input, raw, out, feats]);
      return [];
    }
    const boxes = dets.map(d => [d.y1, d.x1, d.y1 + d.h, d.x1 + d.w]) as [number,number,number,number][];
    const scores = dets.map(d => d.score);
    const boxesT = tf.tensor2d(boxes);
    const scoresT = tf.tensor1d(scores);
    const keepT = await tf.image.nonMaxSuppressionAsync(
      boxesT, scoresT, MAX_DETECTIONS, IOU_THRESH, OBJ_THRESH
    );
    const keep = keepT.arraySync() as number[];

    // 5️⃣ reescala para coords originais + monta resultados
    const results = keep.map(i => {
      const d = dets[i];
      const x1 = (d.x1 - dx) / scale;
      const y1 = (d.y1 - dy) / scale;
      const w  = d.w / scale;
      const h  = d.h / scale;
      return { bbox: [x1, y1, w, h] as [number,number,number,number], class: d.className, score: d.score };
    });

    tf.dispose([input, raw, out, feats, boxesT, scoresT, keepT]);
    return results;
  };

  return { ready, detect, modelError };
}
