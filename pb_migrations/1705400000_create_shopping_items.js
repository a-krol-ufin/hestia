migrate((app) => {
  const collection = new Collection({
    name: "shopping_items",
    type: "base",
    listRule: '@request.auth.id != "" && user = @request.auth.id',
    viewRule: '@request.auth.id != "" && user = @request.auth.id',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != "" && user = @request.auth.id',
    deleteRule: '@request.auth.id != "" && user = @request.auth.id',
    fields: [
      {
        name: "name",
        type: "text",
        required: true,
        presentable: true,
        max: 500,
      },
      {
        name: "quantity",
        type: "number",
        required: true,
      },
      {
        name: "unit",
        type: "text",
        required: false,
        max: 50,
      },
      {
        name: "checked",
        type: "bool",
        required: true,
      },
      {
        name: "user",
        type: "relation",
        required: true,
        maxSelect: 1,
        collectionId: "_pb_users_auth_",
        cascadeDelete: true,
      },
    ],
  })

  app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("shopping_items")
  app.delete(collection)
})
