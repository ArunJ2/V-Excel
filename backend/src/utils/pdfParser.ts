import fs from 'fs/promises';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
// No explicitly require needed if using ESM and allowed by NodeNext
// But if Typescript complains, we might need types or ignore
// @ts-ignore
// const pdfjsLib = { getDocument };

export async function parsePDF(filePath: string) {
    try {
        const dataBuffer = await fs.readFile(filePath);
        const data = new Uint8Array(dataBuffer);

        const loadingTask = getDocument({
            data,
            useSystemFonts: true,
            disableFontFace: true,
        });

        const pdfDocument = await loadingTask.promise;
        const numPages = pdfDocument.numPages;
        let fullText = '';
        let metadata = {};
        let info = {};

        try {
            const meta = await pdfDocument.getMetadata();
            metadata = meta.metadata || {};
            info = meta.info || {};
        } catch (e) {
            console.warn('Could not get metadata', e);
        }

        for (let i = 1; i <= numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
        }

        return {
            raw_text: fullText,
            metadata: metadata,
            info: info,
            summary: fullText.substring(0, 500) + '...',
            detected_ipp: fullText.match(/IPP[-\s]?\d+/i)?.[0] || null,
        };
    } catch (err) {
        console.error('PDF Parse Error:', err);
        return {
            raw_text: "PDF parsing failed or not supported in this environment.",
            metadata: {},
            info: {},
            summary: "Report uploaded successfully (Parsing failed).",
            detected_ipp: null
        };
    }
}
