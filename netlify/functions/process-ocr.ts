
// // Simple OCR/ML processing stub endpoint.
// // Accepts JSON payload: { fileName: string, mimeType: string, data: string (base64), complaintId?: string, userId?: string }
// // Returns: { jobId, complaintId, userId, ocr: { text, confidence }, ml: { classification, score }, status }

// // NOTE:
// // - In production, wire this to an OCR provider (Google Vision, AWS Textract, Azure Form Recognizer, Tesseract server)
// //   and your ML model endpoint. Use environment variables for API keys/URLs.
// // - Keep payload sizes reasonable (<10MB) or move to signed upload URLs (S3/GCS) and send the file URL instead.

// const handler = async (event: any) => {
//   if (event.httpMethod !== "POST") {
//     return {
//       statusCode: 405,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ error: "Method Not Allowed" }),
//     };
//   }

//   try {
//     if (!event.body) {
//       return { statusCode: 400, body: JSON.stringify({ error: "Missing request body" }) };
//     }

//     const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";
//     if (!contentType.includes("application/json")) {
//       return {
//         statusCode: 415,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           error: "Unsupported Media Type",
//           message: "Send JSON with base64 file: { fileName, mimeType, data }",
//         }),
//       };
//     }

//     const payload = JSON.parse(event.body);
//     const { fileName, mimeType, data, complaintId, userId } = payload || {};

//     if (!fileName || !mimeType || !data) {
//       return {
//         statusCode: 400,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ error: "fileName, mimeType and data (base64) are required" }),
//       };
//     }

//     // Convert base64 to Buffer (you would pass this to your OCR provider)
//     // const fileBuffer = Buffer.from(data, "base64");

//     // === OCR PLACEHOLDER ===
//     // Replace this with a real OCR call. For demo, pretend we extracted text.
//     const mockExtractedText = `Extracted text from ${fileName} (mime=${mimeType}).\nThis is placeholder OCR output.`;
//     const mockConfidence = 0.92;

//     // === ML PLACEHOLDER ===
//     // Replace this with call to your ML model (HTTP endpoint). Send the OCR text/context.
//     const mockClassification = "land_claim_supporting_document";
//     const mockScore = 0.87;

//     const jobId = `ocr_${Date.now()}`;

//     return {
//       statusCode: 200,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         jobId,
//         complaintId: complaintId || null,
//         userId: userId || null,
//         status: "processed",
//         ocr: {
//           text: mockExtractedText,
//           confidence: mockConfidence,
//         },
//         ml: {
//           classification: mockClassification,
//           score: mockScore,
//         },
//         // Preserve some metadata for admin review UIs
//         document: {
//           fileName,
//           mimeType,
//           sizeBytesBase64: data.length,
//         },
//         receivedAt: new Date().toISOString(),
//       }),
//     };
//   } catch (err: any) {
//     return {
//       statusCode: 500,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ error: "Failed to process document", details: err?.message || String(err) }),
//     };
//   }
// };

// export { handler };


