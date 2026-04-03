import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export default function DynamicForm({
    headers,
    fieldTypes,
    dropdowns,
    formData,
    onChange,
    onSubmit,
    onPDFSubmit,
    isGenerating,
    isFormValid,
    missingFields,
}) {
    if (!headers || headers.length === 0) return null

    const [imageErrors, setImageErrors] = useState({})

    const compulsoryFields = headers.filter(h => fieldTypes[h.name] === "compulsory")
    const optionalFields = headers.filter(h => fieldTypes[h.name] === "optional")

    function isImageField(name) {
        return name.toLowerCase().includes("image")
    }

    function isProductIdField(name) {
        return name.toLowerCase().includes("product id") || name.toLowerCase().includes("style id")
    }

    function generateRandomId() {
        const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

        // Start with a letter
        let id = letters.charAt(Math.floor(Math.random() * letters.length))

        // Add 7-8 more random characters (total 8-9)
        const length = Math.random() > 0.5 ? 7 : 8
        for (let i = 0; i < length; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length))
        }

        return id
    }

    function handleImageUrlChange(name, value) {
        onChange(name, value)
        if (value) {
            setImageErrors(prev => ({ ...prev, [name]: false }))
        }
    }

    function handleImageError(name) {
        setImageErrors(prev => ({ ...prev, [name]: true }))
    }

    function renderField({ name }) {
        const isCompulsory = fieldTypes[name] === "compulsory"
        const isMissing = missingFields.includes(name)
        const options = dropdowns[name]
        const isImage = isImageField(name)
        const hasImageError = imageErrors[name]
        const isProductId = isProductIdField(name)
        const hasImagePreview = isImage && formData[name] && !hasImageError

        return (
            <div key={name} className={`flex flex-col gap-1 ${hasImagePreview ? "col-span-2" : ""}`}>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {name}
                    {isCompulsory && (
                        <span className="text-red-500 ml-1">*</span>
                    )}
                </label>

                {options ? (
                    <select
                        value={formData[name] || ""}
                        onChange={e => onChange(name, e.target.value)}
                        className={`border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-colors
                            ${isMissing
                                ? "border-red-400 dark:border-red-500"
                                : "border-neutral-300 dark:border-neutral-600"
                            }`}
                    >
                        <option value="">-- Select --</option>
                        {options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                ) : isImage ? (
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            value={formData[name] || ""}
                            onChange={e => handleImageUrlChange(name, e.target.value)}
                            placeholder={`Enter ${name}`}
                            className={`border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-700 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-colors
                                ${isMissing
                                    ? "border-red-400 dark:border-red-500"
                                    : "border-neutral-300 dark:border-neutral-600"
                                }`}
                        />
                        {formData[name] && !hasImageError && (
                            <div className="border border-neutral-200 dark:border-neutral-600 rounded-lg p-3 bg-white dark:bg-neutral-700 overflow-hidden">
                                <img
                                    src={formData[name]}
                                    alt={name}
                                    className="w-full h-auto rounded-md max-h-48 object-contain mx-auto"
                                    onError={() => handleImageError(name)}
                                />
                            </div>
                        )}
                        {hasImageError && (
                            <div className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                                ⚠️ Failed to load image. Check the URL.
                            </div>
                        )}
                    </div>
                ) : isProductId ? (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={formData[name] || ""}
                            onChange={e => onChange(name, e.target.value)}
                            placeholder={`Enter ${name}`}
                            className={`flex-1 border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-700 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-colors
                                ${isMissing
                                    ? "border-red-400 dark:border-red-500"
                                    : "border-neutral-300 dark:border-neutral-600"
                                }`}
                        />
                        <Button
                            type="button"
                            onClick={() => onChange(name, generateRandomId())}
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            Generate
                        </Button>
                    </div>
                ) : (
                    <input
                        type="text"
                        value={formData[name] || ""}
                        onChange={e => onChange(name, e.target.value)}
                        placeholder={`Enter ${name}`}
                        className={`border rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-700 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-colors
                            ${isMissing
                                ? "border-red-400 dark:border-red-500"
                                : "border-neutral-300 dark:border-neutral-600"
                            }`}
                    />
                )}
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8">

            <div>
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4">
                    Compulsory Fields
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {compulsoryFields.map(renderField)}
                </div>
            </div>

            <Separator className="dark:bg-neutral-700" />

            {optionalFields.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4">
                        Optional Fields
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {optionalFields.map(renderField)}
                    </div>
                </div>
            )}

            {/* Missing fields warning */}
            {!isFormValid && missingFields.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">
                        ⚠️ Please fill in these required fields:
                    </p>
                    <ul className="flex flex-col gap-1 mb-3">
                        {missingFields.map(f => (
                            <li
                                key={f}
                                className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1"
                            >
                                <span className="mt-0.5">•</span>
                                <span>{f}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="h-1.5 rounded-full bg-amber-100 dark:bg-neutral-700">
                        <div
                            className="h-1.5 rounded-full bg-amber-400 dark:bg-amber-500 transition-all duration-500"
                            style={{
                                width: `${((compulsoryFields.length - missingFields.length) / compulsoryFields.length) * 100}%`
                            }}
                        />
                    </div>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 text-right">
                        {compulsoryFields.length - missingFields.length}/{compulsoryFields.length} filled
                    </p>
                </div>
            )}

            <div className="flex gap-3">
                <Button
                    onClick={onSubmit}
                    disabled={isGenerating || !isFormValid}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                    {isGenerating ? "Generating..." : "Generate Excel"}
                </Button>
                <Button
                    onClick={onPDFSubmit}
                    disabled={isGenerating || !isFormValid}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                    {isGenerating ? "Generating..." : "Generate PDF"}
                </Button>
            </div>

        </div>
    )
}