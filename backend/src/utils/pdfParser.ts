import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';

export async function parsePDF(filePath: string) {
    try {
        const dataBuffer = await fs.readFile(filePath);
        const parser = new PDFParse({ data: dataBuffer });

        const textData = await parser.getText();
        const infoData = await parser.getInfo();

        const text = textData.text;

        return {
            raw_text: text,
            metadata: infoData.metadata,
            info: infoData.info,
            // Simulated extraction of key fields
            summary: text.substring(0, 500) + '...', // First 500 chars as summary
            detected_ipp: text.match(/IPP[-\s]?\d+/i)?.[0] || null,
        };
    } catch (err) {
        console.error('PDF Parse Error:', err);
        throw new Error('Failed to parse PDF document');
    }
}
