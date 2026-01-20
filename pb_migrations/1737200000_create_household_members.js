migrate((app) => {
  const households = app.findCollectionByNameOrId("households")

  const householdMembers = new Collection({
    name: "household_members",
    type: "base",
    listRule: '@request.auth.id != "" && (household.owner = @request.auth.id || user = @request.auth.id)',
    viewRule: '@request.auth.id != "" && (household.owner = @request.auth.id || user = @request.auth.id)',
    createRule: null, // Only created through system/hooks
    updateRule: '@request.auth.id != "" && household.owner = @request.auth.id',
    deleteRule: '@request.auth.id != "" && household.owner = @request.auth.id',
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
        name: "user",
        type: "relation",
        required: true,
        maxSelect: 1,
        collectionId: "_pb_users_auth_",
        cascadeDelete: true,
      },
      {
        name: "role",
        type: "select",
        required: true,
        values: ["admin", "manager", "member"],
      },
      {
        name: "joined_at",
        type: "date",
        required: true,
      },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_household_user ON household_members(household, user)",
    ],
  })

  app.save(householdMembers)
}, (app) => {
  const householdMembers = app.findCollectionByNameOrId("household_members")
  app.delete(householdMembers)
})
