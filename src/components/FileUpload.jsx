import { useRef } from "react"
import { Button } from "@/components/ui/button"

export default function FileUpload({ onFileSelect, isLoading }) {
    const inputRef = useRef(null)

    function handleFileChange(e) {
        const file = e.target.files[0]
        if (file) onFileSelect(file)
    }

    function handleDrop(e) {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file) onFileSelect(file)
    }

    function handleDragOver(e) {
        e.preventDefault()
    }

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl p-10 flex flex-col items-center justify-center gap-4 bg-white dark:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
        >
            <div className="text-4xl">📊</div>
            <div className="text-center">
                <p className="text-neutral-700 dark:text-neutral-200 font-medium">
                    Drag & drop your Meesho Excel file here
                </p>
                <p className="text-neutral-400 dark:text-neutral-500 text-sm mt-1">
                    Supports .xlsx files only
                </p>
            </div>

            <Button
                variant="outline"
                disabled={isLoading}
                onClick={() => inputRef.current.click()}
                className="dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
                {isLoading ? "Reading file..." : "Browse File"}
            </Button>

            <input
                ref={inputRef}
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    )
}