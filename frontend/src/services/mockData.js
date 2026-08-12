// Mock product catalog data - mirrors ml/products_catalog.csv
// This will be replaced by real API calls once the backend is built

const products = [
  { id: 'P0001', name: 'HydraGlow Facial Cleanser', brand: 'AuraSkin', category: 'Skincare', barcode: '890100000007', description: 'Gentle daily cleanser for normal and dry skin', ingredients: 'Aloe Vera; Glycerin; Green Tea Extract; Panthenol', materials: 'PET Bottle', price: 12.99, rating: 4.5 },
  { id: 'P0002', name: 'Vitamin C Brightening Serum', brand: 'GlowLab', category: 'Skincare', barcode: '890100000014', description: 'Lightweight serum designed to improve skin brightness', ingredients: 'Vitamin C; Hyaluronic Acid; Vitamin E; Ferulic Acid', materials: 'Glass Bottle', price: 24.99, rating: 4.7 },
  { id: 'P0003', name: 'Daily Moisture Cream', brand: 'DermaPure', category: 'Skincare', barcode: '890100000021', description: 'Hydrating face cream for everyday use', ingredients: 'Shea Butter; Glycerin; Ceramides; Squalane', materials: 'PP Jar', price: 18.50, rating: 4.4 },
  { id: 'P0004', name: 'Ultra Repair Lotion', brand: 'SkinNature', category: 'Body Care', barcode: '890100000038', description: 'Fast-absorbing body lotion for dry skin', ingredients: 'Aloe Vera; Shea Butter; Coconut Oil; Vitamin E', materials: 'HDPE Bottle', price: 15.75, rating: 4.3 },
  { id: 'P0005', name: 'Refreshing Face Mist', brand: 'BloomCare', category: 'Skincare', barcode: '890100000045', description: 'Refreshing facial mist suitable for use throughout the day', ingredients: 'Rose Water; Aloe Vera; Glycerin; Chamomile Extract', materials: 'PET Spray Bottle', price: 9.99, rating: 4.2 },
  { id: 'P0006', name: 'Matte Finish Foundation', brand: 'ColorMuse', category: 'Makeup', barcode: '890100000052', description: 'Buildable foundation providing a natural matte finish', ingredients: 'Titanium Dioxide; Dimethicone; Glycerin; Iron Oxides', materials: 'Glass Bottle', price: 21.99, rating: 4.6 },
  { id: 'P0007', name: 'Hydrating Lip Balm', brand: 'BeautyNest', category: 'Lip Care', barcode: '890100000069', description: 'Moisturizing lip balm with a smooth non-sticky finish', ingredients: 'Beeswax; Shea Butter; Coconut Oil; Vitamin E', materials: 'Paper Tube; Beeswax', price: 6.49, rating: 4.5 },
  { id: 'P0008', name: 'Herbal Shampoo', brand: 'GreenRoots', category: 'Hair Care', barcode: '890100000076', description: 'Mild shampoo formulated for regular hair washing', ingredients: 'Aloe Vera; Rosemary Extract; Coconut Oil; Glycerin', materials: 'HDPE Bottle', price: 11.99, rating: 4.1 },
  { id: 'P0009', name: 'Repair Conditioner', brand: 'HairBloom', category: 'Hair Care', barcode: '890100000083', description: 'Conditioner designed to soften and detangle damaged hair', ingredients: 'Argan Oil; Shea Butter; Keratin; Aloe Vera', materials: 'HDPE Bottle', price: 13.49, rating: 4.4 },
  { id: 'P0010', name: 'SPF 50 Sunscreen', brand: 'SunGuard', category: 'Sun Care', barcode: '890100000090', description: 'Broad-spectrum sunscreen with lightweight skin feel', ingredients: 'Zinc Oxide; Vitamin E; Aloe Vera; Glycerin', materials: 'HDPE Tube', price: 17.99, rating: 4.6 },
  { id: 'P0011', name: 'Overnight Renewal Serum', brand: 'LumiCare', category: 'Skincare', barcode: '890100000106', description: 'Night serum formulated to support smoother-looking skin', ingredients: 'Retinol; Hyaluronic Acid; Peptides; Squalane', materials: 'Amber Glass Bottle', price: 29.99, rating: 4.7 },
  { id: 'P0012', name: 'Charcoal Detox Mask', brand: 'PureEarth', category: 'Skincare', barcode: '890100000113', description: 'Wash-off clay mask for a refreshed complexion', ingredients: 'Activated Charcoal; Kaolin Clay; Aloe Vera; Tea Tree Oil', materials: 'PP Jar', price: 14.25, rating: 4.3 },
  { id: 'P0013', name: 'Soft Touch Hand Cream', brand: 'VelvetSkin', category: 'Hand Care', barcode: '890100000120', description: 'Rich hand cream for dry and rough hands', ingredients: 'Shea Butter; Glycerin; Jojoba Oil; Vitamin E', materials: 'Aluminum Tube', price: 7.99, rating: 4.2 },
  { id: 'P0014', name: 'Daily Face Wash', brand: 'FreshDerm', category: 'Skincare', barcode: '890100000137', description: 'Foaming facial wash for normal and combination skin', ingredients: 'Glycerin; Green Tea; Chamomile; Panthenol', materials: 'PET Bottle', price: 10.49, rating: 4.3 },
  { id: 'P0015', name: 'Hydrating Eye Gel', brand: 'EyeGlow', category: 'Eye Care', barcode: '890100000144', description: 'Cooling eye gel for a refreshed appearance', ingredients: 'Caffeine; Hyaluronic Acid; Aloe Vera; Peptides', materials: 'Glass Jar', price: 19.99, rating: 4.5 },
  { id: 'P0016', name: 'Silky Body Butter', brand: 'NatureGlow', category: 'Body Care', barcode: '890100000151', description: 'Rich body butter for intensive skin moisturization', ingredients: 'Cocoa Butter; Shea Butter; Coconut Oil; Vitamin E', materials: 'PP Jar', price: 16.99, rating: 4.6 },
  { id: 'P0017', name: 'Volumizing Hair Mask', brand: 'SilkHair', category: 'Hair Care', barcode: '890100000168', description: 'Deep-conditioning mask for dry and flat hair', ingredients: 'Keratin; Argan Oil; Shea Butter; Panthenol', materials: 'PP Jar', price: 18.99, rating: 4.4 },
  { id: 'P0018', name: 'Nourishing Hair Oil', brand: 'HerbalEssence', category: 'Hair Care', barcode: '890100000175', description: 'Lightweight botanical oil for hair nourishment', ingredients: 'Argan Oil; Jojoba Oil; Coconut Oil; Rosemary Oil', materials: 'Glass Dropper Bottle', price: 14.99, rating: 4.5 },
  { id: 'P0019', name: 'Liquid Eyeliner', brand: 'MakeupPro', category: 'Makeup', barcode: '890100000182', description: 'Long-lasting liquid eyeliner with precision applicator', ingredients: 'Water; Carbon Black; Acrylates Copolymer; Glycerin', materials: 'Plastic Pen', price: 10.99, rating: 4.1 },
  { id: 'P0020', name: 'Velvet Matte Lipstick', brand: 'LipLuxe', category: 'Makeup', barcode: '890100000199', description: 'Highly pigmented lipstick with a soft matte finish', ingredients: 'Castor Oil; Beeswax; Vitamin E; Iron Oxides', materials: 'Aluminum; Plastic', price: 12.99, rating: 4.6 },
  { id: 'P0021', name: 'Hydrating Primer', brand: 'FacePerfect', category: 'Makeup', barcode: '890100000205', description: 'Smooth makeup primer that helps create an even base', ingredients: 'Dimethicone; Glycerin; Niacinamide; Hyaluronic Acid', materials: 'Plastic Tube', price: 16.99, rating: 4.4 },
  { id: 'P0022', name: 'Lengthening Mascara', brand: 'LashBloom', category: 'Makeup', barcode: '890100000212', description: 'Buildable mascara for longer and fuller-looking lashes', ingredients: 'Beeswax; Carnauba Wax; Iron Oxides; Panthenol', materials: 'Plastic Tube', price: 13.99, rating: 4.3 },
  { id: 'P0023', name: 'Pressed Powder', brand: 'BeautyCraft', category: 'Makeup', barcode: '890100000229', description: 'Lightweight pressed powder for controlling facial shine', ingredients: 'Talc; Mica; Zinc Oxide; Iron Oxides', materials: 'Plastic Compact', price: 11.49, rating: 4.2 },
  { id: 'P0024', name: 'Peptide Firming Cream', brand: 'AgeDefy', category: 'Skincare', barcode: '890100000236', description: 'Firming moisturizer with a blend of peptides', ingredients: 'Peptides; Ceramides; Shea Butter; Hyaluronic Acid', materials: 'Glass Jar', price: 32.99, rating: 4.8 },
  { id: 'P0025', name: 'Niacinamide Serum', brand: 'SkinScience', category: 'Skincare', barcode: '890100000243', description: 'Daily serum formulated for balanced and smoother-looking skin', ingredients: 'Niacinamide; Zinc PCA; Glycerin; Hyaluronic Acid', materials: 'Glass Dropper Bottle', price: 20.99, rating: 4.7 },
  { id: 'P0026', name: 'Soothing Aloe Gel', brand: 'CalmSkin', category: 'Skincare', barcode: '890100000250', description: 'Cooling aloe gel for face and body', ingredients: 'Aloe Vera; Glycerin; Panthenol; Allantoin', materials: 'PET Tube', price: 8.99, rating: 4.4 },
  { id: 'P0027', name: 'Exfoliating Body Scrub', brand: 'SpaNature', category: 'Body Care', barcode: '890100000267', description: 'Gentle body scrub that removes surface impurities', ingredients: 'Sugar; Coconut Oil; Shea Butter; Vitamin E', materials: 'Glass Jar', price: 13.99, rating: 4.3 },
  { id: 'P0028', name: 'Tea Tree Spot Gel', brand: 'ClearSkin', category: 'Skincare', barcode: '890100000274', description: 'Targeted gel for blemish-prone skin', ingredients: 'Tea Tree Oil; Salicylic Acid; Aloe Vera; Niacinamide', materials: 'Plastic Tube', price: 9.49, rating: 4.2 },
  { id: 'P0029', name: 'Micellar Cleansing Water', brand: 'CleanBeauty', category: 'Skincare', barcode: '890100000281', description: 'Gentle micellar water for removing makeup and impurities', ingredients: 'Micellar Water; Glycerin; Aloe Vera; Panthenol', materials: 'PET Bottle', price: 12.49, rating: 4.5 },
  { id: 'P0030', name: 'Hydrating Sheet Mask', brand: 'KBeautyCo', category: 'Skincare', barcode: '890100000298', description: 'Single-use sheet mask for an instant hydration boost', ingredients: 'Hyaluronic Acid; Aloe Vera; Glycerin; Green Tea', materials: 'Cotton Sheet; Plastic Pouch', price: 4.99, rating: 4.4 },
  { id: 'P0031', name: 'Anti-Frizz Hair Serum', brand: 'HairScience', category: 'Hair Care', barcode: '890100000304', description: 'Lightweight serum that helps smooth frizzy hair', ingredients: 'Argan Oil; Silicone; Vitamin E; Jojoba Oil', materials: 'Glass Bottle', price: 15.49, rating: 4.3 },
  { id: 'P0032', name: 'Color Protect Shampoo', brand: 'ColorCare', category: 'Hair Care', barcode: '890100000311', description: 'Shampoo formulated for color-treated hair', ingredients: 'Keratin; Argan Oil; Aloe Vera; Panthenol', materials: 'HDPE Bottle', price: 12.99, rating: 4.2 },
  { id: 'P0033', name: 'Deep Moisture Conditioner', brand: 'SoftLocks', category: 'Hair Care', barcode: '890100000328', description: 'Rich conditioner for dry and brittle hair', ingredients: 'Shea Butter; Coconut Oil; Keratin; Glycerin', materials: 'HDPE Bottle', price: 13.99, rating: 4.4 },
  { id: 'P0034', name: 'Scalp Refresh Tonic', brand: 'RootCare', category: 'Hair Care', barcode: '890100000335', description: 'Refreshing scalp tonic for daily hair-care routines', ingredients: 'Peppermint Oil; Rosemary Extract; Niacinamide; Glycerin', materials: 'Glass Spray Bottle', price: 17.49, rating: 4.1 },
  { id: 'P0035', name: 'Hydrating Foundation', brand: 'TrueTone', category: 'Makeup', barcode: '890100000342', description: 'Medium-coverage foundation with a dewy finish', ingredients: 'Glycerin; Hyaluronic Acid; Titanium Dioxide; Iron Oxides', materials: 'Glass Bottle', price: 22.49, rating: 4.5 },
  { id: 'P0036', name: 'Soft Blush Powder', brand: 'CheekGlow', category: 'Makeup', barcode: '890100000359', description: 'Blendable powder blush for a natural-looking flush', ingredients: 'Mica; Talc; Iron Oxides; Dimethicone', materials: 'Plastic Compact', price: 10.99, rating: 4.3 },
  { id: 'P0037', name: 'Glow Highlighter', brand: 'ShineStudio', category: 'Makeup', barcode: '890100000366', description: 'Fine-milled highlighter for a luminous finish', ingredients: 'Mica; Titanium Dioxide; Jojoba Oil; Dimethicone', materials: 'Plastic Compact', price: 14.49, rating: 4.6 },
  { id: 'P0038', name: 'Waterproof Kajal', brand: 'EyesFirst', category: 'Makeup', barcode: '890100000373', description: 'Smooth waterproof eye pencil for long-lasting definition', ingredients: 'Carbon Black; Wax; Vitamin E; Mineral Oil', materials: 'Wood Pencil; Plastic Cap', price: 8.99, rating: 4.2 },
  { id: 'P0039', name: 'Cooling Foot Cream', brand: 'FootCarePlus', category: 'Foot Care', barcode: '890100000380', description: 'Cooling moisturizer for tired and dry feet', ingredients: 'Menthol; Shea Butter; Glycerin; Peppermint Oil', materials: 'Plastic Tube', price: 9.99, rating: 4.1 },
  { id: 'P0040', name: 'Intensive Heel Balm', brand: 'SoftStep', category: 'Foot Care', barcode: '890100000397', description: 'Rich balm for dry and rough heels', ingredients: 'Urea; Shea Butter; Beeswax; Coconut Oil', materials: 'Plastic Tube', price: 11.99, rating: 4.4 },
  { id: 'P0041', name: 'Hand Sanitizing Gel', brand: 'CleanHands', category: 'Personal Care', barcode: '890100000403', description: 'Quick-drying hand cleansing gel', ingredients: 'Ethyl Alcohol; Glycerin; Aloe Vera; Carbomer', materials: 'PET Bottle', price: 5.99, rating: 4.0 },
  { id: 'P0042', name: 'Moisturizing Body Wash', brand: 'FreshBody', category: 'Body Care', barcode: '890100000410', description: 'Gentle body wash with a creamy moisturizing formula', ingredients: 'Glycerin; Aloe Vera; Coconut Oil; Vitamin E', materials: 'HDPE Bottle', price: 9.49, rating: 4.3 },
  { id: 'P0043', name: 'Beard Oil', brand: 'ManCave', category: "Men's Grooming", barcode: '890100000427', description: 'Premium high-quality beard oil formulated for daily use.', ingredients: 'Jojoba Oil; Argan Oil', materials: 'Glass Bottle', price: 14.99, rating: 4.5 },
  { id: 'P0044', name: 'Exfoliating Face Scrub', brand: 'GlowLab', category: 'Skincare', barcode: '890100000434', description: 'Premium high-quality exfoliating face scrub formulated for daily use.', ingredients: 'Apricot Kernel; Aloe Vera', materials: 'Tube', price: 11.25, rating: 4.3 },
  { id: 'P0045', name: 'Setting Spray', brand: 'ColorMuse', category: 'Makeup', barcode: '890100000441', description: 'Premium high-quality setting spray formulated for daily use.', ingredients: 'Water; Polymer; Niacinamide', materials: 'Spray Bottle', price: 15.99, rating: 4.6 },
  { id: 'P0046', name: 'Clarifying Toner', brand: 'DermaPure', category: 'Skincare', barcode: '890100000458', description: 'Premium high-quality clarifying toner formulated for daily use.', ingredients: 'Salicylic Acid; Witch Hazel', materials: 'PET Bottle', price: 13.50, rating: 4.4 },
  { id: 'P0047', name: 'Vitamin E Body Oil', brand: 'SkinNature', category: 'Body Care', barcode: '890100000465', description: 'Premium high-quality vitamin e body oil formulated for daily use.', ingredients: 'Vitamin E; Almond Oil', materials: 'Glass Bottle', price: 18.00, rating: 4.5 },
  { id: 'P0048', name: 'Curl Defining Cream', brand: 'HairBloom', category: 'Hair Care', barcode: '890100000472', description: 'Premium high-quality curl defining cream formulated for daily use.', ingredients: 'Shea Butter; Coconut Oil', materials: 'PP Jar', price: 16.49, rating: 4.2 },
  { id: 'P0049', name: 'Brightening Eye Cream', brand: 'LumiCare', category: 'Eye Care', barcode: '890100000489', description: 'Premium high-quality brightening eye cream formulated for daily use.', ingredients: 'Vitamin C; Caffeine', materials: 'Small Tube', price: 22.00, rating: 4.7 },
  { id: 'P0050', name: 'Tinted Lip Oil', brand: 'LipLuxe', category: 'Lip Care', barcode: '890100000496', description: 'Premium high-quality tinted lip oil formulated for daily use.', ingredients: 'Jojoba Oil; Vitamin E', materials: 'Vial', price: 11.99, rating: 4.5 },
];

// Generate product image placeholder colors based on category
const categoryColors = {
  'Skincare': { bg: '#1a1040', accent: '#7c3aed' },
  'Body Care': { bg: '#0a2540', accent: '#06b6d4' },
  'Hair Care': { bg: '#1a2e1a', accent: '#10b981' },
  'Makeup': { bg: '#2e1a2e', accent: '#ec4899' },
  'Sun Care': { bg: '#2e2a0a', accent: '#f59e0b' },
  'Lip Care': { bg: '#2e1a1a', accent: '#f43f5e' },
  'Eye Care': { bg: '#1a2040', accent: '#3b82f6' },
  'Hand Care': { bg: '#201a2e', accent: '#8b5cf6' },
  'Foot Care': { bg: '#1a2e2e', accent: '#14b8a6' },
  'Personal Care': { bg: '#2e2e1a', accent: '#eab308' },
  "Men's Grooming": { bg: '#1a1a2e', accent: '#6366f1' },
};

// Helper functions
export function getAllProducts() {
  return [...products];
}

export function getProductById(id) {
  return products.find(p => p.id === id) || null;
}

export function getProductByBarcode(barcode) {
  return products.find(p => p.barcode === barcode) || null;
}

export function searchProducts(query, filters = {}) {
  let results = [...products];

  // Text search
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.ingredients.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    results = results.filter(p => filters.categories.includes(p.category));
  }

  // Brand filter
  if (filters.brands && filters.brands.length > 0) {
    results = results.filter(p => filters.brands.includes(p.brand));
  }

  // Price range filter
  if (filters.minPrice !== undefined) {
    results = results.filter(p => p.price >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    results = results.filter(p => p.price <= filters.maxPrice);
  }

  // Rating filter
  if (filters.minRating !== undefined) {
    results = results.filter(p => p.rating >= filters.minRating);
  }

  // Sort
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
  }

  return results;
}

export function getCategories() {
  return [...new Set(products.map(p => p.category))].sort();
}

export function getBrands() {
  return [...new Set(products.map(p => p.brand))].sort();
}

export function getProductsByCategory(category) {
  return products.filter(p => p.category === category);
}

export function getProductsByBrand(brand) {
  return products.filter(p => p.brand === brand);
}

export function getFeaturedProducts() {
  return products.filter(p => p.rating >= 4.5).slice(0, 8);
}

export function getTrendingProducts() {
  // Simulate trending by picking a diverse set
  const trending = [];
  const seen = new Set();
  for (const p of products) {
    if (!seen.has(p.category) && trending.length < 6) {
      trending.push(p);
      seen.add(p.category);
    }
  }
  return trending;
}

export function getSimilarProducts(productId, limit = 4) {
  const product = getProductById(productId);
  if (!product) return [];
  return products
    .filter(p => p.id !== productId && p.category === product.category)
    .slice(0, limit);
}

export function getCategoryColors(category) {
  return categoryColors[category] || { bg: '#1a1a2e', accent: '#7c3aed' };
}

export function getPriceRange() {
  const prices = products.map(p => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function getBrandStats(brand) {
  const brandProducts = getProductsByBrand(brand);
  if (brandProducts.length === 0) return null;
  const avgRating = brandProducts.reduce((sum, p) => sum + p.rating, 0) / brandProducts.length;
  const prices = brandProducts.map(p => p.price);
  return {
    name: brand,
    productCount: brandProducts.length,
    avgRating: Math.round(avgRating * 10) / 10,
    priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
    categories: [...new Set(brandProducts.map(p => p.category))],
  };
}

export default products;
