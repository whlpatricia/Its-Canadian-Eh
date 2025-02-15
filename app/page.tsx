"use client"

import styles from "./page.module.css"
import NextLink from "next/link"
import { useState } from "react"

export default function HomePage() {
  const [prompt, setPrompt] = useState("")

  const ScanBarcode = async (): Promise<void> => {
    console.log("barcode is scanned")
    const response = await fetch("/api/process_barcode") // Replace with your API endpoint
    const result = await response.json()
    console.log(result)
  }

  const askGemini = async (): Promise<void> => {
    console.log("get responses from gemini")
    const body = {
      prompt: prompt,
    }

    try {

      const response = await fetch(`./api/gemini?mode=chat`, {
 main
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
      console.log(result.message)
    } catch (error) {
      console.error({ error: `Error in askGemini: ${error}` })
    }
  }

  return (
    <div className={styles.page}>
      <h1>Hello</h1>
      <NextLink href="/results">
        <button onClick={ScanBarcode}>Scan Barcode</button>
      </NextLink>
      <div>
        <textarea
          id="promptBox"
          rows={5} // ✅ Use {1} instead of "1"
          cols={50}
          placeholder="Ask your question..."
          value={prompt} // ✅ Bind input value
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>
        <button onClick={askGemini}>Send</button>
      </div>
      <p>Entered Prompt: {prompt}</p> {/* Display input for testing */}
    </div>
  )
}
