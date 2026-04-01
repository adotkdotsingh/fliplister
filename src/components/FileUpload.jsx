import { useRef } from "react";
import { Button } from "@/components/ui/button";

export default function FileUpload({ onFileSelect, isLoading }) {
    const inputRef = useRef(null);

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) onFileSelect(file);
    }

    function handleDrop(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) onFileSelect(file);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-neutral-300 rounded-xl p-10 flex flex-col items-center justify-center gap-4 bg-white hover:border-neutral-400 transition-colors"
        >
            <div className="text-4xl">📊</div>
            <div className="text-center">
                <p className="text-neutral-700 font-medium">
                    Drag & drop your Meesho Excel file here
                </p>
                <p className="text-neutral-400 text-sm mt-1">
                    Supports .xlsx files only
                </p>
            </div>

            <Button
                variant="outline"
                disabled={isLoading}
                onClick={() => inputRef.current.click()}
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
    );
}