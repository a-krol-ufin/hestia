export type ShoppingCategory =
  | 'fruits'
  | 'vegetables'
  | 'meat'
  | 'fish'
  | 'dairy'
  | 'bread'
  | 'grains'
  | 'pasta'
  | 'canned'
  | 'frozen'
  | 'snacks'
  | 'sweets'
  | 'beverages'
  | 'alcohol'
  | 'spices'
  | 'oils'
  | 'sauces'
  | 'baking'
  | 'baby'
  | 'pet'
  | 'cleaning'
  | 'hygiene'
  | 'cosmetics'
  | 'health'
  | 'household'
  | 'other'

export type ShoppingUnit = 'kg' | 'g' | 'l' | 'ml' | 'szt' | 'op'

export interface PredefinedProduct {
  name: string
  nameEn: string
  category: ShoppingCategory
  defaultUnit?: ShoppingUnit
  icon: string
}

export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unit?: ShoppingUnit
  category?: ShoppingCategory
  checked: boolean
  user: string
  created: string
  updated: string
}

export interface CreateShoppingItem {
  name: string
  quantity: number
  unit?: ShoppingUnit
  category?: ShoppingCategory
}

export interface UpdateShoppingItem {
  name?: string
  quantity?: number
  unit?: ShoppingUnit
  category?: ShoppingCategory
  checked?: boolean
}
