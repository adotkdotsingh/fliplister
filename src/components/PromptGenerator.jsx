import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PromptGenerator({ formData, category }) {
    const [prompt, setPrompt] = useState("")
    const [copied, setCopied] = useState(false)

    function handleGenerate() {
        const brand = formData["Brand"] || formData["Manufacturer Name"] || ""
        const capacity = formData["Capacity"] || ""
        const unit = formData["Volume Unit"] || ""
        const color = formData["Color"] || ""
        const material = formData["Material"] || ""
        const qty = formData["Net Quantity (N)"] || ""
        const type = formData["Type"] || ""

        const generated = `Generate a Meesho product listing title and description using the details below. The title should be under 130 characters, catchy, and include key product details. Ignore details which are empty. The description should be 3-5 sentences, highlight the product features, and be written in simple English suitable for Indian online shoppers.

Product Details:
- Brand / Firm Name: ${brand}
- Category: ${category || ""}
- Type: ${type}
- Capacity: ${capacity} ${unit}
- Color: ${color}
- Material: ${material}
- Net Quantity: ${qty}

Output format:
Title: [generated title here]
Description: [generated description here]`

        setPrompt(generated)
        setCopied(false)
    }

    function handleCopy() {
        navigator.clipboard.writeText(prompt)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Card className="dark:bg-neutral-800 dark:border-neutral-700">
            <CardHeader>
                <CardTitle className="text-base dark:text-neutral-100">
                    AI Prompt Generator
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">

                <Button
                    variant="outline"
                    onClick={handleGenerate}
                    className="dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                    ✨ Generate AI Prompt
                </Button>

                {prompt && (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                Copy this prompt and paste it into ChatGPT / Gemini:
                            </p>
                            <button
                                onClick={handleCopy}
                                className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 border border-neutral-300 dark:border-neutral-600 rounded px-2 py-1 transition-colors"
                            >
                                {copied ? "✅ Copied!" : "Copy"}
                            </button>
                        </div>
                        <textarea
                            readOnly
                            value={prompt}
                            rows={12}
                            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900 resize-none focus:outline-none"
                        />
                    </div>
                )}

            </CardContent>
        </Card>
    )
}