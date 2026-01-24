"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { PDFDocument } from "pdf-lib";

const CompressorComp = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(70); // slider value

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setCompressedFile(null);
    }
  };

  const compressFile = async () => {
    if (!file) return;
    setLoading(true);

    try {
      if (file.type.startsWith("image/")) {
        const compressed = await imageCompression(file, {
          maxSizeMB: (100 - quality) / 10,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          initialQuality: quality / 100,
        });

        setCompressedFile(compressed);
      } else if (file.type === "application/pdf") {
        const bytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(bytes);

        const pdfBytes = await pdfDoc.save({
          useObjectStreams: true,
        });

        const safePdfBytes = new Uint8Array(pdfBytes);

        const pdfBlob = new Blob([safePdfBytes], {
          type: "application/pdf",
        });

        const compressedPdf = new File([pdfBlob], `compressed-${file.name}`, {
          type: "application/pdf",
        });

        setCompressedFile(compressedPdf);
      } else {
        alert("Unsupported file type");
      }
    } catch (err) {
      console.error(err);
      alert("Compression failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = () => {
    if (!compressedFile) return;
    const url = URL.createObjectURL(compressedFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = compressedFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-xl space-y-4">
      <h2 className="text-xl font-semibold">Compress the file</h2>

      <input
        type="file"
        accept="image/*,application/pdf"
        className="bg-foreground text-background cursor-pointer p-1"
        onChange={handleFileChange}
      />

      {/* SLIDER */}
      <div>
        <label className="text-sm font-medium">
          Compression level: {quality}%
        </label>
        <input
          type="range"
          min="10"
          max="90"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {file && (
        <p className="text-sm">
          Original: {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      )}

      <button
        onClick={compressFile}
        disabled={!file || loading}
        className="w-full bg-black text-white py-2 rounded"
      >
        {loading ? "Compressing..." : "Compress File"}
      </button>

      {compressedFile && (
        <>
          <p className="text-sm text-green-600">
            Compressed: {(compressedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>

          <button onClick={downloadFile} className="w-full border py-2 rounded">
            Download
          </button>
        </>
      )}
    </div>
  );
};

export default CompressorComp;
