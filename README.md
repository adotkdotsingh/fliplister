# Maggie Listing - Meesho Listing Builder

A modern, fast React web application for building and managing product listings for the Meesho e-commerce platform. Import Excel templates, auto-populate fields, manage multiple listings, and export completed listings—all in one place.

## ✨ Features

- **📊 Excel Template Import** - Parse Meesho Excel templates and auto-populate form fields
- **📑 Multi-Listing Support** - Create and manage multiple product listings with intuitive tabbed interface
- **💰 Smart Price Calculator** - Automatic cost aggregation (product, packing, ad, return, margin)
- **📋 Dynamic Form Generation** - Auto-generated forms based on template structure with compulsory/optional field separation
- **🎯 Quick-Fill Templates** - Pre-configured templates for popular categories (Cups, Mugs) and suppliers
- **✏️ Prompt Generator** - Generate product descriptions with AI assistance
- **🌙 Dark Mode** - Full dark theme support for comfortable viewing
- **📤 Excel Export** - Generate and download completed listings as Excel files

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd maggielister

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19.2 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4.2 |
| **UI Components** | shadcn/ui, @base-ui/react, HugeIcons |
| **Excel Processing** | ExcelJS 4.4 |
| **Linting** | ESLint |

## 📁 Project Structure

```
src/
├── App.jsx                  # Main application component
├── components/
│   ├── DynamicForm.jsx      # Adaptive form with field validation
│   ├── FileUpload.jsx       # Excel template upload handler
│   ├── ListingTabs.jsx      # Tab management for multiple listings
│   ├── PriceCalculator.jsx  # Cost calculation engine
│   ├── PromptGenerator.jsx  # Description generation
│   ├── TemplateSelector.jsx # Category & supplier pre-fill
│   └── ui/                  # Reusable UI components (button, card, etc.)
├── lib/
│   ├── excelParser.js       # Excel template parsing logic
│   └── excelWriter.js       # Multi-row Excel export
└── data/
    └── templates.js         # Pre-configured category & supplier templates
```

## 💡 Usage

### Basic Workflow

1. **Start** - Select a category and supplier from the template selector (or upload custom Excel)
2. **Fill** - Complete the auto-generated form with product details
3. **Calculate** - Use the price calculator to determine optimal pricing
4. **Multi-List** - Add more listings using the "+" tab button
5. **Export** - Download all listings as a formatted Excel file

### Key Features in Action

#### Adding Multiple Listings
- Click the **"+" button** on tabs to add a new listing
- Each listing inherits the selected category/supplier
- Delete listings with the **"× Delete"** button (when multiple exist)

#### Smart Pricing
- **MRP** auto-sets based on Meesho price threshold
- **Defective Returns** calculated as Meesho Price - 18
- All costs aggregate automatically

#### Template System
- **Categories**: Cups, Mugs (easily extensible)
- **Suppliers**: Mishika, Shivi, Jayas (with pricing data)
- Merge templates for quick form population

## 🎨 Form Fields

### Compulsory Fields
Fields marked as required must be completed before export.

### Auto-Optional Fields (System)
- Importer Name
- Importer Address
- Importer Pincode

### Skip Fields
System-only fields (ERROR STATUS, ERROR MESSAGE, etc.) are excluded from the form.

## 📊 Excel Integration

### Import
- Reads template structure from row 3 (headers)
- Field types from row 2
- Dropdown options from Validation sheet

### Export
- Generates properly formatted Meesho-compliant Excel files
- One row per listing when using multi-listing feature
- Maintains all validation rules and formatting

## 🔒 Data Handling

- All processing happens locally in your browser
- No data is sent to external servers
- Excel files are generated client-side and downloaded directly

## 🚀 Development

### Commands

```bash
npm run dev       # Start development server with HMR
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint checks
```

### Environment

- Node.js 18+
- Vite for instant module replacement
- ESLint for code quality

## 📝 Version History

- **v2.0** - Multi-listing and PDF review feature
- **v1.3.0** - Multi-listing support with tabbed interface
- **v1.2.1** - Improved category and requirement fields

## 📄 License

[Add your license information]

## 🤝 Support

For issues, feature requests, or questions, please open an issue in the repository.

---

**Made with ❤️ for Meesho sellers**
