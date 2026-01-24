// Expense Categories
export type ExpenseCategory =
  | 'food'
  | 'bills'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'clothing'
  | 'education'
  | 'other'

// Income Categories
export type IncomeCategory =
  | 'salary'
  | 'freelance'
  | 'bonus'
  | 'investment'
  | 'other'

// Union of all categories
export type BudgetCategory = ExpenseCategory | IncomeCategory

export type EntryType = 'income' | 'expense'

// Household
export interface Household {
  id: string
  name: string
  owner: string
  created: string
  updated: string
}

export interface CreateHousehold {
  name: string
}

export interface UpdateHousehold {
  name?: string
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

// Budget Plan (only for expenses)
export interface BudgetPlan {
  id: string
  household: string
  category: ExpenseCategory
  amount: number
  month: string // Format: YYYY-MM
  recurrent: boolean
  created_by: string
  created: string
  updated: string
}

export interface CreateBudgetPlan {
  category: ExpenseCategory
  amount: number
  month: string
  recurrent: boolean
}

export interface UpdateBudgetPlan {
  category?: ExpenseCategory
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
  totalPlanned: number
  balance: number
  availableBalance: number
  expensesByCategory: Record<ExpenseCategory, number>
}

// Category progress
export interface CategoryProgress {
  category: ExpenseCategory
  planned: number
  spent: number
  remaining: number
  percentage: number
}
