import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config()

export async function POST(req) {
    try {
        const body = await req.json();
        const { prompt } = body;
        console.log('Prompt:', prompt);

        // get Gemini API key
        const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            return NextResponse.json({ error: "API key is missing" }, { status: 500 });
        }

        // send to Gemini
        const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
            })
        });
        const res = await apiResponse.json()
        console.log(`apiResponse !!!! ${res}`);

        const text = apiResponse.candidates[0].content.parts[0].text;
        console.log(text);

        return NextResponse.json({ response: `You sent: ${prompt} and received: ${text}` }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Invalid request with ${error}` }, { status: 400 });
    }
}

