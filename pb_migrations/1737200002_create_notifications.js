migrate((app) => {
  const invitations = app.findCollectionByNameOrId("household_invitations")

  const notifications = new Collection({
    name: "household_notifications",
    type: "base",
    // Users can only see their own notifications
    listRule: '@request.auth.id != "" && user = @request.auth.id',
    viewRule: '@request.auth.id != "" && user = @request.auth.id',
    // Allow authenticated users to create notifications (for other users)
    createRule: '@request.auth.id != ""',
    // Users can mark their own notifications as read
    updateRule: '@request.auth.id != "" && user = @request.auth.id',
    // Users can delete their own notifications
    deleteRule: '@request.auth.id != "" && user = @request.auth.id',
    fields: [
      {
        name: "user",
        type: "relation",
        required: true,
        maxSelect: 1,
        collectionId: "_pb_users_auth_",
        cascadeDelete: true,
      },
      {
        name: "type",
        type: "select",
        required: true,
        values: ["invitation", "role_changed", "removed", "invitation_accepted"],
      },
      {
        name: "title",
        type: "text",
        required: true,
        max: 200,
      },
      {
        name: "message",
        type: "text",
        required: true,
        max: 500,
      },
      {
        name: "read",
        type: "bool",
        required: true,
      },
      {
        name: "data",
        type: "json",
        required: false,
      },
      {
        name: "related_invitation",
        type: "relation",
        required: false,
        maxSelect: 1,
        collectionId: invitations.id,
        cascadeDelete: false,
      },
    ],
    indexes: [
      "CREATE INDEX idx_household_notifications_user ON household_notifications(user)",
      "CREATE INDEX idx_household_notifications_read ON household_notifications(read)",
    ],
  })

  app.save(notifications)
}, (app) => {
  const notifications = app.findCollectionByNameOrId("household_notifications")
  app.delete(notifications)
})
