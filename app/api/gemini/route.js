import { NextResponse } from "next/server"
import dotenv from "dotenv"

dotenv.config()

const geminiURL = process.env.NEXT_PUBLIC_GEMINI_URL
const apiKey = process.env.NEXT_PUBLIC_API_KEY

const constructPrompt = (productName) => {
  return `What country is the product "${productName}" from? If the product/brand name is unrecognized or the country cannot be determined, 
  return "Unknown" for the country. Respond strictly in the following JSON format, with no additional text before or after the JSON:
  {
    "country": "{country or 'Unknown'}", 
    "list": ["alternative product from Canada 1", "alternative product from Canada 2", ... up to 5]
  }`
}

export async function POST(request) {
  console.log("im in gemini")
  try {
    let { prompt } = await request.json()
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get("mode")

    if (!mode || (mode !== "scan" && mode !== "chat")) {
      return NextResponse.json(
        { error: "Invalid mode. Use 'scan' or 'chat'." },
        { status: 400 }
      )
    }

    if (mode === "scan") {
      prompt = constructPrompt(prompt)
    }

    console.log(prompt)

    const body = {
      contents: [
        {
          parts: [{ text: prompt + "Make it short. I need brand names. Do not use markdown in your response." }],
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
    console.log(`in gemini.js: response is: ${response}`)
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
    }
    const result = await response.json()
    const message = result.candidates[0].content.parts[0].text
    return NextResponse.json({ message: message })
  } catch (error) {
    console.error({ error: `Error in api/gemini: ${error}` })
  }
}
