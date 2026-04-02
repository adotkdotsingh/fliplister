import { Card, CardContent } from "@/components/ui/card"

const CATEGORIES = ["Cups", "Mugs"]
const SUPPLIERS = ["Mishika", "Shivi", "Jayas"]

export default function TemplateSelector({ category, supplier, onChange }) {
    return (
        <Card className="dark:bg-neutral-800 dark:border-neutral-700">
            <CardContent className="flex gap-6 pt-5">

                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={e => onChange("category", e.target.value)}
                        className="border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    >
                        <option value="">Select Category</option>
                        {CATEGORIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Supplier
                    </label>
                    <select
                        value={supplier}
                        onChange={e => onChange("supplier", e.target.value)}
                        className="border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    >
                        <option value="">Select Supplier</option>
                        {SUPPLIERS.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

            </CardContent>
        </Card>
    )
}