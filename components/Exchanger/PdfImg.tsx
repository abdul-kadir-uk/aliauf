"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function PdfImg() {
  const [mode, setMode] = useState<"pdf-to-img" | "img-to-pdf">("pdf-to-img");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  // ---------------- PDF ➜ IMAGES ----------------
  const handlePdfToImages = async () => {
    if (!pdfFile) return;

    setLoading(true);
    setImages([]);

    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const imgUrls: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvas,
        canvasContext: context,
        viewport,
      }).promise;

      imgUrls.push(canvas.toDataURL("image/png"));
    }

    setImages(imgUrls);
    setLoading(false);
  };

  // ---------------- IMAGES ➜ PDF ----------------
  const handleImagesToPdf = async () => {
    if (!imageFiles) return;

    setLoading(true);

    const pdfDoc = await PDFDocument.create();

    // A4 size in points
    const PAGE_WIDTH = 595;
    const PAGE_HEIGHT = 842;

    for (const file of Array.from(imageFiles)) {
      const bytes = await file.arrayBuffer();
      const img =
        file.type === "image/png"
          ? await pdfDoc.embedPng(bytes)
          : await pdfDoc.embedJpg(bytes);

      const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

      // Scale image to fit A4 while keeping aspect ratio
      const scale = Math.min(PAGE_WIDTH / img.width, PAGE_HEIGHT / img.height);

      const imgWidth = img.width * scale;
      const imgHeight = img.height * scale;

      const x = (PAGE_WIDTH - imgWidth) / 2;
      const y = (PAGE_HEIGHT - imgHeight) / 2;

      page.drawImage(img, {
        x,
        y,
        width: imgWidth,
        height: imgHeight,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as unknown as ArrayBuffer], {
      type: "application/pdf",
    });

    saveAs(blob, "images.pdf");
    setLoading(false);
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div
        className="p-6 space-y-6 border-2  max-w-3xl
        h-[70vh]
        w-full
        min-w-0
        sm:max-w-4xl
        md:max-w-5xl
        lg:max-w-6xl 
        overflow-auto
        "
      >
        <h1 className="text-2xl font-bold text-center mb-12">
          PDF ⇄ Image Converter
        </h1>

        {/* Mode Switch */}
        <div className="flex gap-4 justify-center flex-wrap min-w-0">
          <button
            onClick={() => setMode("pdf-to-img")}
            className={`px-4 py-2 rounded ${
              mode === "pdf-to-img"
                ? "bg-foreground text-background"
                : "bg-background"
            }`}
          >
            PDF → Images
          </button>
          <button
            onClick={() => setMode("img-to-pdf")}
            className={`px-4 py-2 rounded ${
              mode === "img-to-pdf"
                ? "bg-foreground text-background"
                : "bg-background"
            }`}
          >
            Images → PDF
          </button>
        </div>

        {/* PDF to Image */}
        {mode === "pdf-to-img" && (
          <div className="space-y-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="block mx-auto"
            />

            <button
              onClick={handlePdfToImages}
              disabled={!pdfFile || loading}
              className="block text-center px-4 py-2 bg-blue-600 rounded disabled:opacity-70 mx-auto cursor-pointer text-white"
            >
              Convert
            </button>

            {loading && <p>Converting PDF…</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((src, i) => (
                <img key={i} src={src} alt={`page-${i}`} className="border" />
              ))}
            </div>
          </div>
        )}

        {/* Image to PDF */}
        {mode === "img-to-pdf" && (
          <div className="space-y-4">
            <input
              type="file"
              accept="image/png,image/jpeg"
              multiple
              onChange={(e) => setImageFiles(e.target.files)}
              className="block mx-auto"
            />

            <button
              onClick={handleImagesToPdf}
              disabled={!imageFiles || loading}
              className="block text-center px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 mx-auto cursor-pointer"
            >
              Convert
            </button>

            {loading && <p>Creating PDF…</p>}
          </div>
        )}
      </div>
    </div>
  );
}
