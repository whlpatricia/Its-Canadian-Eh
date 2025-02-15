"use server"

import { NextResponse } from "next/server"

export async function GET() {
    // const apiKey = '';
    // const barcode = '077341125112'; // Example barcode number - update accordingly
    // const apiUrl = `https://api.barcodelookup.com/v3/products?barcode=${barcode}&key=${apiKey}`;
    // const response =  await fetch(apiUrl);
    // return response.json();
    return NextResponse.json({"message": 1});
}






// http.createServer(async (req, res) => {
//     if (req.url === '/') {
//         const response =  await fetch(apiUrl);
//         if (response.status === 200) {
//             const data = await response.json();
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify(data, null, 2)); // Pretty-printed JSON
//         } else if (response.status === 403) {
//             res.writeHead(403, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ error: 'Invalid API key' }));
//         } else if (response.status === 404) {
//             res.writeHead(404, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ error: 'No data returned' }));
//         } else if (response.status === 429) {
//             res.writeHead(429, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ error: 'Exceeded API call limits' }));
//         }
//     }
// }).listen(3000);

