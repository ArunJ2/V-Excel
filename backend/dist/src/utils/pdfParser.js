import fs from 'fs/promises';
import pdf from 'pdf-parse';
export async function parsePDF(filePath) {
    try {
        const dataBuffer = await fs.readFile(filePath);
        // Use default export function
        const data = await pdf(dataBuffer);
        return {
            raw_text: data.text,
            metadata: data.metadata,
            info: data.info,
            // Simulated extraction of key fields
            summary: data.text.substring(0, 500) + '...', // First 500 chars as summary
            detected_ipp: data.text.match(/IPP[-\s]?\d+/i)?.[0] || null,
        };
    }
    catch (err) {
        console.error('PDF Parse Error:', err);
        // Fallback for Vercel/Serverless where PDF parsing might be flaky
        return {
            raw_text: "PDF parsing failed or not supported in this environment.",
            metadata: {},
            info: {},
            summary: "Report uploaded successfully.",
            detected_ipp: null
        };
    }
}
