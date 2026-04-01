import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import FileUpload from "@/components/FileUpload"
import TemplateSelector from "@/components/TemplateSelector"
import DynamicForm from "@/components/DynamicForm"
import { parseExcelFile } from "@/lib/excelParser"
import { generateExcel } from "@/lib/excelWriter"
import { getAutoFillData } from "@/data/templates"
import PromptGenerator from "@/components/PromptGenerator"

export default function App() {
  // excel state
  const [workbook, setWorkbook] = useState(null)
  const [fillSheet, setFillSheet] = useState(null)
  const [headers, setHeaders] = useState([])
  const [fieldTypes, setFieldTypes] = useState({})
  const [dropdowns, setDropdowns] = useState({})

  // form state
  const [formData, setFormData] = useState({})
  const [category, setCategory] = useState("")
  const [supplier, setSupplier] = useState("")

  // ui state
  const [isParsing, setIsParsing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState("")

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

      // apply defaults immediately
      const defaults = getAutoFillData("", "")
      setFormData(defaults)

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

    // merge autofill over existing form data
    const autoFill = getAutoFillData(newCategory, newSupplier)
    setFormData(prev => ({ ...prev, ...autoFill }))
  }

  function handleFieldChange(name, value) {
    setFormData(prev => {
      const updated = { ...prev, [name]: value }

      // Rule 1 — auto calc return price
      if (name === "Meesho Price") {
        const price = parseFloat(value)
        updated["Wrong/Defective Returns Price"] = isNaN(price)
          ? ""
          : String(price - 18)
      }

      // Rule 2 - auto update mrp based on meesho price
      if (name === "Meesho Price") {
        const price = Number(value)

        updated["MRP"] =
          price >= 399
            ? "999"
            : price < 399
              ? "499"
              : ""
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

  // new column
  const missingFields = headers
    .filter(h => fieldTypes[h.name] === "compulsory")
    .filter(h => !formData[h.name] || formData[h.name].trim() === "")
    .map(h => h.name)

  const isFormValid = missingFields.length === 0


  return (
    <div className="min-h-screen bg-neutral-100 p-6">

      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-neutral-800">
          Meesho Listing Tool
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          Upload a Meesho Excel template, fill in product details and generate.
        </p>
        <Separator className="mt-4 mb-6" />
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* Upload */}
        <FileUpload
          onFileSelect={handleFileSelect}
          isLoading={isParsing}
        />

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* File name confirmation */}
        {fileName && !error && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
            ✅ Loaded: <span className="font-medium">{fileName}</span>
          </div>
        )}

        {/* Template Selector + Form */}
        {hasFile && (
          <>
            <TemplateSelector
              category={category}
              supplier={supplier}
              onChange={handleTemplateChange}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
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
                  isFormValid={isFormValid}  // new 
                  missingFields={missingFields} //new
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