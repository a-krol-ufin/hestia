migrate((app) => {
  const households = app.findCollectionByNameOrId("households")

  const invitations = new Collection({
    name: "household_invitations",
    type: "base",
    // Allow authenticated users to list/view (filtering done in app)
    listRule: '@request.auth.id != ""',
    viewRule: '@request.auth.id != ""',
    // Authenticated users can create invitations
    createRule: '@request.auth.id != ""',
    // Authenticated users can update (validation in app code)
    updateRule: '@request.auth.id != ""',
    // Authenticated users can delete (validation in app code)
    deleteRule: '@request.auth.id != ""',
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
        name: "inviter",
        type: "relation",
        required: true,
        maxSelect: 1,
        collectionId: "_pb_users_auth_",
        cascadeDelete: false,
      },
      {
        name: "invitee_email",
        type: "email",
        required: true,
      },
      {
        name: "invitee",
        type: "relation",
        required: false,
        maxSelect: 1,
        collectionId: "_pb_users_auth_",
        cascadeDelete: false,
      },
      {
        name: "role",
        type: "select",
        required: true,
        values: ["manager", "member"],
      },
      {
        name: "status",
        type: "select",
        required: true,
        values: ["pending", "accepted", "rejected", "cancelled"],
      },
      {
        name: "message",
        type: "text",
        required: false,
        max: 500,
      },
    ],
    indexes: [
      "CREATE INDEX idx_household_invitations_email ON household_invitations(invitee_email)",
      "CREATE INDEX idx_household_invitations_status ON household_invitations(status)",
    ],
  })

  app.save(invitations)
}, (app) => {
  const invitations = app.findCollectionByNameOrId("household_invitations")
  app.delete(invitations)
})
