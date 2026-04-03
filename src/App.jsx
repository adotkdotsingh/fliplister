import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import FileUpload from "@/components/FileUpload"
import TemplateSelector from "@/components/TemplateSelector"
import DynamicForm from "@/components/DynamicForm"
import PromptGenerator from "@/components/PromptGenerator"
import PriceCalculator from "@/components/PriceCalculator"
import ListingTabs from "@/components/ListingTabs"
import { parseExcelFile } from "@/lib/excelParser"
import { generateExcel } from "@/lib/excelWriter"
import { generatePDF } from "@/lib/pdfGenerator"
import { getAutoFillData, getCategoryPricing } from "@/data/templates"

const ALWAYS_OPTIONAL = ["Importer Name", "Importer Address", "Importer Pincode"]

export default function App() {
  const [workbook, setWorkbook] = useState(null)
  const [fillSheet, setFillSheet] = useState(null)
  const [headers, setHeaders] = useState([])
  const [fieldTypes, setFieldTypes] = useState({})
  const [dropdowns, setDropdowns] = useState({})

  const [listings, setListings] = useState([{}])
  const [activeListingIndex, setActiveListingIndex] = useState(0)
  const [category, setCategory] = useState("")
  const [supplier, setSupplier] = useState("")
  const [categoryPricing, setCategoryPricing] = useState(null)
  const [fileName, setFileName] = useState("")

  const [isParsing, setIsParsing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const [isDark, setIsDark] = useState(true)

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
      setListings([getAutoFillData("", "")])
      setActiveListingIndex(0)
      setCategory("")
      setSupplier("")
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

    setListings(prev => {
      const updated = [...prev]
      updated[activeListingIndex] = { ...updated[activeListingIndex], ...autoFill }
      return updated
    })

    if (field === "category") {
      setCategoryPricing(getCategoryPricing(value))
    }
  }

  function handleFieldChange(name, value) {
    setListings(prev => {
      const updated = [...prev]
      const currentListing = { ...updated[activeListingIndex], [name]: value }

      if (name === "Meesho Price") {
        const price = parseFloat(value)
        currentListing["Wrong/Defective Returns Price"] = isNaN(price)
          ? ""
          : String(price - 18)
        currentListing["MRP"] = price >= 399 ? "999" : "499"
      }

      updated[activeListingIndex] = currentListing
      return updated
    })
  }

  function handleAddListing() {
    const newListing = getAutoFillData(category, supplier)
    setListings(prev => [...prev, newListing])
    setActiveListingIndex(listings.length)
  }

  function handleDeleteListing(index) {
    if (listings.length === 1) return

    setListings(prev => prev.filter((_, i) => i !== index))

    if (activeListingIndex >= index && activeListingIndex > 0) {
      setActiveListingIndex(activeListingIndex - 1)
    }
  }

  async function handleGenerate() {
    if (!workbook || !fillSheet) return

    // Validate all listings
    const allListingsValid = listings.every(listing =>
      headers
        .filter(h => fieldTypes[h.name] === "compulsory")
        .filter(h => !ALWAYS_OPTIONAL.includes(h.name))
        .every(h => listing[h.name] && listing[h.name].trim() !== "")
    )

    if (!allListingsValid) {
      setError("Please fill all required fields in all listings before generating.")
      return
    }

    setIsGenerating(true)

    try {
      await generateExcel(workbook, fillSheet, headers, listings)
    } catch (err) {
      console.error(err)
      setError("Failed to generate Excel. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleGeneratePDF() {
    // Validate all listings
    const allListingsValid = listings.every(listing =>
      headers
        .filter(h => fieldTypes[h.name] === "compulsory")
        .filter(h => !ALWAYS_OPTIONAL.includes(h.name))
        .every(h => listing[h.name] && listing[h.name].trim() !== "")
    )

    if (!allListingsValid) {
      setError("Please fill all required fields in all listings before generating.")
      return
    }

    setIsGenerating(true)

    try {
      await generatePDF(listings, headers, fieldTypes)
    } catch (err) {
      console.error(err)
      setError("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const hasFile = headers.length > 0
  const activeListing = listings[activeListingIndex] || {}

  const missingFields = headers
    .filter(h => fieldTypes[h.name] === "compulsory")
    .filter(h => !ALWAYS_OPTIONAL.includes(h.name))
    .filter(h => !activeListing[h.name] || activeListing[h.name].trim() === "")
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
            <ListingTabs
              listings={listings}
              activeIndex={activeListingIndex}
              onTabClick={setActiveListingIndex}
              onAddTab={handleAddListing}
              onDeleteTab={handleDeleteListing}
            />

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
                  formData={activeListing}
                  onChange={handleFieldChange}
                  onSubmit={handleGenerate}
                  onPDFSubmit={handleGeneratePDF}
                  isGenerating={isGenerating}
                  isFormValid={isFormValid}
                  missingFields={missingFields}
                />
              </CardContent>
            </Card>

            <PromptGenerator formData={activeListing} category={category} />
          </>
        )}

      </div>
    </div>
  )
}