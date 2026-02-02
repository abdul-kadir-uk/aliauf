"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";

const TextImg = () => {
  const [mode, setMode] = useState<"textToImage" | "imageToText">(
    "textToImage",
  );
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);

  // TEXT ➜ IMAGE
  const generateImageFromText = () => {
    if (!text) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000000";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";

    const lines = text.split("\n");
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, 100 + index * 40);
    });

    const url = canvas.toDataURL("image/png");
    setImageUrl(url);
  };

  // IMAGE ➜ TEXT (OCR)
  const extractTextFromImage = async (file: File) => {
    setLoading(true);
    setOcrText("");

    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m),
      });

      setOcrText(result.data.text);
    } catch (err) {
      console.error(err);
      alert("Failed to extract text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl sm:mx-auto p-6 space-y-6 w-full min-w-0">
      <h1 className="text-2xl font-bold text-center">Text ⇄ Image Converter</h1>

      {/* MODE SWITCH */}
      <div className="flex justify-center gap-4 flex-wrap min-w-0">
        <button
          onClick={() => setMode("textToImage")}
          className={`px-4 py-2 rounded cursor-pointer ${
            mode === "textToImage"
              ? "bg-foreground text-background"
              : "bg-background"
          }`}
        >
          Text → Image
        </button>
        <button
          onClick={() => setMode("imageToText")}
          className={`px-4 py-2 rounded cursor-pointer ${
            mode === "imageToText"
              ? "bg-foreground text-background"
              : "bg-background"
          }`}
        >
          Image → Text
        </button>
      </div>

      {/* TEXT ➜ IMAGE */}
      {mode === "textToImage" && (
        <div className="space-y-4 min-w-0">
          <textarea
            className="w-full border p-3 rounded"
            rows={5}
            placeholder="Enter text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            onClick={generateImageFromText}
            className="w-full bg-blue-600 text-white cursor-pointer py-2 rounded"
          >
            Convert to Image
          </button>

          {imageUrl && (
            <div className="text-center space-y-3">
              <img src={imageUrl} alt="Generated" className="mx-auto border" />
              <a
                href={imageUrl}
                download="text-image.png"
                className="inline-block text-blue-600 underline"
              >
                Download Image
              </a>
            </div>
          )}
        </div>
      )}

      {/* IMAGE ➜ TEXT */}
      {mode === "imageToText" && (
        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setImageFile(e.target.files[0]);
                setOcrText("");
              }
            }}
          />

          <button
            onClick={() => imageFile && extractTextFromImage(imageFile)}
            disabled={!imageFile || loading}
            className="w-full bg-blue-600 text-white cursor-pointer py-2 rounded disabled:opacity-50"
          >
            Convert to Text
          </button>

          {loading && <p className="text-center">Extracting text...</p>}

          {ocrText && (
            <textarea
              className="w-full border p-3 rounded"
              rows={6}
              value={ocrText}
              readOnly
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TextImg;
