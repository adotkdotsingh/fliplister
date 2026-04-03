import { jsPDF } from 'jspdf'

export async function generatePDF(listings, headers, fieldTypes) {
    try {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        })

        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()

        for (let listingIndex = 0; listingIndex < listings.length; listingIndex++) {
            const listing = listings[listingIndex]

            // Add new page for each listing (except first)
            if (listingIndex > 0) {
                pdf.addPage()
            }

            let yPosition = 10

            // Add title
            pdf.setFontSize(16)
            pdf.setFont(undefined, 'bold')
            pdf.text(`Product Listing ${listingIndex + 1}`, 10, yPosition)
            yPosition += 8

            // Add separator line
            pdf.setDrawColor(0, 0, 0)
            pdf.line(10, yPosition, pageWidth - 10, yPosition)
            yPosition += 6

            const compulsoryFields = headers.filter(h => fieldTypes[h.name] === "compulsory")
            const optionalFields = headers.filter(h => fieldTypes[h.name] === "optional")

            // Add compulsory fields section
            if (compulsoryFields.length > 0) {
                yPosition = addSection(pdf, 'Compulsory Fields', compulsoryFields, listing, fieldTypes, yPosition, pageHeight)
            }

            // Add optional fields section
            if (optionalFields.length > 0) {
                yPosition = addSection(pdf, 'Optional Fields', optionalFields, listing, fieldTypes, yPosition, pageHeight)
            }
        }

        // Download PDF
        pdf.save('meesho-listings.pdf')
    } catch (error) {
        console.error('PDF Generation Error:', error)
        throw error
    }
}

function addSection(pdf, sectionTitle, fields, listing, fieldTypes, startY, pageHeight) {
    let yPosition = startY
    const pageMargin = 10
    const maxWidth = pdf.internal.pageSize.getWidth() - 20

    // Section title
    pdf.setFontSize(12)
    pdf.setFont(undefined, 'bold')
    pdf.text(sectionTitle, 10, yPosition)
    yPosition += 6

    // Draw section separator
    pdf.setDrawColor(150, 150, 150)
    pdf.line(10, yPosition, 35, yPosition)
    yPosition += 5

    pdf.setFontSize(10)
    pdf.setFont(undefined, 'normal')

    const fieldsPerRow = 2
    const colWidth = maxWidth / fieldsPerRow
    const cellPadding = 2

    // Group fields into rows
    for (let i = 0; i < fields.length; i += fieldsPerRow) {
        // Check if we need a new page (estimate cell height at 20mm)
        if (yPosition + 22 > pageHeight - pageMargin) {
            pdf.addPage()
            yPosition = pageMargin + 5
        }

        // Draw up to 2 fields per row
        const rowFields = fields.slice(i, i + fieldsPerRow)
        let maxCellHeight = 20

        rowFields.forEach((field, colIndex) => {
            const xPos = 10 + (colIndex * colWidth)
            const fieldValue = listing[field.name] || ''

            // Draw field box
            pdf.setDrawColor(180, 180, 180)
            pdf.setFillColor(240, 240, 240)

            const cellHeight = 20
            pdf.rect(xPos, yPosition, colWidth - 2, cellHeight, 'FD')

            // Field label with required indicator
            pdf.setFont(undefined, 'bold')
            pdf.setFontSize(10)
            const label = fieldTypes[field.name] === "compulsory"
                ? `${field.name} *`
                : field.name

            pdf.text(label, xPos + cellPadding, yPosition + 5, { maxWidth: colWidth - 4 })

            // Field value
            pdf.setFont(undefined, 'normal')
            pdf.setFontSize(10)
            const displayValue = fieldValue || '(empty)'

            // Split text and display
            const textLines = pdf.splitTextToSize(displayValue, colWidth - 4)
            const textToShow = textLines.slice(0, 2).join(' ') // Show max 2 lines
            pdf.text(textToShow, xPos + cellPadding, yPosition + 13, { maxWidth: colWidth - 4 })

            maxCellHeight = Math.max(maxCellHeight, cellHeight)
        })

        yPosition += maxCellHeight + 3
    }

    return yPosition
}
