/**
 * Provisions catalog — extracted from "Ro/Ro Lyktos · Monthly Provisions Request".
 * Source: only product names. Prices, quantities and supplier metadata intentionally omitted.
 *
 * `unit` is left blank for now — fill in (Kgs / Pcs / Btls / Pkts / Tins / Ltrs / Galons / Pack / Jars).
 */

export type ProvisionProduct = {
  /** Stable identifier — used as cart key. Format: `<category-key>:<slug>`. */
  id: string;
  /** Display name (English, as customers expect). */
  name: string;
  /** Unit of measure. Empty string = pending. */
  unit: string;
  /**
   * Path to product image relative to /public. Optional.
   * Convention: `/products/<category-key>/<slug>.webp` (e.g. `/products/fresh-fruits/banana.webp`).
   * If absent, the UI renders a fallback (category initial avatar).
   */
  image?: string;
};

export type ProvisionCategory = {
  key: string;
  name: { es: string; en: string };
  products: ProvisionProduct[];
};

/**
 * Build a product. The image path is derived from the id by convention:
 *   id "fresh-fruits:banana" → image "/products/fresh-fruits/banana.webp"
 * If the file does not exist at runtime, ProductCard falls back to an avatar.
 */
const p = (id: string, name: string, unit = ""): ProvisionProduct => {
  const sep = id.indexOf(":");
  const category = sep > 0 ? id.slice(0, sep) : "misc";
  const slug = sep > 0 ? id.slice(sep + 1) : id;
  return {
    id,
    name,
    unit,
    image: `/products/${category}/${slug}.webp`,
  };
};

export const PROVISION_CATALOG: ProvisionCategory[] = [
  {
    key: "fresh-vegetables",
    name: { es: "Frescos · Vegetales", en: "Fresh · Vegetables" },
    products: [
      p("fresh-vegetables:beetroot", "Beetroot"),
      p("fresh-vegetables:broccoli", "Broccoli"),
      p("fresh-vegetables:cabbage-white", "Cabbage (white)"),
      p("fresh-vegetables:carrots", "Carrots"),
      p("fresh-vegetables:celery", "Celery"),
      p("fresh-vegetables:chayote", "Chayote"),
      p("fresh-vegetables:chickpeas-dry", "Chickpeas (dry)"),
      p("fresh-vegetables:chili-pepper-hot", "Chili pepper (hot)"),
      p("fresh-vegetables:cauliflower", "Cauliflower"),
      p("fresh-vegetables:corn-young", "Corn (young)"),
      p("fresh-vegetables:cucumbers", "Cucumbers"),
      p("fresh-vegetables:dill-fresh", "Dill (fresh)"),
      p("fresh-vegetables:eggplants", "Eggplants"),
      p("fresh-vegetables:garlic-dry", "Garlic (dry)"),
      p("fresh-vegetables:ginger-fresh", "Ginger (fresh)"),
      p("fresh-vegetables:lemon-grass", "Lemon grass"),
      p("fresh-vegetables:lemons-yellow", "Lemons (yellow)"),
      p("fresh-vegetables:lettuce", "Lettuce"),
      p("fresh-vegetables:okra-fresh", "Okra (fresh, small)"),
      p("fresh-vegetables:onions-dry", "Onions (dry)"),
      p("fresh-vegetables:parsley-fresh", "Parsley (fresh)"),
      p("fresh-vegetables:peppers-green-red", "Peppers (green & red)"),
      p("fresh-vegetables:pak-choi", "Pak choi"),
      p("fresh-vegetables:potatoes-fresh", "Potatoes (fresh)"),
      p("fresh-vegetables:pumpkins", "Pumpkins"),
      p("fresh-vegetables:spinach", "Spinach"),
      p("fresh-vegetables:string-beans", "String beans"),
      p("fresh-vegetables:spring-onions", "Spring onions"),
      p("fresh-vegetables:tomatoes-cherry", "Tomatoes (cherry)"),
      p("fresh-vegetables:tomatoes-half-ripe", "Tomatoes (half ripe, large)"),
      p("fresh-vegetables:tomatoes-red", "Tomatoes (red)"),
      p("fresh-vegetables:zucchini", "Zucchini"),
      p("fresh-vegetables:white-radish-long", "White radish (long)"),
      p("fresh-vegetables:green-chili-long", "Green chili (long)"),
      p("fresh-vegetables:leeks", "Leeks"),
    ],
  },
  {
    key: "frozen-vegetables",
    name: { es: "Vegetales · Congelados", en: "Frozen · Vegetables" },
    products: [
      p("frozen-vegetables:broccoli", "Frozen broccoli"),
      p("frozen-vegetables:cauliflower", "Frozen cauliflower"),
      p("frozen-vegetables:corn-on-cob", "Frozen corn on the cob"),
      p("frozen-vegetables:green-beans", "Frozen green beans"),
      p("frozen-vegetables:green-peas", "Frozen green peas"),
      p("frozen-vegetables:carrots", "Frozen carrots"),
      p("frozen-vegetables:mixed", "Frozen mixed vegetables"),
      p("frozen-vegetables:okra", "Frozen okra"),
      p("frozen-vegetables:potatoes", "Frozen potatoes"),
      p("frozen-vegetables:spinach", "Frozen spinach"),
      p("frozen-vegetables:corn-kernels", "Frozen corn kernels"),
    ],
  },
  {
    key: "fresh-fruits",
    name: { es: "Frescos · Frutas", en: "Fresh · Fruits" },
    products: [
      p("fresh-fruits:apple-red", "Apple (red)"),
      p("fresh-fruits:avocado", "Avocado"),
      p("fresh-fruits:bananas", "Bananas"),
      p("fresh-fruits:mandarin", "Mandarin"),
      p("fresh-fruits:mango", "Mango"),
      p("fresh-fruits:orange", "Orange"),
      p("fresh-fruits:papaya-yellow", "Papaya (yellow)"),
      p("fresh-fruits:pears", "Pears"),
      p("fresh-fruits:pineapple", "Pineapple"),
      p("fresh-fruits:sweet-melon", "Sweet melon"),
      p("fresh-fruits:watermelon", "Watermelon"),
      p("fresh-fruits:papaya-green", "Papaya (young, green)"),
    ],
  },
  {
    key: "meat",
    name: { es: "Carnes", en: "Meat" },
    products: [
      p("meat:beef-boneless", "Beef boneless"),
      p("meat:pork-liver", "Pork liver"),
      p("meat:beef-minced", "Beef minced"),
      p("meat:beef-oxtail", "Beef oxtail"),
      p("meat:beef-striploins", "Beef striploins"),
      p("meat:beef-tongues", "Beef tongues"),
      p("meat:chicken-legs", "Chicken legs"),
      p("meat:chicken-whole", "Chicken (whole)"),
      p("meat:chicken-breast", "Chicken breast"),
      p("meat:chicken-wings", "Chicken wings"),
      p("meat:lamb-chops", "Lamb chops"),
      p("meat:lamb-legs", "Lamb legs"),
      p("meat:pork-neck-boneless", "Pork neck (boneless)"),
      p("meat:pork-belly", "Pork belly"),
      p("meat:pork-loin-chops-boneless", "Pork loin chops (boneless)"),
      p("meat:pork-neck-chop-slices", "Pork neck chops (slices)"),
      p("meat:pork-ribs", "Pork ribs"),
      p("meat:pork-whole", "Pork (whole)"),
      p("meat:turkey-whole", "Turkey (whole)"),
    ],
  },
  {
    key: "frozen-fish",
    name: { es: "Pescados", en: "Frozen Fish" },
    products: [
      p("frozen-fish:fish-fillet", "Fish fillet"),
      p("frozen-fish:mackerel-tilapia", "Mackerel / Tilapia"),
      p("frozen-fish:octopus", "Octopus"),
      p("frozen-fish:red-snapper", "Red snapper"),
      p("frozen-fish:shrimps-large", "Shrimps (whole, large)"),
      p("frozen-fish:squid", "Squid"),
      p("frozen-fish:mussels", "Mussels"),
    ],
  },
  {
    key: "dairy",
    name: { es: "Lácteos · Aceites", en: "Dairy · Oils" },
    products: [
      p("dairy:cooking-oil", "Cooking oil"),
      p("dairy:olive-oil-extra-virgin", "Olive oil (extra virgin)"),
      p("dairy:table-butter", "Table butter"),
      p("dairy:eggs", "Eggs"),
      p("dairy:feta-cheese", "Feta cheese"),
      p("dairy:gouda-cheese", "Gouda cheese"),
      p("dairy:edam-cheese", "Edam cheese"),
      p("dairy:mozzarella-cheese", "Mozzarella cheese"),
      p("dairy:parmesan-cheese-powder", "Parmesan cheese (powder)"),
      p("dairy:ice-cream", "Ice cream (assorted)"),
      p("dairy:milk-chocolate", "Chocolate milk"),
      p("dairy:milk-condensed", "Condensed milk"),
      p("dairy:milk-evaporated", "Evaporated milk"),
      p("dairy:milk-fresh-uht", "Fresh long-life milk (UHT)"),
      p("dairy:yogurt-fruit", "Yogurt fruit (personal)"),
      p("dairy:yogurt-greek", "Greek yogurt"),
      p("dairy:whipping-cream", "Whipping cream (unsweetened)"),
    ],
  },
  {
    key: "drinks",
    name: { es: "Bebidas", en: "Drinks" },
    products: [
      p("drinks:coca-cola-regular", "Coca-Cola (regular)"),
      p("drinks:coca-cola-zero", "Coca-Cola (zero sugar)"),
      p("drinks:fanta-orange", "Fanta orange"),
      p("drinks:7up-sprite", "7Up / Sprite"),
      p("drinks:juice-apple", "Apple juice"),
      p("drinks:juice-motion", "Motion juice"),
      p("drinks:juice-orange", "Orange juice"),
      p("drinks:juice-pineapple", "Pineapple juice"),
      p("drinks:water-500ml", "Mineral water (500 ml)"),
      p("drinks:water-1-5l", "Mineral water (1.5 L)"),
      p("drinks:water-5gal", "Mineral water (5 gal)"),
    ],
  },
  {
    key: "grocery",
    name: { es: "Despensa", en: "Grocery" },
    products: [
      // Tinned meat
      p("grocery:chicken-sausages", "Chicken sausages"),
      p("grocery:corned-beef", "Corned beef"),
      p("grocery:frankfurter-sausages-pork", "Frankfurter sausages (pork)"),
      p("grocery:luncheon-meat-chicken", "Luncheon meat (chicken)"),
      p("grocery:luncheon-meat-pork", "Luncheon meat (pork)"),
      p("grocery:salami", "Salami"),
      p("grocery:salami-mortadella", "Mortadella salami"),
      p("grocery:smoked-bacon-slices", "Smoked bacon (slices)"),
      p("grocery:smoked-ham-whole", "Smoked ham (whole)"),
      // Tinned fish
      p("grocery:mackerel-in-oil", "Mackerel in oil"),
      p("grocery:mackerel-in-tomato", "Mackerel in tomato sauce"),
      p("grocery:tuna-in-oil", "Tuna in oil"),
      // Tinned fruits / preserves
      p("grocery:fruit-cocktail", "Fruit cocktail (assorted)"),
      p("grocery:marmalade", "Marmalade"),
      p("grocery:olives-green", "Olives (green)"),
      p("grocery:olives-black", "Olives (black)"),
      p("grocery:mushrooms-tin", "Mushrooms (tin)"),
      p("grocery:pineapple-tin", "Pineapple (tin)"),
      p("grocery:peach-compote", "Peach compote"),
      // Cereals / bakery
      p("grocery:biscuits-dorada", "Biscuits (Dorada)"),
      p("grocery:cake-mix", "Cake mix (assorted)"),
      p("grocery:flour-cake", "Cake flour"),
      p("grocery:flour-all-purpose", "All-purpose flour"),
      p("grocery:macaroni-elbow", "Macaroni elbow"),
      p("grocery:rice-long-grain-greek", "Long-grain rice (Greek style)"),
      p("grocery:rice-long-grain-filipino", "Long-grain rice (Filipino style)"),
      p("grocery:semolina", "Semolina"),
      p("grocery:spaghetti-no5", "Spaghetti No. 5"),
      p("grocery:spaghetti-no10", "Spaghetti No. 10"),
      p("grocery:spaghetti-400g", "Spaghetti (400 g)"),
      p("grocery:penne-pasta", "Penne pasta"),
      p("grocery:toast-bread", "Toast bread"),
      p("grocery:burger-bread", "Burger bread"),
      p("grocery:phyllo-leaves", "Phyllo / baklava leaves"),
      p("grocery:puff-pastry", "Puff pastry"),
      p("grocery:danish-cookies", "Danish cookies"),
      p("grocery:cornflakes", "Cornflakes"),
      p("grocery:quaker-oats", "Quaker oats"),
      p("grocery:popcorn", "Popcorn"),
      p("grocery:noodles", "Noodles"),
      p("grocery:spring-rolls", "Spring rolls"),
      // Baking / leavening
      p("grocery:baking-powder", "Baking powder"),
      p("grocery:baking-soda", "Baking soda"),
      p("grocery:yeast-dry", "Dry yeast"),
      p("grocery:corn-starch", "Corn starch"),
      // Spices / seasonings
      p("grocery:black-pepper-powder", "Black pepper (powder)"),
      p("grocery:black-pepper-whole", "Black pepper (whole)"),
      p("grocery:cinnamon-stick", "Cinnamon stick"),
      p("grocery:cloves", "Cloves"),
      p("grocery:dry-oregano", "Dry oregano"),
      p("grocery:garlic-powder", "Garlic powder"),
      p("grocery:paprika-powder", "Paprika powder"),
      p("grocery:curry-powder", "Curry powder"),
      p("grocery:ajinomoto", "Ajinomoto (MSG)"),
      p("grocery:salt-cooking", "Cooking salt"),
      p("grocery:salt-table", "Table salt"),
      p("grocery:maggi-cubes-beef", "Maggi cubes (beef)"),
      p("grocery:maggi-cubes-chicken", "Maggi cubes (chicken)"),
      // Sauces / condiments
      p("grocery:sauce-bbq", "Barbecue sauce"),
      p("grocery:sauce-fish", "Fish sauce"),
      p("grocery:sauce-ketchup", "Ketchup"),
      p("grocery:sauce-mayonnaise", "Mayonnaise"),
      p("grocery:sauce-mustard", "Mustard"),
      p("grocery:sauce-soy", "Soy sauce (Chinese)"),
      p("grocery:sauce-soy-black-gallon", "Black soy sauce (gallon)"),
      p("grocery:sauce-thousand-island", "Thousand island sauce"),
      p("grocery:sauce-tabasco", "Tabasco sauce"),
      p("grocery:sauce-sweet-chili", "Sweet chili sauce"),
      p("grocery:sauce-oyster", "Oyster sauce"),
      // Vinegars / wines
      p("grocery:vinegar-grape", "Grape vinegar"),
      p("grocery:vinegar-white", "White vinegar"),
      p("grocery:cooking-wine", "Cooking wine (red & white)"),
      // Tomato
      p("grocery:tomato-paste", "Tomato paste"),
      p("grocery:tomato-whole", "Whole tomatoes"),
      // Coffee / tea / cocoa
      p("grocery:coffee-creamer", "Coffee creamer"),
      p("grocery:coffee-instant", "Instant coffee (Nescafé classic)"),
      p("grocery:coffee-santo-domingo", "Santo Domingo ground coffee"),
      p("grocery:coffee-greek-espresso", "Greek coffee / espresso"),
      p("grocery:tea-lipton-green", "Lipton green tea"),
      p("grocery:tea-lipton-yellow", "Lipton yellow tea"),
      p("grocery:cocoa-powder", "Cocoa powder"),
      // Sugars / sweets
      p("grocery:sugar-brown", "Brown sugar"),
      p("grocery:sugar-castor", "Caster sugar"),
      p("grocery:sugar-white", "White granulated sugar"),
      p("grocery:honey", "Honey"),
      p("grocery:syrup-chocolate", "Chocolate syrup"),
      p("grocery:nutella", "Nutella"),
      p("grocery:jelly", "Jelly (assorted)"),
      // Dry beans / legumes / nuts / seeds
      p("grocery:lentils-dry", "Dry lentils"),
      p("grocery:white-beans-giant", "Dry white beans (giant)"),
      p("grocery:white-beans-small", "Dry white beans (small)"),
      p("grocery:split-peas-yellow", "Dry yellow split peas"),
      p("grocery:mung-beans", "Mung beans"),
      p("grocery:roasted-almonds", "Roasted almonds"),
      p("grocery:roasted-peanuts", "Roasted peanuts"),
      p("grocery:peanut-butter", "Peanut butter"),
      p("grocery:walnuts-shelled", "Walnuts (shelled)"),
      p("grocery:sesame-seeds", "Sesame seeds"),
      p("grocery:raisins", "Raisins"),
      // Misc
      p("grocery:milk-powder", "Powdered milk"),
      p("grocery:coconut-milk-tin", "Coconut milk (tin)"),
      p("grocery:vanilla-liquid", "Vanilla (liquid)"),
    ],
  },
  {
    key: "cleaning",
    name: { es: "Limpieza · Cabin", en: "Cleaning · Cabin" },
    products: [
      // Cleaning chemicals
      p("cleaning:bleach-liquid", "Bleach (liquid chlorine)", "Ltrs"),
      p("cleaning:multi-purpose-cleaner", "Multi-purpose cleaner", "Ltrs"),
      p("cleaning:bathroom-cleaner", "Bathroom cleaner / descaler", "Btls"),
      p("cleaning:dish-soap", "Dish soap / washing-up liquid", "Ltrs"),
      p("cleaning:floor-cleaner", "Floor cleaner / degreaser", "Ltrs"),
      p("cleaning:glass-cleaner", "Glass cleaner", "Btls"),
      p("cleaning:toilet-cleaner", "Toilet bowl cleaner", "Btls"),
      p("cleaning:laundry-detergent-powder", "Laundry detergent (powder)", "Kgs"),
      p("cleaning:laundry-detergent-liquid", "Laundry detergent (liquid)", "Ltrs"),
      p("cleaning:fabric-softener", "Fabric softener", "Ltrs"),
      p("cleaning:air-freshener", "Air freshener spray", "Pcs"),
      p("cleaning:insecticide", "Insecticide spray", "Pcs"),
      // Tools & supplies
      p("cleaning:mop-heads", "Mop heads", "Pcs"),
      p("cleaning:broom-dustpan", "Broom with dustpan", "Pcs"),
      p("cleaning:scrubbing-brush", "Scrubbing brushes", "Pcs"),
      p("cleaning:sponges", "Sponges / scrubbing pads", "Pack"),
      p("cleaning:microfiber-cloths", "Microfiber cloths", "Pack"),
      p("cleaning:rubber-gloves", "Rubber gloves", "Pairs"),
      p("cleaning:garbage-bags-large", "Garbage bags (large 200L)", "Roll"),
      p("cleaning:garbage-bags-medium", "Garbage bags (medium 100L)", "Roll"),
      p("cleaning:toilet-paper", "Toilet paper", "Roll"),
      p("cleaning:paper-towels", "Paper towels / kitchen roll", "Roll"),
      // Personal hygiene
      p("cleaning:hand-soap-bar", "Hand soap (bar)", "Pcs"),
      p("cleaning:hand-soap-liquid", "Hand soap (liquid)", "Btls"),
      p("cleaning:shampoo", "Shampoo", "Btls"),
      p("cleaning:body-wash", "Body wash / shower gel", "Btls"),
      p("cleaning:conditioner", "Conditioner", "Btls"),
      p("cleaning:toothpaste", "Toothpaste", "Pcs"),
      p("cleaning:toothbrushes", "Toothbrushes", "Pcs"),
      p("cleaning:shaving-cream", "Shaving cream", "Pcs"),
      p("cleaning:disposable-razors", "Disposable razors", "Pcs"),
      p("cleaning:deodorant", "Deodorant", "Pcs"),
    ],
  },
  {
    key: "bonded",
    name: { es: "Bonded Stores", en: "Bonded Stores" },
    products: [
      // Tobacco
      p("bonded:cigarettes-marlboro", "Cigarettes (Marlboro)", "Carton"),
      p("bonded:cigarettes-winston", "Cigarettes (Winston)", "Carton"),
      p("bonded:cigarettes-lm", "Cigarettes (L&M)", "Carton"),
      p("bonded:cigarettes-camel", "Cigarettes (Camel)", "Carton"),
      p("bonded:rolling-tobacco", "Rolling tobacco", "Pcs"),
      p("bonded:cigars", "Cigars", "Pcs"),
      // Beer
      p("bonded:beer-presidente", "Beer (Presidente)", "Case"),
      p("bonded:beer-heineken", "Beer (Heineken)", "Case"),
      p("bonded:beer-corona", "Beer (Corona)", "Case"),
      p("bonded:beer-budweiser", "Beer (Budweiser)", "Case"),
      // Spirits
      p("bonded:rum-barcelo", "Rum (Barceló añejo)", "Btls"),
      p("bonded:rum-brugal", "Rum (Brugal extra viejo)", "Btls"),
      p("bonded:whisky-jw-red", "Whisky (Johnnie Walker Red)", "Btls"),
      p("bonded:whisky-jw-black", "Whisky (Johnnie Walker Black)", "Btls"),
      p("bonded:whisky-jd", "Whisky (Jack Daniel's)", "Btls"),
      p("bonded:vodka-absolut", "Vodka (Absolut)", "Btls"),
      // Miscellaneous
      p("bonded:chocolates", "Assorted chocolates", "Pcs"),
      p("bonded:candy", "Assorted candy / sweets", "Pcs"),
      p("bonded:playing-cards", "Playing cards", "Pcs"),
      p("bonded:lighters", "Cigarette lighters", "Pcs"),
    ],
  },
];

/** Total product count across all categories. */
export const PROVISION_PRODUCT_COUNT = PROVISION_CATALOG.reduce(
  (sum, c) => sum + c.products.length,
  0
);

/**
 * High-level groups for quick cross-category filter chips on the catalog UI.
 * Each category key belongs to exactly one group.
 */
export type ProvisionGroupKey =
  | "all"
  | "fresh"
  | "frozen"
  | "meat"
  | "dry"
  | "drinks"
  | "non-food";

export const PROVISION_GROUPS: Array<{
  key: ProvisionGroupKey;
  name: { es: string; en: string };
  categoryKeys: string[];
}> = [
  {
    key: "all",
    name: { es: "Todos", en: "All" },
    categoryKeys: PROVISION_CATALOG.map((c) => c.key),
  },
  {
    key: "fresh",
    name: { es: "Frescos", en: "Fresh" },
    categoryKeys: ["fresh-vegetables", "fresh-fruits", "dairy"],
  },
  {
    key: "frozen",
    name: { es: "Congelados", en: "Frozen" },
    categoryKeys: ["frozen-vegetables", "frozen-fish"],
  },
  {
    key: "meat",
    name: { es: "Carnes", en: "Meat" },
    categoryKeys: ["meat"],
  },
  {
    key: "dry",
    name: { es: "Despensa", en: "Pantry" },
    categoryKeys: ["grocery"],
  },
  {
    key: "drinks",
    name: { es: "Bebidas", en: "Drinks" },
    categoryKeys: ["drinks"],
  },
  {
    key: "non-food",
    name: { es: "No-alimentos", en: "Non-food" },
    categoryKeys: ["cleaning", "bonded"],
  },
];

/** Map from category key → group key, for fast lookup. */
export const CATEGORY_TO_GROUP: Record<string, ProvisionGroupKey> = (() => {
  const map: Record<string, ProvisionGroupKey> = {};
  for (const group of PROVISION_GROUPS) {
    if (group.key === "all") continue;
    for (const catKey of group.categoryKeys) map[catKey] = group.key;
  }
  return map;
})();

/** Lookup a product by its stable id. Returns undefined if not found. */
export function findProvisionProduct(id: string): ProvisionProduct | undefined {
  for (const cat of PROVISION_CATALOG) {
    const hit = cat.products.find((x) => x.id === id);
    if (hit) return hit;
  }
  return undefined;
}
