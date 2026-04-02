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
  const [fileName, setFileName] = useState("")

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
    setFileName(file.name)

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
      await generateExcel(workbook, fillSheet, headers, formData, fileName)
    } catch (err) {
      console.error(err)
      setError("Failed to generate Excel. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const hasFile = headers.length > 0

  const missingFields = headers
    .filter(h => fieldTypes[h.name] === "compulsory")
    .filter(h => !ALWAYS_OPTIONAL.includes(h.name))
    .filter(h => !formData[h.name] || formData[h.name].trim() === "")
    .map(h => h.name)

  const isFormValid = missingFields.length === 0

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 p-6 transition-colors">

      {/* Header */}
      <div className="max-w-5xl mx-auto">
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

      <div className="max-w-5xl mx-auto flex flex-col gap-6">

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
          <>
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
          </>
        )}

      </div>
    </div>
  )
}