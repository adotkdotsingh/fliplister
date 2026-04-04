export const commonDefaults = {
    "Variation": "Free Size",
    "GST %": "5",
    "HSN ID": "691200",
    "Inventory": "5",
    "Country of Origin": "India",
    "Material": "Ceramic",
    "Net Quantity (N)": "1",
    "Packaging Unit": "Cm",
    "Packaging Weight Unit": "G",
    "Product Unit": "Cm",
    "Product Weight Unit": "G",
};

export const categoryTemplates = {
    Cups: {
        "Generic Name": "Cups, Mugs & Saucers",
        "Type": "Tea Cup",
        "Capacity": "150",
        "Volume Unit": "ml",
        "Net Weight (gms)": "750",
        "Net Quantity (N)": "Pack Of 6",
        "Packaging Breadth": "20",
        "Packaging Height": "12",
        "Packaging Length": "24",
        "Packaging Unit": "Cm",
        "Packaging Weight": "0.9",
        "Packaging Weight Unit": "Kg",
        "Product Breadth": "8",
        "Product Height": "7",
        "Product Length": "8",
        "Product Unit": "Cm",
        "Product Weight": "0.1",
        "Product Weight Unit": "Kg",
        "Material": "Ceramic",
        // ✅ ADD THIS
        pricing: {
            productCost: 0,
            packingCost: 10,
            adCost: 15,
            returnCost: 5,
            marginCost: 20,
        },
    },
    Mugs: {
        "Generic Name": "Mug",
        "Type": "Beer Mug",
        "Capacity": "500ml",
        "Material": "Ceramic",
    },
    Bowls: {
        "Generic Name": "Bowls",
        "Microwave Safe": "Yes",
        "Type": "Reusable",
        "Net Weight (gms)": "800",
        "Add Ons": "No Add ons",
        "Net Quantity (N)": "Pack Of 4",
        "Packaging Breadth": "15",
        "Packaging Height": "12",
        "Packaging Length": "26",
        "Packaging Unit": "Cm",
        "Packaging Weight": "0.9",
        "Packaging Weight Unit": "Kg",
        "Product Breadth": "10",
        "Product Height": "4",
        "Product Length": "10",
        "Product Unit": "Cm",
        "Product Diameter": "10",
        "Product Weight": "0.2",
        "Product Weight Unit": "Kg",
        "Material": "Ceramic",
        // ✅ ADD THIS
        pricing: {
            productCost: 0,
            packingCost: 30,
            adCost: 15,
            returnCost: 15,
            marginCost: 100,
        },
    },
};

export const supplierTemplates = {
    Mishika: {
        "Manufacturer Name": "M/S Mishika Enterprises",
        "Manufacturer Address": "G.T Road Khurja",
        "Manufacturer Pincode": "203131",
        "Packer Name": "M/S Mishika Enterprises",
        "Packer Address": "G.T Road Khurja",
        "Packer Pincode": "203131",
    },
    Shivi: {
        "Manufacturer Name": "M/S Shivi Ceramics",
        "Manufacturer Address": "G.T Road Khurja",
        "Manufacturer Pincode": "203131",
        "Packer Name": "M/S Shivi Ceramics",
        "Packer Address": "G.T Road Khurja",
        "Packer Pincode": "203131",

    },
    Jayas: {
        "Manufacturer Name": "M/S Jayas Traders",
        "Manufacturer Address": "G.T Road Khurja",
        "Manufacturer Pincode": "203131",
        "Packer Name": "M/S Jayas Traders",
        "Packer Address": "G.T Road Khurja",
        "Packer Pincode": "203131",
    },
    "Khurja Crockery Store": {
        "Manufacturer Name": "Khurja Crockery Store",
        "Manufacturer Address": "Quarter no. 5, Chauhan Pottery, Pottery Center Area, G.T Road Khurja",
        "Manufacturer Pincode": "203131",
        "Packer Name": "Quarter no. 5, Chauhan Pottery, Pottery Center Area, G.T Road Khurja",
        "Packer Address": "G.T Road Khurja",
        "Packer Pincode": "203131",
    },
};

export function getAutoFillData(category, supplier) {
    return {
        ...commonDefaults,
        ...(categoryTemplates[category] || {}),
        ...(supplierTemplates[supplier] || {}),
    };
}

export function getCategoryPricing(category) {
    return categoryTemplates[category]?.pricing || {
        productCost: 0,
        packingCost: 0,
        adCost: 0,
        returnCost: 0,
        marginCost: 0,
    }
}