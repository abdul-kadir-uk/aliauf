"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { Document, Packer, Paragraph } from "docx";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfDoc = () => {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<"pdfToDoc" | "docToPdf">("pdfToDoc");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);

    try {
      if (type === "pdfToDoc") {
        await pdfToDoc(file);
      } else {
        await docToPdf(file);
      }
    } catch (err) {
      console.error(err);
      alert("Conversion failed");
    }

    setLoading(false);
  };

  // ---------------- PDF ➜ DOC ----------------
  const pdfToDoc = async (pdfFile: File) => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const paragraphs: Paragraph[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      content.items.forEach((item: any) => {
        if (item.str.trim()) {
          paragraphs.push(new Paragraph(item.str));
        }
      });
    }

    const doc = new Document({
      sections: [{ children: paragraphs }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "converted.docx");
  };

  // ---------------- DOC ➜ PDF ----------------
  const docToPdf = async (docFile: File) => {
    const text = await docFile.text();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    page.drawText(text.substring(0, 4000), {
      x: 40,
      y: height - 50,
      size: 12,
      maxWidth: width - 80,
      lineHeight: 14,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as unknown as ArrayBuffer], {
      type: "application/pdf",
    });

    saveAs(blob, "converted.pdf");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">PDF ⇄ DOC Converter</h2>

      <select
        className="w-full p-2 border rounded"
        value={type}
        onChange={(e) => setType(e.target.value as any)}
      >
        <option value="pdfToDoc">PDF ➜ DOC</option>
        <option value="docToPdf">DOC ➜ PDF</option>
      </select>

      <input
        type="file"
        accept={type === "pdfToDoc" ? ".pdf" : ".doc,.docx"}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full"
      />

      <button
        onClick={handleConvert}
        disabled={!file || loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Converting..." : "Convert"}
      </button>
    </div>
  );
};

export default PdfDoc;
