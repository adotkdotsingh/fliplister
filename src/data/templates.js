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