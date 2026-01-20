migrate((app) => {
  const shoppingItems = app.findCollectionByNameOrId("shopping_items")
  const households = app.findCollectionByNameOrId("households")

  // Add household field using Field constructor
  shoppingItems.fields.add(new Field({
    name: "household",
    type: "relation",
    required: false,
    maxSelect: 1,
    collectionId: households.id,
    cascadeDelete: true,
  }))

  // Add added_by field
  shoppingItems.fields.add(new Field({
    name: "added_by",
    type: "relation",
    required: false,
    maxSelect: 1,
    collectionId: "_pb_users_auth_",
    cascadeDelete: false,
  }))

  app.save(shoppingItems)
}, (app) => {
  const shoppingItems = app.findCollectionByNameOrId("shopping_items")

  // Remove the added fields
  shoppingItems.fields.removeByName("household")
  shoppingItems.fields.removeByName("added_by")

  app.save(shoppingItems)
})
