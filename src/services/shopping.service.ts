import pb, { isAuthError, handle401Error } from './pocketbase'
import type { ShoppingItem, CreateShoppingItem, UpdateShoppingItem } from '@/types/shopping.types'

class ShoppingService {
  private collection = 'shopping_items'

  async getItems(householdId: string): Promise<ShoppingItem[]> {
    try {
      const records = await pb.collection(this.collection).getFullList<ShoppingItem>({
        filter: `household = "${householdId}"`,
      })
      return records
    } catch (error: unknown) {
      if (isAuthError(error)) {
        handle401Error()
        return []
      }
      // Silently ignore if collection doesn't exist or has issues
      if (error && typeof error === 'object' && 'status' in error && error.status === 400) {
        return []
      }
      console.error('Failed to fetch shopping items:', error)
      return []
    }
  }

  async addItem(householdId: string, item: CreateShoppingItem): Promise<ShoppingItem | null> {
    try {
      const record = await pb.collection(this.collection).create<ShoppingItem>({
        ...item,
        checked: false,
        household: householdId,
        added_by: pb.authStore.record?.id,
      })
      return record
    } catch (error) {
      console.error('Failed to add shopping item:', error)
      return null
    }
  }

  async updateItem(id: string, data: UpdateShoppingItem): Promise<ShoppingItem | null> {
    try {
      const record = await pb.collection(this.collection).update<ShoppingItem>(id, data)
      return record
    } catch (error) {
      console.error('Failed to update shopping item:', error)
      return null
    }
  }

  async deleteItem(id: string): Promise<boolean> {
    try {
      await pb.collection(this.collection).delete(id)
      return true
    } catch (error) {
      console.error('Failed to delete shopping item:', error)
      return false
    }
  }

  async toggleChecked(id: string, currentState: boolean): Promise<ShoppingItem | null> {
    return this.updateItem(id, { checked: !currentState })
  }
}

export const shoppingService = new ShoppingService()
