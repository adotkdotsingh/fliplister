import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const COST_LABELS = {
    productCost: "Product Cost (₹)",
    packingCost: "Packing Cost (₹)",
    adCost: "Ad Cost (₹)",
    returnCost: "Return Cost (₹)",
    marginCost: "Margin (₹)",
}

const DEFAULT_COSTS = {
    productCost: 0,
    packingCost: 0,
    adCost: 0,
    returnCost: 0,
    marginCost: 0,
}

export default function PriceCalculator({ onPriceConfirm, initialCosts }) {
    const [costs, setCosts] = useState(DEFAULT_COSTS)
    const [total, setTotal] = useState(0)

    // sync costs when category changes
    useEffect(() => {
        if (initialCosts) {
            setCosts(initialCosts)
        }
    }, [initialCosts])

    // recalculate total whenever costs change
    useEffect(() => {
        const sum = Object.values(costs).reduce((a, b) => a + (Number(b) || 0), 0)
        setTotal(sum)
    }, [costs])

    function handleChange(key, value) {
        setCosts(prev => ({ ...prev, [key]: value === "" ? "" : Number(value) }))
    }

    function handleReset() {
        setCosts(initialCosts || DEFAULT_COSTS)
    }

    return (
        <Card className="dark:bg-neutral-800 dark:border-neutral-700">
            <CardHeader>
                <CardTitle className="text-base dark:text-neutral-100">
                    💰 Price Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">

                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(costs).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                {COST_LABELS[key]}
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={value === 0 ? "" : value}
                                onChange={e => handleChange(key, e.target.value)}
                                className="border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                            />
                        </div>
                    ))}
                </div>

                {/* Total display */}
                <div className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-3 mt-2">
                    <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        Total Meesho Price
                    </span>
                    <span className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                        ₹{total}
                    </span>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"
                    >
                        Reset
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={() => onPriceConfirm(String(total))}
                        disabled={total === 0}
                    >
                        Use ₹{total} as Meesho Price
                    </Button>
                </div>

            </CardContent>
        </Card>
    )
}