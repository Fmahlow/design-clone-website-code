
// Reference the elements we will use
const statusLabel = document.getElementById('status');
const dimensionsValueLabel = document.getElementById('dimensions-value');
dimensionsValueLabel.textContent = '';
const resizedDimensionsValueLabel = document.getElementById('resized-dimensions-value');
resizedDimensionsValueLabel.textContent = '';
const fileUpload = document.getElementById('upload');
const imageContainer = document.getElementById('container');
const maskCanvas = document.getElementById('mask-output');
const outputCanvas = document.getElementById('output-mask');
const uploadButton = document.getElementById('upload-button');
const resetButton = document.getElementById('reset-image');
const clearButton = document.getElementById('clear-points');
const cutButton = document.getElementById('cut-mask');
const downloadButton = document.getElementById('download-mask');

// State variables
let lastPoints = null;
let isEncoded = false;
let isDecoding = false;
let isMultiMaskMode = false;
let modelReady = false;
let imageDataURI = null;
let originalWidth = null;
let originalHeight = null;
let lastMaskCanvas = null;
const SCALE_FACTOR = 4;
const PIXEL_THRESHOLD = 500000; // mínimo para aplicar o resize

// Constants
const BASE_URL = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/';

// Create a web worker so that the main (UI) thread is not blocked during inference.
const worker = new Worker('worker.js', {
    type: 'module',
});
console.log('[index] Worker criado');

// Create elements used to display selected points
const star = document.createElement('div');
star.className = 'icon point';

const cross = new Image();
cross.src = BASE_URL + 'cross-icon.png';
cross.className = 'icon';

// Set up message handler
worker.addEventListener('message', (e) => {
    const { type, data } = e.data;
    console.log('[index] Mensagem do worker', type);
    if (type === 'ready') {
        modelReady = true;
        statusLabel.textContent = 'Pronto';

    } else if (type === 'decode_result') {
        isDecoding = false;

        if (!isEncoded) {
            return; // We are not ready to decode yet
        }

        if (!isMultiMaskMode && lastPoints) {
            // Perform decoding with the last point
            decode();
            lastPoints = null;
        }

        const { mask, scores } = data;

        const offCanvas = document.createElement('canvas');
        offCanvas.width = mask.width;
        offCanvas.height = mask.height;
        lastMaskCanvas = offCanvas;

        const offCtx = offCanvas.getContext('2d');
        const imageData = offCtx.createImageData(offCanvas.width, offCanvas.height);

        // Select best mask
        const numMasks = scores.length; // 3
        let bestIndex = 0;
        for (let i = 1; i < numMasks; ++i) {
            if (scores[i] > scores[bestIndex]) {
                bestIndex = i;
            }
        }

        // Fill mask with colour
        const pixelData = imageData.data;
        for (let i = 0; i < pixelData.length; ++i) {
            if (mask.data[numMasks * i + bestIndex] === 1) {
                const offset = 4 * i;
                pixelData[offset] = 0;       // red
                pixelData[offset + 1] = 114; // green
                pixelData[offset + 2] = 189; // blue
                pixelData[offset + 3] = 255; // alpha
            }
        }

        // Draw mask to offscreen canvas
        offCtx.putImageData(imageData, 0, 0);

        // Resize mask to match the displayed image
        maskCanvas.width = imageContainer.clientWidth;
        maskCanvas.height = imageContainer.clientHeight;
        const context = maskCanvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        context.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        context.drawImage(offCanvas, 0, 0, maskCanvas.width, maskCanvas.height);

    } else if (type === 'segment_result') {
        if (data === 'start') {
            statusLabel.textContent = 'Gerando segmentações...';
        } else {
            statusLabel.textContent = 'Segmentações geradas!';
            isEncoded = true;
        }
    }
});

function decode() {
    isDecoding = true;
    worker.postMessage({ type: 'decode', data: lastPoints });
}

function clearPointsAndMask() {
    // Reset state
    isMultiMaskMode = false;
    lastPoints = null;
    lastMaskCanvas = null;

    // Remove points from previous mask (if any)
    document.querySelectorAll('.icon').forEach(e => e.remove());

    // Disable cut button
    cutButton.disabled = true;
    downloadButton.disabled = true;

    // Reset mask canvas
    maskCanvas.getContext('2d').clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    outputCanvas.getContext('2d').clearRect(0, 0, outputCanvas.width, outputCanvas.height);
}
clearButton.addEventListener('click', clearPointsAndMask);

resetButton.addEventListener('click', () => {
    // Update state
    isEncoded = false;
    imageDataURI = null;
    originalWidth = null;
    originalHeight = null;
    lastMaskCanvas = null;

    // Indicate to worker that we have reset the state
    worker.postMessage({ type: 'reset' });

    // Clear points and mask (if present)
    clearPointsAndMask();

    // Update UI
    cutButton.disabled = true;
    downloadButton.disabled = true;
    imageContainer.style.backgroundImage = 'none';
    uploadButton.style.display = 'flex';
    statusLabel.textContent = 'Pronto';
    dimensionsValueLabel.textContent = '';
    resizedDimensionsValueLabel.textContent = '';
});

async function segment(data) {
    // Update state
    isEncoded = false;
    console.log('[index] Segmentando imagem');
    if (!modelReady) {
        statusLabel.textContent = 'Carregando modelo...';
    }
    imageDataURI = data;

    // Load image to compute dimensions and resized version
    const img = new Image();
    const loaded = new Promise(res => {
        img.onload = res;
    });
    img.src = data;
    await loaded;

    originalWidth = img.naturalWidth;
    originalHeight = img.naturalHeight;

    const resizeCanvas = document.createElement('canvas');
    const shouldResize = originalWidth * originalHeight > PIXEL_THRESHOLD;
    const resizedWidth = shouldResize
        ? Math.floor(originalWidth / SCALE_FACTOR)
        : originalWidth;
    const resizedHeight = shouldResize
        ? Math.floor(originalHeight / SCALE_FACTOR)
        : originalHeight;
    resizeCanvas.width = resizedWidth;
    resizeCanvas.height = resizedHeight;
    const rCtx = resizeCanvas.getContext('2d');
    rCtx.drawImage(img, 0, 0, resizedWidth, resizedHeight);
    const resizedData = resizeCanvas.toDataURL();

    // Update UI with resized image for faster preview
    imageContainer.style.backgroundImage = `url(${resizedData})`;
    dimensionsValueLabel.textContent = `${originalWidth}x${originalHeight}`;
    resizedDimensionsValueLabel.textContent = `${resizedWidth}x${resizedHeight}`;
    uploadButton.style.display = 'none';
    cutButton.disabled = true;

    // Instruct worker to segment the resized image
    console.log('[index] Enviando imagem para worker');
    worker.postMessage({ type: 'segment', data: { image: resizedData } });
}

function handleFiles(files) {
    const file = files && files[0];
    if (!file) {
        return;
    }
    console.log('[index] Arquivo selecionado', file.name);
    const reader = new FileReader();
    reader.onload = e => segment(e.target.result);
    reader.readAsDataURL(file);
}

// Handle file selection
fileUpload.addEventListener('change', function (e) {
    handleFiles(e.target.files);
});

// Allow drag-and-drop
imageContainer.addEventListener('dragover', e => {
    e.preventDefault();
});
imageContainer.addEventListener('drop', e => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
});

function addIcon({ point, label }) {
    const icon = (label === 1 ? star : cross).cloneNode();
    icon.style.left = `${point[0] * 100}%`;
    icon.style.top = `${point[1] * 100}%`;
    imageContainer.appendChild(icon);
}

// Attach hover event to image container
imageContainer.addEventListener('mousedown', e => {
    if (e.button !== 0 && e.button !== 2) {
        return; // Ignore other buttons
    }
    if (!isEncoded) {
        return; // Ignore if not encoded yet
    }
    if (!isMultiMaskMode) {
        lastPoints = [];
        isMultiMaskMode = true;
        cutButton.disabled = false;
    }

    const point = getPoint(e);
    lastPoints.push(point);

    // add icon
    addIcon(point);

    decode();
});


// Clamp a value inside a range [min, max]
function clamp(x, min = 0, max = 1) {
    return Math.max(Math.min(x, max), min)
}

function getPoint(e) {
    // Get bounding box
    const bb = imageContainer.getBoundingClientRect();

    // Get the mouse coordinates relative to the container
    const mouseX = clamp((e.clientX - bb.left) / bb.width);
    const mouseY = clamp((e.clientY - bb.top) / bb.height);

    return {
        point: [mouseX, mouseY],
        label: e.button === 2 // right click
            ? 0  // negative prompt
            : 1, // positive prompt
    }
}

// Do not show context menu on right click
imageContainer.addEventListener('contextmenu', e => {
    e.preventDefault();
});

// Attach hover event to image container
imageContainer.addEventListener('mousemove', e => {
    if (!isEncoded || isMultiMaskMode) {
        // Ignore mousemove events if the image is not encoded yet,
        // or we are in multi-mask mode
        return;
    }
    lastPoints = [getPoint(e)];

    if (!isDecoding) {
        decode(); // Only decode if we are not already decoding
    }
});

// Handle cut button click
cutButton.addEventListener('click', () => {
    if (!lastMaskCanvas) return;
    const [w, h] = [originalWidth, originalHeight];

    outputCanvas.width = w;
    outputCanvas.height = h;
    const outContext = outputCanvas.getContext('2d');
    outContext.imageSmoothingEnabled = false;
    outContext.drawImage(lastMaskCanvas, 0, 0, w, h);

    const maskPixelData = outContext.getImageData(0, 0, w, h);
    const outData = outContext.createImageData(w, h);

    for (let i = 0; i < maskPixelData.data.length; i += 4) {
        const isSelected = maskPixelData.data[i + 3] > 0;
        const value = isSelected ? 255 : 0;
        outData.data[i] = value;
        outData.data[i + 1] = value;
        outData.data[i + 2] = value;
        outData.data[i + 3] = 255;
    }
    outContext.putImageData(outData, 0, 0);

    downloadButton.disabled = false;
});

downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = outputCanvas.toDataURL('image/png');
    link.download = 'mask.png';
    link.click();
});
