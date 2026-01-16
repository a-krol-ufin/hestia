export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unit?: string
  checked: boolean
  user: string
  created: string
  updated: string
}

export interface CreateShoppingItem {
  name: string
  quantity: number
  unit?: string
}

export interface UpdateShoppingItem {
  name?: string
  quantity?: number
  unit?: string
  checked?: boolean
}
