migrate((app) => {
  const shoppingItems = app.findCollectionByNameOrId("shopping_items")
  const households = app.findCollectionByNameOrId("households")

  // Add household field
  shoppingItems.fields.push({
    name: "household",
    type: "relation",
    required: false, // Initially optional for migration
    maxSelect: 1,
    collectionId: households.id,
    cascadeDelete: true,
  })

  // Add added_by field
  shoppingItems.fields.push({
    name: "added_by",
    type: "relation",
    required: false,
    maxSelect: 1,
    collectionId: "_pb_users_auth_",
    cascadeDelete: false,
  })

  app.save(shoppingItems)
}, (app) => {
  const shoppingItems = app.findCollectionByNameOrId("shopping_items")

  // Remove the added fields
  shoppingItems.fields = shoppingItems.fields.filter(
    f => f.name !== "household" && f.name !== "added_by"
  )

  app.save(shoppingItems)
})
