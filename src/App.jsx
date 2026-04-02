import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import FileUpload from "@/components/FileUpload"
import TemplateSelector from "@/components/TemplateSelector"
import DynamicForm from "@/components/DynamicForm"
import PromptGenerator from "@/components/PromptGenerator"
import PriceCalculator from "@/components/PriceCalculator"
import { parseExcelFile } from "@/lib/excelParser"
import { generateExcel } from "@/lib/excelWriter"
import { getAutoFillData, getCategoryPricing } from "@/data/templates"

const ALWAYS_OPTIONAL = ["Importer Name", "Importer Address", "Importer Pincode"]

export default function App() {
  const [workbook, setWorkbook] = useState(null)
  const [fillSheet, setFillSheet] = useState(null)
  const [headers, setHeaders] = useState([])
  const [fieldTypes, setFieldTypes] = useState({})
  const [dropdowns, setDropdowns] = useState({})

  const [formData, setFormData] = useState({})
  const [category, setCategory] = useState("")
  const [supplier, setSupplier] = useState("")
  const [categoryPricing, setCategoryPricing] = useState(null)

  const [isParsing, setIsParsing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  async function handleFileSelect(file) {
    setIsParsing(true)
    setError("")

    try {
      const result = await parseExcelFile(file)
      setWorkbook(result.workbook)
      setFillSheet(result.fillSheet)
      setHeaders(result.validHeaders)
      setFieldTypes(result.fieldTypes)
      setDropdowns(result.dropdowns)
      setFormData(getAutoFillData("", ""))
    } catch (err) {
      console.error(err)
      setError("Could not read file. Make sure it's a valid Meesho template.")
    } finally {
      setIsParsing(false)
    }
  }

  function handleTemplateChange(field, value) {
    if (field === "category") setCategory(value)
    if (field === "supplier") setSupplier(value)

    const newCategory = field === "category" ? value : category
    const newSupplier = field === "supplier" ? value : supplier

    const autoFill = getAutoFillData(newCategory, newSupplier)
    setFormData(prev => ({ ...prev, ...autoFill }))

    if (field === "category") {
      setCategoryPricing(getCategoryPricing(value))
    }
  }

  function handleFieldChange(name, value) {
    setFormData(prev => {
      const updated = { ...prev, [name]: value }

      if (name === "Meesho Price") {
        const price = parseFloat(value)
        updated["Wrong/Defective Returns Price"] = isNaN(price)
          ? ""
          : String(price - 18)
        updated["MRP"] = price >= 399 ? "999" : "499"
      }

      return updated
    })
  }

  async function handleGenerate() {
    if (!workbook || !fillSheet) return
    setIsGenerating(true)

    try {
      await generateExcel(workbook, fillSheet, headers, formData)
    } catch (err) {
      console.error(err)
      setError("Failed to generate Excel. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const hasFile = headers.length > 0
  const compulsoryCount = headers.filter(h => fieldTypes[h.name] === "compulsory").length

  const missingFields = headers
    .filter(h => fieldTypes[h.name] === "compulsory")
    .filter(h => !ALWAYS_OPTIONAL.includes(h.name))
    .filter(h => !formData[h.name] || formData[h.name].trim() === "")
    .map(h => h.name)

  const isFormValid = missingFields.length === 0

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 p-6 transition-colors">

      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
              Meesho Listing Tool
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
              Upload a Meesho Excel template, fill in product details and generate.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsDark(prev => !prev)}
            className="dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </Button>
        </div>
        <Separator className="mt-4 mb-6 dark:bg-neutral-700" />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {!hasFile && (
          <FileUpload
            onFileSelect={handleFileSelect}
            isLoading={isParsing}
          />
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {hasFile && (
          <div className="flex gap-6 items-start">

            {/* Left column - main content */}
            <div className="flex flex-col gap-6 flex-1 min-w-0">
              <TemplateSelector
                category={category}
                supplier={supplier}
                onChange={handleTemplateChange}
              />

              <PriceCalculator
                initialCosts={categoryPricing}
                onPriceConfirm={(price) => handleFieldChange("Meesho Price", price)}
              />

              <Card className="dark:bg-neutral-800 dark:border-neutral-700">
                <CardHeader>
                  <CardTitle className="text-base dark:text-neutral-100">
                    Product Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DynamicForm
                    headers={headers}
                    fieldTypes={fieldTypes}
                    dropdowns={dropdowns}
                    formData={formData}
                    onChange={handleFieldChange}
                    onSubmit={handleGenerate}
                    isGenerating={isGenerating}
                    isFormValid={isFormValid}
                    missingFields={missingFields}
                  />
                </CardContent>
              </Card>

              <PromptGenerator formData={formData} category={category} />
            </div>

            {/* Right column - required fields tracker */}
            <div className="w-64 shrink-0">
              <div className="sticky top-6 flex flex-col gap-3">
                {!isFormValid ? (
                  <div className="bg-white dark:bg-neutral-800 border border-red-200 dark:border-red-800 rounded-xl shadow-sm p-4">
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                      ⚠️ Required fields missing:
                    </p>
                    <ul className="flex flex-col gap-1 mb-3">
                      {missingFields.map(f => (
                        <li
                          key={f}
                          className="text-xs text-red-500 dark:text-red-400 flex items-start gap-1"
                        >
                          <span className="mt-0.5">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Progress bar */}
                    <div className="h-1.5 rounded-full bg-red-100 dark:bg-neutral-700">
                      <div
                        className="h-1.5 rounded-full bg-red-400 dark:bg-red-500 transition-all duration-500"
                        style={{
                          width: `${((compulsoryCount - missingFields.length) / compulsoryCount) * 100}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 text-right">
                      {compulsoryCount - missingFields.length}/{compulsoryCount} filled
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      ✅ All required fields filled!
                    </p>
                    <p className="text-xs text-green-500 dark:text-green-500 mt-1">
                      You can now generate the Excel file.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}