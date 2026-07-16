import ExcelJS from "exceljs";

export async function generateExcel(workbook, fillSheet, headers, listings) {
    let targetRow = 5;

    // Write each listing as a separate row
    for (const formData of listings) {
        // find the next empty row starting from current targetRow
        while (fillSheet.getRow(targetRow).getCell(3).value) {
            targetRow++;
        }

        console.log("Writing to row:", targetRow);

        const row = fillSheet.getRow(targetRow);

        // write each field value into the correct column
        headers.forEach(({ name, colNumber }) => {
            if (!formData[name]) return;

            const cell = row.getCell(colNumber);
            cell.value = formData[name];
        });

        row.commit();
        targetRow++;
    }

    // write workbook to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // trigger download
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meesho-filled.xlsx";
    a.click();

    URL.revokeObjectURL(url);
}