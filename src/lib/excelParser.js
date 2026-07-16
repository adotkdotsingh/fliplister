import ExcelJS from "exceljs";

// Skipped fields - system use only
const SKIP_FIELDS = ["Fields + Description:", "ERROR STATUS", "ERROR MESSAGE"];
const ALWAYS_OPTIONAL = [
    "Importer Name",
    "Importer Address",
    "Importer Pincode"
];

function extractFieldName(cell) {
    if (!cell) return "";

    // ✅ handle rich text (FIXED)
    if (cell?.richText?.length > 0) {
        const fullText = cell.richText.map(r => r.text).join("");

        const lines = fullText
            .split("\n")
            .map(l => l.trim())
            .filter(Boolean);

        return lines[0] || "";
    }

    if (typeof cell === "string") {
        const lines = cell.split("\n").map(l => l.trim()).filter(Boolean);
        return lines[0] || "";
    }

    return "";
}

export async function parseExcelFile(file) {
    const arrayBuffer = await file.arrayBuffer();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    // find "Fill this" sheet
    const fillSheet = workbook.worksheets.find(s =>
        s.name.toLowerCase().includes("fill this")
    );

    if (!fillSheet) throw new Error("Could not find 'Fill this' sheet");

    // find "Validation Sheet"
    const validationSheet = workbook.worksheets.find(s =>
        s.name.toLowerCase().includes("validation")
    );

    // extract headers from row 3
    const headerRow = fillSheet.getRow(3);
    const headers = [];

    headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const name = extractFieldName(cell.value);
        headers.push({ name, colNumber });
    });

    console.log(headers)

    // filter out empty and skipped fields
    const validHeaders = headers.filter(h =>
        h.name && !SKIP_FIELDS.some(skip =>
            h.name.toLowerCase().includes(skip.toLowerCase())
        )
    );

    console.log(validHeaders)

    // extract field type from row 2 (Compulsory vs Optional)
    const fieldTypeRow = fillSheet.getRow(2);
    const fieldTypes = {};
    validHeaders.forEach(({ name, colNumber }) => {
        const typeCell = fieldTypeRow.getCell(colNumber).value || "";

        // force importer fields to always be optional
        if (ALWAYS_OPTIONAL.includes(name)) {
            fieldTypes[name] = "optional";
            return;
        }

        fieldTypes[name] = typeCell.toString().toLowerCase().includes("compulsory")
            ? "compulsory"
            : "optional";
    });
    console.log(fieldTypes)

    // extract dropdowns from validation sheet
    const dropdowns = {};

    if (validationSheet) {
        // validation sheet headers are on row 1
        const valHeaderRow = validationSheet.getRow(1);

        valHeaderRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const headerName = extractFieldName(cell.value);
            if (!headerName) return;

            // check if this header exists in our valid headers
            const match = validHeaders.find(h => h.name === headerName);
            if (!match) return;

            // collect options from row 3 downwards
            const options = [];
            for (let row = 3; row <= validationSheet.rowCount; row++) {
                const val = validationSheet.getRow(row).getCell(colNumber).value;
                if (!val) break;

                const clean = typeof val === "object" && val?.richText
                    ? val.richText.map(r => r.text).join("").trim()
                    : String(val).trim();

                if (clean) options.push(clean);
            }

            if (options.length > 0) {
                dropdowns[headerName] = options;
            }
        });
    }

    console.log(dropdowns)

    return { validHeaders, fieldTypes, dropdowns, workbook, fillSheet };
}