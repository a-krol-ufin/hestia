migrate((app) => {
  const households = app.findCollectionByNameOrId("households")

  // Remove the members field (migrated to household_members)
  households.fields.removeByName("members")

  // Update access rules to use household_members
  households.listRule = '@request.auth.id != "" && (owner = @request.auth.id || @collection.household_members.household = id && @collection.household_members.user = @request.auth.id)'
  households.viewRule = '@request.auth.id != "" && (owner = @request.auth.id || @collection.household_members.household = id && @collection.household_members.user = @request.auth.id)'

  app.save(households)
}, (app) => {
  const households = app.findCollectionByNameOrId("households")

  // Restore members field
  households.fields.add(new Field({
    name: "members",
    type: "relation",
    required: false,
    maxSelect: null,
    collectionId: "_pb_users_auth_",
    cascadeDelete: false,
  }))

  // Restore original access rules
  households.listRule = '@request.auth.id != "" && (owner = @request.auth.id || members.id ?= @request.auth.id)'
  households.viewRule = '@request.auth.id != "" && (owner = @request.auth.id || members.id ?= @request.auth.id)'

  app.save(households)
})
