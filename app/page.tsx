"use client"

import styles from "./page.module.css"
import NextLink from "next/link"
import { useState } from "react"
import { useResponse } from "./contexts/ResponseContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { setResponseMessage } = useResponse();
  const router = useRouter()
  const [prompt, setPrompt] = useState("")

  const ScanBarcode = async (): Promise<void> => {
    console.log("barcode is scanned")
    const response = await fetch("/api/process_barcode") // Replace with your API endpoint
    const result = await response.json()
    console.log(result)
  }

  const isPromptEmpty = prompt.trim() === ""

  const choosePrompt = (text) => {
    setPrompt(text)
  }

  const askGemini = async (): Promise<void> => {
    console.log("get responses from gemini")
    const body = {
      prompt: prompt,
    }

    try {
      const response = await fetch(`./api/gemini?mode=chat`, {
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
      setResponseMessage(result.message);
      router.push("/results");
    } catch (error) {
      console.error({ error: `Error in askGemini: ${error}` })
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles["title-box"]}>
        <h1 className={styles.title}>It's Canadian, Eh?</h1>
      </div>
      <div className={styles["prompt-container"]}>
        <p
          className={styles.prompt}
          onClick={() =>
            choosePrompt("Give me a grocery list of only items made in Canada.")
          }
        >
          Give me a grocery list of only items made in Canada.
        </p>
        <p
          className={styles.prompt}
          onClick={() => choosePrompt("What country makes KitKat?")}
        >
          What country makes <span id={styles["food-item"]}>KitKat</span>?
        </p>
        <p
          className={styles.prompt}
          onClick={() =>
            choosePrompt("Show me a list of Canadian-made snacks.")
          }
        >
          Show me a list of Canadian-made snacks.
        </p>
        <p
          className={styles.prompt}
          onClick={() =>
            choosePrompt("What are the best Canadian brands for milk?")
          }
        >
          What are the best Canadian brands for milk?
        </p>
        <p
          className={styles.prompt}
          onClick={() =>
            choosePrompt(
              "Give me a list of Canadian gluten-free food products."
            )
          }
        >
          Give me a list of Canadian gluten-free food products.
        </p>
        <p
          className={styles.prompt}
          onClick={() =>
            choosePrompt("What Canadian companies offer fair-trade chocolate?")
          }
        >
          What Canadian companies offer fair-trade chocolate?
        </p>
      </div>
      <div className={styles["button-chatbox"]}>
        <NextLink href="/results">
          <button className={styles["barcode-button"]} onClick={ScanBarcode}>
            Scan Barcode
          </button>
        </NextLink>
        <div className={styles["chatbox-container"]}>
          <textarea
            className={styles.chatbox}
            id="promptBox"
            rows={2} // ✅ Use {1} instead of "1"
            cols={50}
            placeholder="Ask your question..."
            value={prompt} // ✅ Bind input value
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <button className={styles["send-button"]} onClick={askGemini} disabled={isPromptEmpty}>
            <div className={styles["send-button-wrapper"]}>
              <img
                src="/maple_leaf.png"
                alt="Maple Leaf"
                style={{ width: "24px", height: "24px" }}
              />
              <div className={styles["send-button-text"]}>Send</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
