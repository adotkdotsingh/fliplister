import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const REQUIRED_FIELDS = [
    "Manufacturer Name",
    "Capacity",
    "Volume Unit",
    "Color",
    "Material",
    "Net Quantity (N)",
    "Type",
]

export default function PromptGenerator({ formData, category }) {
    const [prompt, setPrompt] = useState("")
    const [copied, setCopied] = useState(false)

    // const missingForPrompt = REQUIRED_FIELDS.filter(
    //     f => !formData[f] || formData[f].trim() === ""
    // )

    // const canGenerate = missingForPrompt.length === 0

    function handleGenerate() {
        const brand = formData["Manufacturer Name"]
        const capacity = formData["Capacity"]
        const unit = formData["Volume Unit"]
        const color = formData["Color"]
        const material = formData["Material"]
        const qty = formData["Net Quantity (N)"]
        const type = formData["Type"]

        const generated = `Generate a Meesho product listing title and description using the details below. The title should be under 130 characters, catchy, and include key product details. Ignore details which are undefined. The description should be 3-5 sentences, highlight the product features, and be written in simple English suitable for Indian online shoppers.

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
        <Card>
            <CardHeader>
                <CardTitle className="text-base">AI Prompt Generator</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">

                {/* Missing fields warning */}
                {/* {!canGenerate && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-lg">
                        <p className="font-medium mb-1">
                            Fill these fields first to generate prompt:
                        </p>
                        <ul className="list-disc list-inside space-y-0.5">
                            {missingForPrompt.map(f => (
                                <li key={f}>{f}</li>
                            ))}
                        </ul>
                    </div>
                )} */}

                <Button
                    variant="outline"
                    onClick={handleGenerate}
                >
                    ✨ Generate AI Prompt
                </Button>

                {/* Prompt output */}
                {prompt && (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-neutral-600">
                                Copy this prompt and paste it into ChatGPT / Gemini:
                            </p>
                            <button
                                onClick={handleCopy}
                                className="text-xs text-neutral-500 hover:text-neutral-800 border border-neutral-300 rounded px-2 py-1 transition-colors"
                            >
                                {copied ? "✅ Copied!" : "Copy"}
                            </button>
                        </div>
                        <textarea
                            readOnly
                            value={prompt}
                            rows={12}
                            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-700 bg-neutral-50 resize-none focus:outline-none"
                        />
                    </div>
                )}

            </CardContent>
        </Card>
    )
}