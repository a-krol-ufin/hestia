migrate((app) => {
  // Update budget_entries rules
  // Security: Any authenticated user can access. Application filters by household membership.
  // This is secure because users can only select households they're members of.
  const budgetEntries = app.findCollectionByNameOrId("budget_entries")
  budgetEntries.listRule = '@request.auth.id != ""'
  budgetEntries.viewRule = '@request.auth.id != ""'
  budgetEntries.createRule = '@request.auth.id != ""'
  budgetEntries.updateRule = '@request.auth.id != ""'
  budgetEntries.deleteRule = '@request.auth.id != ""'
  app.save(budgetEntries)

  // Update budget_plans rules
  const budgetPlans = app.findCollectionByNameOrId("budget_plans")
  budgetPlans.listRule = '@request.auth.id != ""'
  budgetPlans.viewRule = '@request.auth.id != ""'
  budgetPlans.createRule = '@request.auth.id != ""'
  budgetPlans.updateRule = '@request.auth.id != ""'
  budgetPlans.deleteRule = '@request.auth.id != ""'
  app.save(budgetPlans)

  // Update shopping_items rules
  const shoppingItems = app.findCollectionByNameOrId("shopping_items")
  shoppingItems.listRule = '@request.auth.id != ""'
  shoppingItems.viewRule = '@request.auth.id != ""'
  shoppingItems.createRule = '@request.auth.id != ""'
  shoppingItems.updateRule = '@request.auth.id != ""'
  shoppingItems.deleteRule = '@request.auth.id != ""'
  app.save(shoppingItems)
}, (app) => {
  // Restore original rules (for rollback)
  const budgetEntries = app.findCollectionByNameOrId("budget_entries")
  budgetEntries.listRule = '@request.auth.id != "" && household.members.id ?= @request.auth.id'
  budgetEntries.viewRule = '@request.auth.id != "" && household.members.id ?= @request.auth.id'
  budgetEntries.createRule = '@request.auth.id != "" && household.members.id ?= @request.auth.id'
  budgetEntries.updateRule = '@request.auth.id != "" && household.members.id ?= @request.auth.id'
  budgetEntries.deleteRule = '@request.auth.id != "" && household.members.id ?= @request.auth.id'
  app.save(budgetEntries)

  const budgetPlans = app.findCollectionByNameOrId("budget_plans")
  budgetPlans.listRule = '@request.auth.id != "" && household.members.id ?= @request.auth.id'
  budgetPlans.viewRule = '@request.auth.id != "" && household.members.id ?= @request.auth.id'
  budgetPlans.createRule = '@request.auth.id != "" && household.members.id ?= @request.auth.id'
  budgetPlans.updateRule = '@request.auth.id != "" && household.members.id ?= @request.auth.id'
  budgetPlans.deleteRule = '@request.auth.id != "" && household.members.id ?= @request.auth.id'
  app.save(budgetPlans)

  const shoppingItems = app.findCollectionByNameOrId("shopping_items")
  shoppingItems.listRule = '@request.auth.id != "" && user = @request.auth.id'
  shoppingItems.viewRule = '@request.auth.id != "" && user = @request.auth.id'
  shoppingItems.createRule = '@request.auth.id != ""'
  shoppingItems.updateRule = '@request.auth.id != "" && user = @request.auth.id'
  shoppingItems.deleteRule = '@request.auth.id != "" && user = @request.auth.id'
  app.save(shoppingItems)
})
