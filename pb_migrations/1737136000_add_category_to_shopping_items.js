migrate((app) => {
  const collection = app.findCollectionByNameOrId("shopping_items")

  // Add category field
  collection.fields.addAt(3, new Field({
    name: "category",
    type: "select",
    required: false,
    presentable: false,
    values: [
      "fruits",
      "vegetables",
      "meat",
      "fish",
      "dairy",
      "bread",
      "grains",
      "pasta",
      "canned",
      "frozen",
      "snacks",
      "sweets",
      "beverages",
      "alcohol",
      "spices",
      "oils",
      "sauces",
      "baking",
      "baby",
      "pet",
      "cleaning",
      "hygiene",
      "cosmetics",
      "health",
      "household",
      "other"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("shopping_items")

  // Remove category field
  collection.fields.removeById(collection.fields.findByName("category").id)

  return app.save(collection)
})
