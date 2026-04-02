import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function DynamicForm({
    headers,
    fieldTypes,
    dropdowns,
    formData,
    onChange,
    onSubmit,
    isGenerating,
    isFormValid,
    missingFields,
}) {
    if (!headers || headers.length === 0) return null

    const compulsoryFields = headers.filter(h => fieldTypes[h.name] === "compulsory")
    const optionalFields = headers.filter(h => fieldTypes[h.name] === "optional")

    function renderField({ name }) {
        const isCompulsory = fieldTypes[name] === "compulsory"
        const isMissing = missingFields.includes(name)
        const options = dropdowns[name]

        return (
            <div key={name} className="flex flex-col gap-1">
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

            <Button
                onClick={onSubmit}
                disabled={isGenerating || !isFormValid}
                className="w-full"
            >
                {isGenerating ? "Generating..." : "Generate Excel"}
            </Button>

        </div>
    )
}