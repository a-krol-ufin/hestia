migrate((app) => {
  const invitations = app.findCollectionByNameOrId("invitations")

  const notifications = new Collection({
    name: "notifications",
    type: "base",
    listRule: '@request.auth.id != "" && user = @request.auth.id',
    viewRule: '@request.auth.id != "" && user = @request.auth.id',
    createRule: null, // Only created through system/hooks
    updateRule: '@request.auth.id != "" && user = @request.auth.id',
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
      "CREATE INDEX idx_notifications_user ON notifications(user)",
      "CREATE INDEX idx_notifications_read ON notifications(read)",
    ],
  })

  app.save(notifications)
}, (app) => {
  const notifications = app.findCollectionByNameOrId("notifications")
  app.delete(notifications)
})
