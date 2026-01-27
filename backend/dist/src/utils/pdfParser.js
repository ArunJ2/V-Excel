// PDF parsing is disabled for Vercel serverless compatibility
// pdfjs-dist and similar libraries can cause issues in serverless environments
export async function parsePDF(filePath) {
    // Return a stub response since PDF parsing is not supported in serverless
    console.log('PDF parsing requested for:', filePath);
    return {
        raw_text: "PDF parsing is not available in serverless environment.",
        metadata: {},
        info: {},
        summary: "Document uploaded successfully. Full parsing available in development mode.",
        detected_ipp: null
    };
}
