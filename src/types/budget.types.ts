// Budget Categories
export type BudgetCategory =
  | 'food'
  | 'bills'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'clothing'
  | 'education'
  | 'other'

export type EntryType = 'income' | 'expense'

// Household
export interface Household {
  id: string
  name: string
  owner: string
  members: string[]
  created: string
  updated: string
}

export interface CreateHousehold {
  name: string
  members?: string[]
}

export interface UpdateHousehold {
  name?: string
  members?: string[]
}

// Budget Entry
export interface BudgetEntry {
  id: string
  household: string
  category: BudgetCategory
  amount: number
  type: EntryType
  description?: string
  date: string
  created_by: string
  created: string
  updated: string
}

export interface CreateBudgetEntry {
  category: BudgetCategory
  amount: number
  type: EntryType
  description?: string
  date: string
}

export interface UpdateBudgetEntry {
  category?: BudgetCategory
  amount?: number
  type?: EntryType
  description?: string
  date?: string
}

// Budget Plan
export interface BudgetPlan {
  id: string
  household: string
  category: BudgetCategory
  amount: number
  month: string // Format: YYYY-MM
  recurrent: boolean
  created_by: string
  created: string
  updated: string
}

export interface CreateBudgetPlan {
  category: BudgetCategory
  amount: number
  month: string
  recurrent: boolean
}

export interface UpdateBudgetPlan {
  category?: BudgetCategory
  amount?: number
  month?: string
  recurrent?: boolean
}

// Category metadata
export interface CategoryMetadata {
  key: BudgetCategory
  icon: string
  color: string
}

// Summary data
export interface MonthlySummary {
  month: string
  totalIncome: number
  totalExpenses: number
  balance: number
  expensesByCategory: Record<BudgetCategory, number>
}
