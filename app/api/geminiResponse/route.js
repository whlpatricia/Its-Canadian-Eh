import { NextResponse } from "next/server"
import dotenv from "dotenv"

dotenv.config()

const geminiURL = process.env.NEXT_PUBLIC_GEMINI_URL
const apiKey = process.env.NEXT_PUBLIC_API_KEY

export async function POST(request) {
  console.log("im in geminiResponse")
  try {
    const { prompt } = await request.json()
    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }

    const response = await fetch(`${geminiURL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    console.log(`response is: ${response}`)
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }
    const result = await response.json()
    const message = result.candidates[0].content.parts[0].text
    return NextResponse.json({ message: message })
  } catch (error) {
    console.error({ error: `Error in askGemini: ${error}` })
  }
}
