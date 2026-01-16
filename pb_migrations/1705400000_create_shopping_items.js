migrate((db) => {
  const collection = new Collection({
    id: "pbc_shopping_items",
    name: "shopping_items",
    type: "base",
    system: false,
    schema: [
      {
        system: false,
        id: "field_name",
        name: "name",
        type: "text",
        required: true,
        presentable: true,
        options: {
          min: 1,
          max: 500,
          pattern: "",
        },
      },
      {
        system: false,
        id: "field_quantity",
        name: "quantity",
        type: "number",
        required: false,
        options: {
          min: 1,
          max: null,
          noDecimal: false,
        },
      },
      {
        system: false,
        id: "field_unit",
        name: "unit",
        type: "text",
        required: false,
        options: {
          min: null,
          max: 50,
          pattern: "",
        },
      },
      {
        system: false,
        id: "field_checked",
        name: "checked",
        type: "bool",
        required: false,
        options: {},
      },
      {
        system: false,
        id: "field_user",
        name: "user",
        type: "relation",
        required: true,
        options: {
          collectionId: "_pb_users_auth_",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["email"],
        },
      },
    ],
    indexes: [],
    listRule: '@request.auth.id != "" && user = @request.auth.id',
    viewRule: '@request.auth.id != "" && user = @request.auth.id',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != "" && user = @request.auth.id',
    deleteRule: '@request.auth.id != "" && user = @request.auth.id',
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("pbc_shopping_items");
  return dao.deleteCollection(collection);
});
