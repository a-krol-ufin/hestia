import type { PredefinedProduct } from '@/types/shopping.types'

export const PREDEFINED_PRODUCTS: PredefinedProduct[] = [
  // Owoce
  { name: 'Jabłka', nameEn: 'Apples', category: 'fruits', defaultUnit: 'kg', icon: 'Apple' },
  { name: 'Banany', nameEn: 'Bananas', category: 'fruits', defaultUnit: 'kg', icon: 'Banana' },
  { name: 'Pomarańcze', nameEn: 'Oranges', category: 'fruits', defaultUnit: 'kg', icon: 'Citrus' },
  { name: 'Mandarynki', nameEn: 'Mandarins', category: 'fruits', defaultUnit: 'kg', icon: 'Citrus' },
  { name: 'Gruszki', nameEn: 'Pears', category: 'fruits', defaultUnit: 'kg', icon: 'Apple' },
  { name: 'Winogrona', nameEn: 'Grapes', category: 'fruits', defaultUnit: 'kg', icon: 'Grape' },
  { name: 'Truskawki', nameEn: 'Strawberries', category: 'fruits', defaultUnit: 'kg', icon: 'Cherry' },
  { name: 'Cytryny', nameEn: 'Lemons', category: 'fruits', defaultUnit: 'szt', icon: 'Citrus' },
  { name: 'Arbuzy', nameEn: 'Watermelons', category: 'fruits', defaultUnit: 'szt', icon: 'Cherry' },
  { name: 'Brzoskwinie', nameEn: 'Peaches', category: 'fruits', defaultUnit: 'kg', icon: 'Cherry' },

  // Warzywa
  { name: 'Ziemniaki', nameEn: 'Potatoes', category: 'vegetables', defaultUnit: 'kg', icon: 'Wheat' },
  { name: 'Marchew', nameEn: 'Carrots', category: 'vegetables', defaultUnit: 'kg', icon: 'Carrot' },
  { name: 'Pomidory', nameEn: 'Tomatoes', category: 'vegetables', defaultUnit: 'kg', icon: 'Cherry' },
  { name: 'Ogórki', nameEn: 'Cucumbers', category: 'vegetables', defaultUnit: 'kg', icon: 'Salad' },
  { name: 'Cebula', nameEn: 'Onions', category: 'vegetables', defaultUnit: 'kg', icon: 'CircleDot' },
  { name: 'Czosnek', nameEn: 'Garlic', category: 'vegetables', defaultUnit: 'szt', icon: 'CircleDot' },
  { name: 'Papryka', nameEn: 'Bell Peppers', category: 'vegetables', defaultUnit: 'kg', icon: 'Salad' },
  { name: 'Sałata', nameEn: 'Lettuce', category: 'vegetables', defaultUnit: 'szt', icon: 'Salad' },
  { name: 'Brokuły', nameEn: 'Broccoli', category: 'vegetables', defaultUnit: 'kg', icon: 'Salad' },
  { name: 'Kalafior', nameEn: 'Cauliflower', category: 'vegetables', defaultUnit: 'szt', icon: 'Salad' },
  { name: 'Kapusta', nameEn: 'Cabbage', category: 'vegetables', defaultUnit: 'kg', icon: 'Salad' },
  { name: 'Buraki', nameEn: 'Beets', category: 'vegetables', defaultUnit: 'kg', icon: 'CircleDot' },
  { name: 'Por', nameEn: 'Leeks', category: 'vegetables', defaultUnit: 'kg', icon: 'Salad' },
  { name: 'Szpinak', nameEn: 'Spinach', category: 'vegetables', defaultUnit: 'kg', icon: 'Leaf' },

  // Mięso
  { name: 'Kurczak', nameEn: 'Chicken', category: 'meat', defaultUnit: 'kg', icon: 'Drumstick' },
  { name: 'Pierś z kurczaka', nameEn: 'Chicken Breast', category: 'meat', defaultUnit: 'kg', icon: 'Drumstick' },
  { name: 'Udka z kurczaka', nameEn: 'Chicken Thighs', category: 'meat', defaultUnit: 'kg', icon: 'Drumstick' },
  { name: 'Wieprzowina', nameEn: 'Pork', category: 'meat', defaultUnit: 'kg', icon: 'Ham' },
  { name: 'Wołowina', nameEn: 'Beef', category: 'meat', defaultUnit: 'kg', icon: 'Beef' },
  { name: 'Mięso mielone', nameEn: 'Ground Meat', category: 'meat', defaultUnit: 'kg', icon: 'Beef' },
  { name: 'Parówki', nameEn: 'Hot Dogs', category: 'meat', defaultUnit: 'kg', icon: 'Ham' },
  { name: 'Kiełbasa', nameEn: 'Sausage', category: 'meat', defaultUnit: 'kg', icon: 'Ham' },
  { name: 'Szynka', nameEn: 'Ham', category: 'meat', defaultUnit: 'kg', icon: 'Ham' },
  { name: 'Boczek', nameEn: 'Bacon', category: 'meat', defaultUnit: 'kg', icon: 'Ham' },

  // Ryby
  { name: 'Łosoś', nameEn: 'Salmon', category: 'fish', defaultUnit: 'kg', icon: 'Fish' },
  { name: 'Dorsz', nameEn: 'Cod', category: 'fish', defaultUnit: 'kg', icon: 'Fish' },
  { name: 'Tuńczyk w puszce', nameEn: 'Canned Tuna', category: 'fish', defaultUnit: 'szt', icon: 'Fish' },
  { name: 'Śledź', nameEn: 'Herring', category: 'fish', defaultUnit: 'kg', icon: 'Fish' },
  { name: 'Krewetki', nameEn: 'Shrimp', category: 'fish', defaultUnit: 'kg', icon: 'Fish' },

  // Nabiał
  { name: 'Mleko', nameEn: 'Milk', category: 'dairy', defaultUnit: 'l', icon: 'Milk' },
  { name: 'Jogurt', nameEn: 'Yogurt', category: 'dairy', defaultUnit: 'szt', icon: 'IceCream' },
  { name: 'Ser żółty', nameEn: 'Yellow Cheese', category: 'dairy', defaultUnit: 'kg', icon: 'Pizza' },
  { name: 'Ser biały', nameEn: 'White Cheese', category: 'dairy', defaultUnit: 'kg', icon: 'Pizza' },
  { name: 'Ser feta', nameEn: 'Feta Cheese', category: 'dairy', defaultUnit: 'kg', icon: 'Pizza' },
  { name: 'Masło', nameEn: 'Butter', category: 'dairy', defaultUnit: 'szt', icon: 'Square' },
  { name: 'Śmietana', nameEn: 'Sour Cream', category: 'dairy', defaultUnit: 'szt', icon: 'IceCream' },
  { name: 'Jajka', nameEn: 'Eggs', category: 'dairy', defaultUnit: 'szt', icon: 'Egg' },
  { name: 'Kefir', nameEn: 'Kefir', category: 'dairy', defaultUnit: 'l', icon: 'Milk' },
  { name: 'Twaróg', nameEn: 'Cottage Cheese', category: 'dairy', defaultUnit: 'kg', icon: 'Pizza' },

  // Pieczywo
  { name: 'Chleb', nameEn: 'Bread', category: 'bread', defaultUnit: 'szt', icon: 'Sandwich' },
  { name: 'Bułki', nameEn: 'Rolls', category: 'bread', defaultUnit: 'szt', icon: 'Cookie' },
  { name: 'Bagietka', nameEn: 'Baguette', category: 'bread', defaultUnit: 'szt', icon: 'Sandwich' },
  { name: 'Tost', nameEn: 'Toast Bread', category: 'bread', defaultUnit: 'szt', icon: 'Sandwich' },
  { name: 'Pita', nameEn: 'Pita Bread', category: 'bread', defaultUnit: 'szt', icon: 'Cookie' },

  // Zboża i makarony
  { name: 'Ryż', nameEn: 'Rice', category: 'grains', defaultUnit: 'kg', icon: 'Wheat' },
  { name: 'Kasza gryczana', nameEn: 'Buckwheat', category: 'grains', defaultUnit: 'kg', icon: 'Wheat' },
  { name: 'Płatki owsiane', nameEn: 'Oatmeal', category: 'grains', defaultUnit: 'kg', icon: 'Wheat' },
  { name: 'Mąka', nameEn: 'Flour', category: 'grains', defaultUnit: 'kg', icon: 'Package' },
  { name: 'Cukier', nameEn: 'Sugar', category: 'grains', defaultUnit: 'kg', icon: 'Sparkles' },

  // Makarony
  { name: 'Makaron', nameEn: 'Pasta', category: 'pasta', defaultUnit: 'kg', icon: 'UtensilsCrossed' },
  { name: 'Spaghetti', nameEn: 'Spaghetti', category: 'pasta', defaultUnit: 'kg', icon: 'UtensilsCrossed' },
  { name: 'Penne', nameEn: 'Penne', category: 'pasta', defaultUnit: 'kg', icon: 'UtensilsCrossed' },

  // Konserwy
  { name: 'Pomidory w puszce', nameEn: 'Canned Tomatoes', category: 'canned', defaultUnit: 'szt', icon: 'CircleDot' },
  { name: 'Kukurydza w puszce', nameEn: 'Canned Corn', category: 'canned', defaultUnit: 'szt', icon: 'CircleDot' },
  { name: 'Groszek w puszce', nameEn: 'Canned Peas', category: 'canned', defaultUnit: 'szt', icon: 'CircleDot' },
  { name: 'Fasola w puszce', nameEn: 'Canned Beans', category: 'canned', defaultUnit: 'szt', icon: 'CircleDot' },

  // Mrożonki
  { name: 'Warzywa mrożone', nameEn: 'Frozen Vegetables', category: 'frozen', defaultUnit: 'kg', icon: 'Snowflake' },
  { name: 'Owoce mrożone', nameEn: 'Frozen Fruits', category: 'frozen', defaultUnit: 'kg', icon: 'Snowflake' },
  { name: 'Pizza mrożona', nameEn: 'Frozen Pizza', category: 'frozen', defaultUnit: 'szt', icon: 'Pizza' },
  { name: 'Lody', nameEn: 'Ice Cream', category: 'frozen', defaultUnit: 'szt', icon: 'IceCream' },
  { name: 'Frytki mrożone', nameEn: 'Frozen Fries', category: 'frozen', defaultUnit: 'kg', icon: 'Fries' },

  // Przekąski
  { name: 'Chipsy', nameEn: 'Chips', category: 'snacks', defaultUnit: 'szt', icon: 'Package' },
  { name: 'Orzeszki', nameEn: 'Nuts', category: 'snacks', defaultUnit: 'kg', icon: 'Nut' },
  { name: 'Krakersy', nameEn: 'Crackers', category: 'snacks', defaultUnit: 'szt', icon: 'Cookie' },
  { name: 'Paluszki', nameEn: 'Breadsticks', category: 'snacks', defaultUnit: 'szt', icon: 'Cookie' },

  // Słodycze
  { name: 'Czekolada', nameEn: 'Chocolate', category: 'sweets', defaultUnit: 'szt', icon: 'Candy' },
  { name: 'Cukierki', nameEn: 'Candy', category: 'sweets', defaultUnit: 'kg', icon: 'Candy' },
  { name: 'Ciastka', nameEn: 'Cookies', category: 'sweets', defaultUnit: 'szt', icon: 'Cookie' },
  { name: 'Wafel', nameEn: 'Wafer', category: 'sweets', defaultUnit: 'szt', icon: 'Cookie' },

  // Napoje
  { name: 'Woda mineralna', nameEn: 'Mineral Water', category: 'beverages', defaultUnit: 'l', icon: 'Droplet' },
  { name: 'Sok', nameEn: 'Juice', category: 'beverages', defaultUnit: 'l', icon: 'Wine' },
  { name: 'Kawa', nameEn: 'Coffee', category: 'beverages', defaultUnit: 'kg', icon: 'Coffee' },
  { name: 'Herbata', nameEn: 'Tea', category: 'beverages', defaultUnit: 'szt', icon: 'Cup' },
  { name: 'Cola', nameEn: 'Cola', category: 'beverages', defaultUnit: 'l', icon: 'Soda' },
  { name: 'Sprite', nameEn: 'Sprite', category: 'beverages', defaultUnit: 'l', icon: 'Soda' },
  { name: 'Pepsi', nameEn: 'Pepsi', category: 'beverages', defaultUnit: 'l', icon: 'Soda' },

  // Alkohol
  { name: 'Piwo', nameEn: 'Beer', category: 'alcohol', defaultUnit: 'l', icon: 'Beer' },
  { name: 'Wino', nameEn: 'Wine', category: 'alcohol', defaultUnit: 'l', icon: 'Wine' },
  { name: 'Wódka', nameEn: 'Vodka', category: 'alcohol', defaultUnit: 'l', icon: 'Wine' },

  // Przyprawy
  { name: 'Sól', nameEn: 'Salt', category: 'spices', defaultUnit: 'kg', icon: 'Sparkles' },
  { name: 'Pieprz', nameEn: 'Pepper', category: 'spices', defaultUnit: 'kg', icon: 'Sparkles' },
  { name: 'Papryka słodka', nameEn: 'Sweet Paprika', category: 'spices', defaultUnit: 'szt', icon: 'Sparkles' },
  { name: 'Oregano', nameEn: 'Oregano', category: 'spices', defaultUnit: 'szt', icon: 'Leaf' },
  { name: 'Bazylia', nameEn: 'Basil', category: 'spices', defaultUnit: 'szt', icon: 'Leaf' },
  { name: 'Cynamon', nameEn: 'Cinnamon', category: 'spices', defaultUnit: 'szt', icon: 'Sparkles' },

  // Oleje
  { name: 'Olej słonecznikowy', nameEn: 'Sunflower Oil', category: 'oils', defaultUnit: 'l', icon: 'Droplet' },
  { name: 'Oliwa z oliwek', nameEn: 'Olive Oil', category: 'oils', defaultUnit: 'l', icon: 'Droplet' },
  { name: 'Olej rzepakowy', nameEn: 'Rapeseed Oil', category: 'oils', defaultUnit: 'l', icon: 'Droplet' },

  // Sosy
  { name: 'Ketchup', nameEn: 'Ketchup', category: 'sauces', defaultUnit: 'szt', icon: 'Sauce' },
  { name: 'Musztarda', nameEn: 'Mustard', category: 'sauces', defaultUnit: 'szt', icon: 'Sauce' },
  { name: 'Majonez', nameEn: 'Mayonnaise', category: 'sauces', defaultUnit: 'szt', icon: 'Sauce' },
  { name: 'Sos sojowy', nameEn: 'Soy Sauce', category: 'sauces', defaultUnit: 'szt', icon: 'Sauce' },

  // Produkty do pieczenia
  { name: 'Proszek do pieczenia', nameEn: 'Baking Powder', category: 'baking', defaultUnit: 'szt', icon: 'Package' },
  { name: 'Drożdże', nameEn: 'Yeast', category: 'baking', defaultUnit: 'szt', icon: 'Package' },
  { name: 'Cukier waniliowy', nameEn: 'Vanilla Sugar', category: 'baking', defaultUnit: 'szt', icon: 'Sparkles' },
  { name: 'Kakao', nameEn: 'Cocoa', category: 'baking', defaultUnit: 'kg', icon: 'Cookie' },

  // Produkty dla dzieci
  { name: 'Mleko modyfikowane', nameEn: 'Baby Formula', category: 'baby', defaultUnit: 'szt', icon: 'Baby' },
  { name: 'Pieluchy', nameEn: 'Diapers', category: 'baby', defaultUnit: 'szt', icon: 'Baby' },
  { name: 'Chusteczki nawilżane', nameEn: 'Wet Wipes', category: 'baby', defaultUnit: 'szt', icon: 'Package' },

  // Karma dla zwierząt
  { name: 'Karma dla psa', nameEn: 'Dog Food', category: 'pet', defaultUnit: 'kg', icon: 'Dog' },
  { name: 'Karma dla kota', nameEn: 'Cat Food', category: 'pet', defaultUnit: 'kg', icon: 'Cat' },
  { name: 'Żwirek dla kota', nameEn: 'Cat Litter', category: 'pet', defaultUnit: 'kg', icon: 'Package' },

  // Środki czystości
  { name: 'Płyn do mycia naczyń', nameEn: 'Dish Soap', category: 'cleaning', defaultUnit: 'szt', icon: 'Droplet' },
  { name: 'Proszek do prania', nameEn: 'Laundry Detergent', category: 'cleaning', defaultUnit: 'kg', icon: 'Package' },
  { name: 'Płyn do podłóg', nameEn: 'Floor Cleaner', category: 'cleaning', defaultUnit: 'szt', icon: 'Droplet' },
  { name: 'Papier toaletowy', nameEn: 'Toilet Paper', category: 'cleaning', defaultUnit: 'szt', icon: 'Package' },
  { name: 'Ręczniki papierowe', nameEn: 'Paper Towels', category: 'cleaning', defaultUnit: 'szt', icon: 'Package' },
  { name: 'Worki na śmieci', nameEn: 'Trash Bags', category: 'cleaning', defaultUnit: 'szt', icon: 'Package' },

  // Higiena
  { name: 'Pasta do zębów', nameEn: 'Toothpaste', category: 'hygiene', defaultUnit: 'szt', icon: 'Smile' },
  { name: 'Szczoteczka do zębów', nameEn: 'Toothbrush', category: 'hygiene', defaultUnit: 'szt', icon: 'Brush' },
  { name: 'Szampon', nameEn: 'Shampoo', category: 'hygiene', defaultUnit: 'szt', icon: 'Droplet' },
  { name: 'Mydło', nameEn: 'Soap', category: 'hygiene', defaultUnit: 'szt', icon: 'Droplet' },
  { name: 'Dezodorant', nameEn: 'Deodorant', category: 'hygiene', defaultUnit: 'szt', icon: 'Spray' },
  { name: 'Żel pod prysznic', nameEn: 'Shower Gel', category: 'hygiene', defaultUnit: 'szt', icon: 'Droplet' },

  // Kosmetyki
  { name: 'Krem do rąk', nameEn: 'Hand Cream', category: 'cosmetics', defaultUnit: 'szt', icon: 'Droplet' },
  { name: 'Krem do twarzy', nameEn: 'Face Cream', category: 'cosmetics', defaultUnit: 'szt', icon: 'Sparkles' },
  { name: 'Balsam do ciała', nameEn: 'Body Lotion', category: 'cosmetics', defaultUnit: 'szt', icon: 'Droplet' },

  // Zdrowie
  { name: 'Witaminy', nameEn: 'Vitamins', category: 'health', defaultUnit: 'szt', icon: 'Pill' },
  { name: 'Plastry', nameEn: 'Band-Aids', category: 'health', defaultUnit: 'szt', icon: 'Cross' },
  { name: 'Leki przeciwbólowe', nameEn: 'Pain Relievers', category: 'health', defaultUnit: 'szt', icon: 'Pill' },

  // Artykuły gospodarstwa domowego
  { name: 'Baterie', nameEn: 'Batteries', category: 'household', defaultUnit: 'szt', icon: 'Battery' },
  { name: 'Żarówki', nameEn: 'Light Bulbs', category: 'household', defaultUnit: 'szt', icon: 'Lightbulb' },
  { name: 'Zapałki', nameEn: 'Matches', category: 'household', defaultUnit: 'szt', icon: 'Flame' },
]
