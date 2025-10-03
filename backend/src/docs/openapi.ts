export function buildOpenApi() {
  const doc = {
    openapi: "3.0.0",
    info: { title: "API пользователей", version: "1.0.0" },
    paths: {},
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            phone: { type: "string", nullable: true },
            title: { type: "string", nullable: true },
            isActive: { type: "boolean" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
        UserCreate: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            phone: { type: "string", nullable: true },
            title: { type: "string", nullable: true },
            isActive: { type: "boolean" },
          },
          required: ["firstName", "lastName", "email"],
        },
        UserPatch: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            phone: { type: "string", nullable: true },
            title: { type: "string", nullable: true },
            isActive: { type: "boolean" },
          },
        },
      },
    },
  };

  doc.paths = {
    "/api/users": {
      get: {
        summary: "Список пользователей",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "perPage", in: "query", schema: { type: "integer" } },
          { name: "q", in: "query", schema: { type: "string" } },
          {
            name: "sort",
            in: "query",
            schema: { type: "string", example: "createdAt:desc" },
          },
          { name: "groupId", in: "query", schema: { type: "integer" } },
          {
            name: "ungroupedOnly",
            in: "query",
            schema: { type: "string", enum: ["true", "false"] },
          },
        ],
      },
      post: {
        summary: "Создать пользователя",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserCreate" },
            },
          },
        },
      },
    },
    "/api/users/{id}": {
      get: {
        summary: "Получить пользователя",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
      },
      patch: { summary: "Изменить пользователя" },
      delete: { summary: "Удалить пользователя" },
    },
    "/api/groups": {
      get: { summary: "Список групп" },
    },
  };

  return doc;
}
