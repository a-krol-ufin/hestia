migrate((app) => {
  const collection = new Collection({
    id:       "pbc_shopping_items", // Opcjonalne, ale dobre dla spójności
    name:     "shopping_items",
    type:     "base",
    system:   false,
    // ZMIANA KLUCZOWA: "fields" zamiast "schema"
    fields: [
      {
        name:     "name",
        type:     "text",
        required: true,
        presentable: true,
        options: {
          min: 1,
          max: 500,
        },
      },
      {
        name:     "quantity",
        type:     "number",
        required: false,
        options: {
          noDecimal: false,
        },
      },
      {
        name:     "unit",
        type:     "text",
        required: false,
        options: {
          max: 50,
        },
      },
      {
        name:     "checked",
        type:     "bool",
        required: false,
      },
      {
        name:     "user",
        type:     "relation",
        required: true,
        options: {
          collectionId: "_pb_users_auth_",
          cascadeDelete: true,
          maxSelect: 1,
          displayFields: ["email"],
        },
      },
    ],
    // Teraz reguły zadziałają, bo 'fields' są poprawnie zdefiniowane
    listRule:   '@request.auth.id != "" && user = @request.auth.id',
    viewRule:   '@request.auth.id != "" && user = @request.auth.id',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != "" && user = @request.auth.id',
    deleteRule: '@request.auth.id != "" && user = @request.auth.id',
  });

  return app.save(collection);

}, (app) => {
  const collection = app.findCollectionByNameOrId("shopping_items");
  return app.delete(collection);
});