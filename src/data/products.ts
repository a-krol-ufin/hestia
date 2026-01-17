import type { PredefinedProduct } from '@/types/shopping.types'

export const PREDEFINED_PRODUCTS: PredefinedProduct[] = [
  // Owoce
  { name: 'Jabłka', nameEn: 'Apples', category: 'fruits', defaultUnit: 'kg' },
  { name: 'Banany', nameEn: 'Bananas', category: 'fruits', defaultUnit: 'kg' },
  { name: 'Pomarańcze', nameEn: 'Oranges', category: 'fruits', defaultUnit: 'kg' },
  { name: 'Mandarynki', nameEn: 'Mandarins', category: 'fruits', defaultUnit: 'kg' },
  { name: 'Gruszki', nameEn: 'Pears', category: 'fruits', defaultUnit: 'kg' },
  { name: 'Winogrona', nameEn: 'Grapes', category: 'fruits', defaultUnit: 'kg' },
  { name: 'Truskawki', nameEn: 'Strawberries', category: 'fruits', defaultUnit: 'kg' },
  { name: 'Cytryny', nameEn: 'Lemons', category: 'fruits', defaultUnit: 'szt' },
  { name: 'Arbuzy', nameEn: 'Watermelons', category: 'fruits', defaultUnit: 'szt' },
  { name: 'Brzoskwinie', nameEn: 'Peaches', category: 'fruits', defaultUnit: 'kg' },

  // Warzywa
  { name: 'Ziemniaki', nameEn: 'Potatoes', category: 'vegetables', defaultUnit: 'kg' },
  { name: 'Marchew', nameEn: 'Carrots', category: 'vegetables', defaultUnit: 'kg' },
  { name: 'Pomidory', nameEn: 'Tomatoes', category: 'vegetables', defaultUnit: 'kg' },
  { name: 'Ogórki', nameEn: 'Cucumbers', category: 'vegetables', defaultUnit: 'kg' },
  { name: 'Cebula', nameEn: 'Onions', category: 'vegetables', defaultUnit: 'kg' },
  { name: 'Czosnek', nameEn: 'Garlic', category: 'vegetables', defaultUnit: 'szt' },
  { name: 'Papryka', nameEn: 'Bell Peppers', category: 'vegetables', defaultUnit: 'kg' },
  { name: 'Sałata', nameEn: 'Lettuce', category: 'vegetables', defaultUnit: 'szt' },
  { name: 'Brokuły', nameEn: 'Broccoli', category: 'vegetables', defaultUnit: 'kg' },
  { name: 'Kalafior', nameEn: 'Cauliflower', category: 'vegetables', defaultUnit: 'szt' },
  { name: 'Kapusta', nameEn: 'Cabbage', category: 'vegetables', defaultUnit: 'kg' },
  { name: 'Buraki', nameEn: 'Beets', category: 'vegetables', defaultUnit: 'kg' },
  { name: 'Por', nameEn: 'Leeks', category: 'vegetables', defaultUnit: 'kg' },
  { name: 'Szpinak', nameEn: 'Spinach', category: 'vegetables', defaultUnit: 'kg' },

  // Mięso
  { name: 'Kurczak', nameEn: 'Chicken', category: 'meat', defaultUnit: 'kg' },
  { name: 'Pierś z kurczaka', nameEn: 'Chicken Breast', category: 'meat', defaultUnit: 'kg' },
  { name: 'Udka z kurczaka', nameEn: 'Chicken Thighs', category: 'meat', defaultUnit: 'kg' },
  { name: 'Wieprzowina', nameEn: 'Pork', category: 'meat', defaultUnit: 'kg' },
  { name: 'Wołowina', nameEn: 'Beef', category: 'meat', defaultUnit: 'kg' },
  { name: 'Mięso mielone', nameEn: 'Ground Meat', category: 'meat', defaultUnit: 'kg' },
  { name: 'Parówki', nameEn: 'Hot Dogs', category: 'meat', defaultUnit: 'kg' },
  { name: 'Kiełbasa', nameEn: 'Sausage', category: 'meat', defaultUnit: 'kg' },
  { name: 'Szynka', nameEn: 'Ham', category: 'meat', defaultUnit: 'kg' },
  { name: 'Boczek', nameEn: 'Bacon', category: 'meat', defaultUnit: 'kg' },

  // Ryby
  { name: 'Łosoś', nameEn: 'Salmon', category: 'fish', defaultUnit: 'kg' },
  { name: 'Dorsz', nameEn: 'Cod', category: 'fish', defaultUnit: 'kg' },
  { name: 'Tuńczyk w puszce', nameEn: 'Canned Tuna', category: 'fish', defaultUnit: 'szt' },
  { name: 'Śledź', nameEn: 'Herring', category: 'fish', defaultUnit: 'kg' },
  { name: 'Krewetki', nameEn: 'Shrimp', category: 'fish', defaultUnit: 'kg' },

  // Nabiał
  { name: 'Mleko', nameEn: 'Milk', category: 'dairy', defaultUnit: 'l' },
  { name: 'Jogurt', nameEn: 'Yogurt', category: 'dairy', defaultUnit: 'szt' },
  { name: 'Ser żółty', nameEn: 'Yellow Cheese', category: 'dairy', defaultUnit: 'kg' },
  { name: 'Ser biały', nameEn: 'White Cheese', category: 'dairy', defaultUnit: 'kg' },
  { name: 'Ser feta', nameEn: 'Feta Cheese', category: 'dairy', defaultUnit: 'kg' },
  { name: 'Masło', nameEn: 'Butter', category: 'dairy', defaultUnit: 'szt' },
  { name: 'Śmietana', nameEn: 'Sour Cream', category: 'dairy', defaultUnit: 'szt' },
  { name: 'Jajka', nameEn: 'Eggs', category: 'dairy', defaultUnit: 'szt' },
  { name: 'Kefir', nameEn: 'Kefir', category: 'dairy', defaultUnit: 'l' },
  { name: 'Twaróg', nameEn: 'Cottage Cheese', category: 'dairy', defaultUnit: 'kg' },

  // Pieczywo
  { name: 'Chleb', nameEn: 'Bread', category: 'bread', defaultUnit: 'szt' },
  { name: 'Bułki', nameEn: 'Rolls', category: 'bread', defaultUnit: 'szt' },
  { name: 'Bagietka', nameEn: 'Baguette', category: 'bread', defaultUnit: 'szt' },
  { name: 'Tost', nameEn: 'Toast Bread', category: 'bread', defaultUnit: 'szt' },
  { name: 'Pita', nameEn: 'Pita Bread', category: 'bread', defaultUnit: 'szt' },

  // Zboża i makarony
  { name: 'Ryż', nameEn: 'Rice', category: 'grains', defaultUnit: 'kg' },
  { name: 'Kasza gryczana', nameEn: 'Buckwheat', category: 'grains', defaultUnit: 'kg' },
  { name: 'Płatki owsiane', nameEn: 'Oatmeal', category: 'grains', defaultUnit: 'kg' },
  { name: 'Mąka', nameEn: 'Flour', category: 'grains', defaultUnit: 'kg' },
  { name: 'Cukier', nameEn: 'Sugar', category: 'grains', defaultUnit: 'kg' },

  // Makarony
  { name: 'Makaron', nameEn: 'Pasta', category: 'pasta', defaultUnit: 'kg' },
  { name: 'Spaghetti', nameEn: 'Spaghetti', category: 'pasta', defaultUnit: 'kg' },
  { name: 'Penne', nameEn: 'Penne', category: 'pasta', defaultUnit: 'kg' },

  // Konserwy
  { name: 'Pomidory w puszce', nameEn: 'Canned Tomatoes', category: 'canned', defaultUnit: 'szt' },
  { name: 'Kukurydza w puszce', nameEn: 'Canned Corn', category: 'canned', defaultUnit: 'szt' },
  { name: 'Groszek w puszce', nameEn: 'Canned Peas', category: 'canned', defaultUnit: 'szt' },
  { name: 'Fasola w puszce', nameEn: 'Canned Beans', category: 'canned', defaultUnit: 'szt' },

  // Mrożonki
  { name: 'Warzywa mrożone', nameEn: 'Frozen Vegetables', category: 'frozen', defaultUnit: 'kg' },
  { name: 'Owoce mrożone', nameEn: 'Frozen Fruits', category: 'frozen', defaultUnit: 'kg' },
  { name: 'Pizza mrożona', nameEn: 'Frozen Pizza', category: 'frozen', defaultUnit: 'szt' },
  { name: 'Lody', nameEn: 'Ice Cream', category: 'frozen', defaultUnit: 'szt' },
  { name: 'Frytki mrożone', nameEn: 'Frozen Fries', category: 'frozen', defaultUnit: 'kg' },

  // Przekąski
  { name: 'Chipsy', nameEn: 'Chips', category: 'snacks', defaultUnit: 'szt' },
  { name: 'Orzeszki', nameEn: 'Nuts', category: 'snacks', defaultUnit: 'kg' },
  { name: 'Krakersy', nameEn: 'Crackers', category: 'snacks', defaultUnit: 'szt' },
  { name: 'Paluszki', nameEn: 'Breadsticks', category: 'snacks', defaultUnit: 'szt' },

  // Słodycze
  { name: 'Czekolada', nameEn: 'Chocolate', category: 'sweets', defaultUnit: 'szt' },
  { name: 'Cukierki', nameEn: 'Candy', category: 'sweets', defaultUnit: 'kg' },
  { name: 'Ciastka', nameEn: 'Cookies', category: 'sweets', defaultUnit: 'szt' },
  { name: 'Wafel', nameEn: 'Wafer', category: 'sweets', defaultUnit: 'szt' },

  // Napoje
  { name: 'Woda mineralna', nameEn: 'Mineral Water', category: 'beverages', defaultUnit: 'l' },
  { name: 'Sok', nameEn: 'Juice', category: 'beverages', defaultUnit: 'l' },
  { name: 'Kawa', nameEn: 'Coffee', category: 'beverages', defaultUnit: 'kg' },
  { name: 'Herbata', nameEn: 'Tea', category: 'beverages', defaultUnit: 'szt' },
  { name: 'Cola', nameEn: 'Cola', category: 'beverages', defaultUnit: 'l' },
  { name: 'Sprite', nameEn: 'Sprite', category: 'beverages', defaultUnit: 'l' },
  { name: 'Pepsi', nameEn: 'Pepsi', category: 'beverages', defaultUnit: 'l' },

  // Alkohol
  { name: 'Piwo', nameEn: 'Beer', category: 'alcohol', defaultUnit: 'l' },
  { name: 'Wino', nameEn: 'Wine', category: 'alcohol', defaultUnit: 'l' },
  { name: 'Wódka', nameEn: 'Vodka', category: 'alcohol', defaultUnit: 'l' },

  // Przyprawy
  { name: 'Sól', nameEn: 'Salt', category: 'spices', defaultUnit: 'kg' },
  { name: 'Pieprz', nameEn: 'Pepper', category: 'spices', defaultUnit: 'kg' },
  { name: 'Papryka słodka', nameEn: 'Sweet Paprika', category: 'spices', defaultUnit: 'szt' },
  { name: 'Oregano', nameEn: 'Oregano', category: 'spices', defaultUnit: 'szt' },
  { name: 'Bazylia', nameEn: 'Basil', category: 'spices', defaultUnit: 'szt' },
  { name: 'Cynamon', nameEn: 'Cinnamon', category: 'spices', defaultUnit: 'szt' },

  // Oleje
  { name: 'Olej słonecznikowy', nameEn: 'Sunflower Oil', category: 'oils', defaultUnit: 'l' },
  { name: 'Oliwa z oliwek', nameEn: 'Olive Oil', category: 'oils', defaultUnit: 'l' },
  { name: 'Olej rzepakowy', nameEn: 'Rapeseed Oil', category: 'oils', defaultUnit: 'l' },

  // Sosy
  { name: 'Ketchup', nameEn: 'Ketchup', category: 'sauces', defaultUnit: 'szt' },
  { name: 'Musztarda', nameEn: 'Mustard', category: 'sauces', defaultUnit: 'szt' },
  { name: 'Majonez', nameEn: 'Mayonnaise', category: 'sauces', defaultUnit: 'szt' },
  { name: 'Sos sojowy', nameEn: 'Soy Sauce', category: 'sauces', defaultUnit: 'szt' },

  // Produkty do pieczenia
  { name: 'Proszek do pieczenia', nameEn: 'Baking Powder', category: 'baking', defaultUnit: 'szt' },
  { name: 'Drożdże', nameEn: 'Yeast', category: 'baking', defaultUnit: 'szt' },
  { name: 'Cukier waniliowy', nameEn: 'Vanilla Sugar', category: 'baking', defaultUnit: 'szt' },
  { name: 'Kakao', nameEn: 'Cocoa', category: 'baking', defaultUnit: 'kg' },

  // Produkty dla dzieci
  { name: 'Mleko modyfikowane', nameEn: 'Baby Formula', category: 'baby', defaultUnit: 'szt' },
  { name: 'Pieluchy', nameEn: 'Diapers', category: 'baby', defaultUnit: 'szt' },
  { name: 'Chusteczki nawilżane', nameEn: 'Wet Wipes', category: 'baby', defaultUnit: 'szt' },

  // Karma dla zwierząt
  { name: 'Karma dla psa', nameEn: 'Dog Food', category: 'pet', defaultUnit: 'kg' },
  { name: 'Karma dla kota', nameEn: 'Cat Food', category: 'pet', defaultUnit: 'kg' },
  { name: 'Żwirek dla kota', nameEn: 'Cat Litter', category: 'pet', defaultUnit: 'kg' },

  // Środki czystości
  { name: 'Płyn do mycia naczyń', nameEn: 'Dish Soap', category: 'cleaning', defaultUnit: 'szt' },
  { name: 'Proszek do prania', nameEn: 'Laundry Detergent', category: 'cleaning', defaultUnit: 'kg' },
  { name: 'Płyn do podłóg', nameEn: 'Floor Cleaner', category: 'cleaning', defaultUnit: 'szt' },
  { name: 'Papier toaletowy', nameEn: 'Toilet Paper', category: 'cleaning', defaultUnit: 'szt' },
  { name: 'Ręczniki papierowe', nameEn: 'Paper Towels', category: 'cleaning', defaultUnit: 'szt' },
  { name: 'Worki na śmieci', nameEn: 'Trash Bags', category: 'cleaning', defaultUnit: 'szt' },

  // Higiena
  { name: 'Pasta do zębów', nameEn: 'Toothpaste', category: 'hygiene', defaultUnit: 'szt' },
  { name: 'Szczoteczka do zębów', nameEn: 'Toothbrush', category: 'hygiene', defaultUnit: 'szt' },
  { name: 'Szampon', nameEn: 'Shampoo', category: 'hygiene', defaultUnit: 'szt' },
  { name: 'Mydło', nameEn: 'Soap', category: 'hygiene', defaultUnit: 'szt' },
  { name: 'Dezodorant', nameEn: 'Deodorant', category: 'hygiene', defaultUnit: 'szt' },
  { name: 'Żel pod prysznic', nameEn: 'Shower Gel', category: 'hygiene', defaultUnit: 'szt' },

  // Kosmetyki
  { name: 'Krem do rąk', nameEn: 'Hand Cream', category: 'cosmetics', defaultUnit: 'szt' },
  { name: 'Krem do twarzy', nameEn: 'Face Cream', category: 'cosmetics', defaultUnit: 'szt' },
  { name: 'Balsam do ciała', nameEn: 'Body Lotion', category: 'cosmetics', defaultUnit: 'szt' },

  // Zdrowie
  { name: 'Witaminy', nameEn: 'Vitamins', category: 'health', defaultUnit: 'szt' },
  { name: 'Plastry', nameEn: 'Band-Aids', category: 'health', defaultUnit: 'szt' },
  { name: 'Leki przeciwbólowe', nameEn: 'Pain Relievers', category: 'health', defaultUnit: 'szt' },

  // Artykuły gospodarstwa domowego
  { name: 'Baterie', nameEn: 'Batteries', category: 'household', defaultUnit: 'szt' },
  { name: 'Żarówki', nameEn: 'Light Bulbs', category: 'household', defaultUnit: 'szt' },
  { name: 'Zapałki', nameEn: 'Matches', category: 'household', defaultUnit: 'szt' },
]
