export const sampleProducts = [
  {
    name: "LG InstaView Frost-Free Refrigerator 655L",
    brand: "LG",
    category: "Refrigerators",
    description:
      "A premium side-by-side refrigerator with InstaView glass panel, inverter compressor, multi-air flow cooling, and smart diagnostics for modern family kitchens.",
    shortDescription: "Luxury 655L smart refrigerator with InstaView glass panel.",
    price: 89990,
    discountPrice: 82990,
    warranty: "1 year comprehensive + 10 years compressor",
    stockQuantity: 8,
    isFeatured: true,
    popularityScore: 94,
    images: [
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1601599963565-b7f4d5c32b80?auto=format&fit=crop&w=1200&q=80"
    ],
    specifications: [
      { label: "Capacity", value: "655 Litres" },
      { label: "Cooling", value: "DoorCooling+ and Multi Air Flow" },
      { label: "Compressor", value: "Smart Inverter Compressor" },
      { label: "Energy Rating", value: "3 Star" }
    ],
    tags: ["family", "smart cooling", "premium"]
  },
  {
    name: "Samsung AI Ecobubble Front Load Washing Machine 9kg",
    brand: "Samsung",
    category: "Washing Machines",
    description:
      "Fully automatic front-load washing machine with AI Ecobubble wash intelligence, hygiene steam, digital inverter motor, and fabric care for large households.",
    shortDescription: "9kg AI front-load washer with hygiene steam and inverter motor.",
    price: 43990,
    discountPrice: 38990,
    warranty: "2 years comprehensive + 20 years motor",
    stockQuantity: 11,
    isFeatured: true,
    popularityScore: 91,
    images: [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&w=1200&q=80"
    ],
    specifications: [
      { label: "Capacity", value: "9 Kilograms" },
      { label: "Wash Programs", value: "14" },
      { label: "Special Feature", value: "AI Ecobubble with Hygiene Steam" },
      { label: "Motor", value: "Digital Inverter" }
    ],
    tags: ["front load", "steam wash", "family"]
  },
  {
    name: "Sony Bravia 55-inch 4K Google TV",
    brand: "Sony",
    category: "Televisions",
    description:
      "Immersive 4K UHD television with Google TV, Dolby Vision, XR picture processing, and cinematic audio tuned for living room entertainment.",
    shortDescription: "55-inch 4K Google TV with Dolby Vision and XR processing.",
    price: 67990,
    discountPrice: 62990,
    warranty: "2 years manufacturer warranty",
    stockQuantity: 5,
    isFeatured: true,
    popularityScore: 88,
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=1200&q=80"
    ],
    specifications: [
      { label: "Display", value: "55-inch 4K UHD LED" },
      { label: "OS", value: "Google TV" },
      { label: "Audio", value: "Dolby Atmos" },
      { label: "Ports", value: "3 HDMI, 2 USB" }
    ],
    tags: ["smart tv", "4k", "entertainment"]
  },
  {
    name: "Daikin 1.5 Ton 5 Star Inverter Split AC",
    brand: "Daikin",
    category: "Air Conditioners",
    description:
      "High-efficiency split air conditioner with PM2.5 filtration, stabilizer-free operation, Coanda airflow, and quick chill performance for Indian summers.",
    shortDescription: "1.5 ton inverter AC with PM2.5 filter and fast cooling.",
    price: 52990,
    discountPrice: 47990,
    warranty: "1 year product + 10 years compressor",
    stockQuantity: 7,
    isFeatured: false,
    popularityScore: 86,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80"
    ],
    specifications: [
      { label: "Capacity", value: "1.5 Ton" },
      { label: "Energy Rating", value: "5 Star" },
      { label: "Cooling", value: "Coanda Airflow" },
      { label: "Filter", value: "PM2.5 Air Purification" }
    ],
    tags: ["summer", "energy saver", "air purification"]
  },
  {
    name: "IFB 30L Convection Microwave Oven",
    brand: "IFB",
    category: "Kitchen Appliances",
    description:
      "Convection microwave oven ideal for baking, grilling, reheating, and auto-cook Indian recipes with multi-stage cooking support.",
    shortDescription: "30L convection microwave with grill and baking presets.",
    price: 18990,
    discountPrice: 15990,
    warranty: "1 year comprehensive + 3 years magnetron",
    stockQuantity: 19,
    isFeatured: true,
    popularityScore: 79,
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80"
    ],
    specifications: [
      { label: "Capacity", value: "30 Litres" },
      { label: "Cooking Modes", value: "Convection, Grill, Microwave" },
      { label: "Auto Menus", value: "101 Standard Menus" },
      { label: "Child Lock", value: "Yes" }
    ],
    tags: ["baking", "grill", "microwave"]
  },
  {
    name: "Kent Supreme Alkaline RO Water Purifier",
    brand: "Kent",
    category: "Water Purifiers",
    description:
      "RO+UV+UF water purifier with in-tank UV disinfection and alkaline purification designed for homes seeking pure drinking water with mineral retention.",
    shortDescription: "RO+UV+UF water purifier with alkaline enhancement.",
    price: 22990,
    discountPrice: 19990,
    warranty: "1 year warranty",
    stockQuantity: 4,
    isFeatured: false,
    popularityScore: 72,
    images: [
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80"
    ],
    specifications: [
      { label: "Purification", value: "RO + UV + UF + TDS Control" },
      { label: "Tank Capacity", value: "8 Litres" },
      { label: "Feature", value: "Mineral RO Technology" },
      { label: "Mount", value: "Wall Mount" }
    ],
    tags: ["water", "health", "alkaline"]
  },
  {
    name: "Philips 5.6L Air Fryer with Rapid Air Technology",
    brand: "Philips",
    category: "Kitchen Appliances",
    description:
      "Large-capacity digital air fryer with fat removal technology, preset menus, and rapid air circulation for healthier home cooking.",
    shortDescription: "5.6L digital air fryer with healthy cooking presets.",
    price: 14990,
    discountPrice: 12990,
    warranty: "2 years warranty",
    stockQuantity: 16,
    isFeatured: true,
    popularityScore: 84,
    images: [
      "https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?auto=format&fit=crop&w=1200&q=80"
    ],
    specifications: [
      { label: "Capacity", value: "5.6 Litres" },
      { label: "Controls", value: "Digital Touch Panel" },
      { label: "Preset Programs", value: "7" },
      { label: "Technology", value: "Rapid Air with Fat Removal" }
    ],
    tags: ["healthy cooking", "air fryer", "quick meals"]
  },
  {
    name: "Whirlpool 235L Frost Free Double Door Refrigerator",
    brand: "Whirlpool",
    category: "Refrigerators",
    description:
      "Family-friendly double door fridge with IntelliSense inverter, adaptive cooling, fresh flow air tower, and stabilizer-free performance.",
    shortDescription: "235L double door refrigerator with adaptive cooling.",
    price: 32990,
    discountPrice: 28990,
    warranty: "1 year comprehensive + 10 years compressor",
    stockQuantity: 13,
    isFeatured: false,
    popularityScore: 76,
    images: [
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1200&q=80"
    ],
    specifications: [
      { label: "Capacity", value: "235 Litres" },
      { label: "Cooling", value: "Adaptive Intelligence" },
      { label: "Compressor", value: "IntelliSense Inverter" },
      { label: "Energy Rating", value: "2 Star" }
    ],
    tags: ["family", "double door", "adaptive cooling"]
  }
];
