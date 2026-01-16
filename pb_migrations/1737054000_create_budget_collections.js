migrate((app) => {
  // Create households collection first
  const households = new Collection({
    name: "households",
    type: "base",
    listRule: '@request.auth.id != "" && (owner = @request.auth.id || members.id ?= @request.auth.id)',
    viewRule: '@request.auth.id != "" && (owner = @request.auth.id || members.id ?= @request.auth.id)',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != "" && owner = @request.auth.id',
    deleteRule: '@request.auth.id != "" && owner = @request.auth.id',
    fields: [
      {
        name: "name",
        type: "text",
        required: true,
        presentable: true,
        max: 200,
      },
      {
        name: "owner",
        type: "relation",
        required: true,
        maxSelect: 1,
        collectionId: "_pb_users_auth_",
        cascadeDelete: true,
      },
      {
        name: "members",
        type: "relation",
        required: false,
        maxSelect: null,
        collectionId: "_pb_users_auth_",
        cascadeDelete: false,
      },
    ],
  })

  app.save(households)

  // Create budget_entries collection
  const budgetEntries = new Collection({
    name: "budget_entries",
    type: "base",
    listRule: '@request.auth.id != "" && household.members.id ?= @request.auth.id',
    viewRule: '@request.auth.id != "" && household.members.id ?= @request.auth.id',
    createRule: '@request.auth.id != "" && household.members.id ?= @request.auth.id',
    updateRule: '@request.auth.id != "" && household.members.id ?= @request.auth.id',
    deleteRule: '@request.auth.id != "" && household.members.id ?= @request.auth.id',
    fields: [
      {
        name: "household",
        type: "relation",
        required: true,
        maxSelect: 1,
        collectionId: households.id,
        cascadeDelete: true,
      },
      {
        name: "category",
        type: "text",
        required: true,
        max: 100,
      },
      {
        name: "amount",
        type: "number",
        required: true,
      },
      {
        name: "type",
        type: "select",
        required: true,
        values: ["income", "expense"],
      },
      {
        name: "description",
        type: "text",
        required: false,
        max: 500,
      },
      {
        name: "date",
        type: "date",
        required: true,
      },
      {
        name: "created_by",
        type: "relation",
        required: true,
        maxSelect: 1,
        collectionId: "_pb_users_auth_",
        cascadeDelete: false,
      },
    ],
  })

  app.save(budgetEntries)

  // Create budget_plans collection
  const budgetPlans = new Collection({
    name: "budget_plans",
    type: "base",
    listRule: '@request.auth.id != "" && household.members.id ?= @request.auth.id',
    viewRule: '@request.auth.id != "" && household.members.id ?= @request.auth.id',
    createRule: '@request.auth.id != "" && household.members.id ?= @request.auth.id',
    updateRule: '@request.auth.id != "" && household.members.id ?= @request.auth.id',
    deleteRule: '@request.auth.id != "" && household.members.id ?= @request.auth.id',
    fields: [
      {
        name: "household",
        type: "relation",
        required: true,
        maxSelect: 1,
        collectionId: households.id,
        cascadeDelete: true,
      },
      {
        name: "category",
        type: "text",
        required: true,
        max: 100,
      },
      {
        name: "amount",
        type: "number",
        required: true,
      },
      {
        name: "month",
        type: "text",
        required: true,
        max: 7,
      },
      {
        name: "recurrent",
        type: "bool",
        required: true,
      },
      {
        name: "created_by",
        type: "relation",
        required: true,
        maxSelect: 1,
        collectionId: "_pb_users_auth_",
        cascadeDelete: false,
      },
    ],
  })

  app.save(budgetPlans)
}, (app) => {
  const budgetPlans = app.findCollectionByNameOrId("budget_plans")
  const budgetEntries = app.findCollectionByNameOrId("budget_entries")
  const households = app.findCollectionByNameOrId("households")

  app.delete(budgetPlans)
  app.delete(budgetEntries)
  app.delete(households)
})
