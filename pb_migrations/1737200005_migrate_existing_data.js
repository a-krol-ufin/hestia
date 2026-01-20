migrate((app) => {
  const households = app.findCollectionByNameOrId("households")
  const householdMembers = app.findCollectionByNameOrId("household_members")
  const shoppingItems = app.findCollectionByNameOrId("shopping_items")

  // 1. Migrate household owners and members to household_members table
  const allHouseholds = app.findRecordsByFilter(
    "households",
    "id != ''",
    "",
    0,
    0
  )

  const now = new Date().toISOString()

  for (const household of allHouseholds) {
    // Create household_member for owner (admin role)
    const ownerMember = new Record(householdMembers)
    ownerMember.set("household", household.id)
    ownerMember.set("user", household.get("owner"))
    ownerMember.set("role", "admin")
    ownerMember.set("joined_at", now)
    app.save(ownerMember)

    // Create household_members for existing members (member role)
    const members = household.get("members") || []
    for (const memberId of members) {
      // Skip if member is the owner (already added as admin)
      if (memberId === household.get("owner")) continue

      const memberRecord = new Record(householdMembers)
      memberRecord.set("household", household.id)
      memberRecord.set("user", memberId)
      memberRecord.set("role", "member")
      memberRecord.set("joined_at", now)
      app.save(memberRecord)
    }
  }

  // 2. Migrate shopping_items - assign to user's first household or create one
  const allItems = app.findRecordsByFilter(
    "shopping_items",
    "id != ''",
    "",
    0,
    0
  )

  // Create a map of user -> first household
  const userHouseholdMap = new Map()

  for (const household of allHouseholds) {
    const owner = household.get("owner")
    if (!userHouseholdMap.has(owner)) {
      userHouseholdMap.set(owner, household.id)
    }
    const members = household.get("members") || []
    for (const memberId of members) {
      if (!userHouseholdMap.has(memberId)) {
        userHouseholdMap.set(memberId, household.id)
      }
    }
  }

  for (const item of allItems) {
    const userId = item.get("user")
    let householdId = userHouseholdMap.get(userId)

    // If user has no household, create a default one
    if (!householdId) {
      const newHousehold = new Record(households)
      newHousehold.set("name", "My Household")
      newHousehold.set("owner", userId)
      app.save(newHousehold)

      // Add owner as admin member
      const ownerMember = new Record(householdMembers)
      ownerMember.set("household", newHousehold.id)
      ownerMember.set("user", userId)
      ownerMember.set("role", "admin")
      ownerMember.set("joined_at", now)
      app.save(ownerMember)

      householdId = newHousehold.id
      userHouseholdMap.set(userId, householdId)
    }

    // Update shopping item with household and added_by
    item.set("household", householdId)
    item.set("added_by", userId)
    app.save(item)
  }

  // 3. Update shopping_items access rules to use household_members
  shoppingItems.listRule = '@request.auth.id != "" && @collection.household_members.household = household && @collection.household_members.user = @request.auth.id'
  shoppingItems.viewRule = '@request.auth.id != "" && @collection.household_members.household = household && @collection.household_members.user = @request.auth.id'
  shoppingItems.createRule = '@request.auth.id != "" && @collection.household_members.household = household && @collection.household_members.user = @request.auth.id'
  shoppingItems.updateRule = '@request.auth.id != "" && @collection.household_members.household = household && @collection.household_members.user = @request.auth.id'
  shoppingItems.deleteRule = '@request.auth.id != "" && @collection.household_members.household = household && @collection.household_members.user = @request.auth.id'

  // 4. Remove user field and make household required
  shoppingItems.fields.removeByName("user")

  // Update household field to be required
  const householdField = shoppingItems.fields.getByName("household")
  if (householdField) {
    householdField.required = true
  }

  app.save(shoppingItems)

  // 5. Update budget_entries and budget_plans access rules
  const budgetEntries = app.findCollectionByNameOrId("budget_entries")
  budgetEntries.listRule = '@request.auth.id != "" && @collection.household_members.household = household && @collection.household_members.user = @request.auth.id'
  budgetEntries.viewRule = '@request.auth.id != "" && @collection.household_members.household = household && @collection.household_members.user = @request.auth.id'
  budgetEntries.createRule = '@request.auth.id != "" && @collection.household_members.household = household && @collection.household_members.user = @request.auth.id'
  budgetEntries.updateRule = '@request.auth.id != "" && @collection.household_members.household = household && @collection.household_members.user = @request.auth.id'
  budgetEntries.deleteRule = '@request.auth.id != "" && @collection.household_members.household = household && @collection.household_members.user = @request.auth.id'
  app.save(budgetEntries)

  const budgetPlans = app.findCollectionByNameOrId("budget_plans")
  budgetPlans.listRule = '@request.auth.id != "" && @collection.household_members.household = household && @collection.household_members.user = @request.auth.id'
  budgetPlans.viewRule = '@request.auth.id != "" && @collection.household_members.household = household && @collection.household_members.user = @request.auth.id'
  budgetPlans.createRule = '@request.auth.id != "" && @collection.household_members.household = household && @collection.household_members.user = @request.auth.id'
  budgetPlans.updateRule = '@request.auth.id != "" && @collection.household_members.household = household && @collection.household_members.user = @request.auth.id'
  budgetPlans.deleteRule = '@request.auth.id != "" && @collection.household_members.household = household && @collection.household_members.user = @request.auth.id'
  app.save(budgetPlans)

}, (app) => {
  // Note: This rollback is complex - the data migration cannot be fully reversed
  // This will restore the schema but not the original data relationships

  const shoppingItems = app.findCollectionByNameOrId("shopping_items")

  // Restore user field
  shoppingItems.fields.add(new Field({
    name: "user",
    type: "relation",
    required: true,
    maxSelect: 1,
    collectionId: "_pb_users_auth_",
    cascadeDelete: true,
  }))

  // Restore original access rules
  shoppingItems.listRule = '@request.auth.id != "" && user = @request.auth.id'
  shoppingItems.viewRule = '@request.auth.id != "" && user = @request.auth.id'
  shoppingItems.createRule = '@request.auth.id != ""'
  shoppingItems.updateRule = '@request.auth.id != "" && user = @request.auth.id'
  shoppingItems.deleteRule = '@request.auth.id != "" && user = @request.auth.id'

  app.save(shoppingItems)

  // Restore budget collection rules
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
})
