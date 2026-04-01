import { Card, CardContent } from "@/components/ui/card"

const CATEGORIES = ["Cups", "Mugs"];
const SUPPLIERS = ["Mishika", "Shivi", "Jayas"];

export default function TemplateSelector({ category, supplier, onChange }) {
    return (
        <Card>
            <CardContent className="flex gap-6 pt-5">

                {/* Category */}
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-sm font-medium text-neutral-700">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={e => onChange("category", e.target.value)}
                        className="border border-neutral-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    >
                        <option value="">-- Select Category --</option>
                        {CATEGORIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Supplier */}
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-sm font-medium text-neutral-700">
                        Supplier
                    </label>
                    <select
                        value={supplier}
                        onChange={e => onChange("supplier", e.target.value)}
                        className="border border-neutral-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    >
                        <option value="">-- Select Supplier --</option>
                        {SUPPLIERS.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

            </CardContent>
        </Card>
    );
}