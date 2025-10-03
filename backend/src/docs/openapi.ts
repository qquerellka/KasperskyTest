import { OpenAPIRegistry, OpenApiGeneratorV3 } from "zod-to-openapi";
import { registry as userRegistry, UserDto, UserCreateDto, UserPatchDto } from "../modules/users/users.dto.js";

export function buildOpenApi() {
  const registry = new OpenAPIRegistry();
  for (const compName of userRegistry.definitions.keys()) {
    const comp = userRegistry.definitions.get(compName);
    if (comp) registry.registerComponent("schema", compName, comp.schema);
  }

  const generator = new OpenApiGeneratorV3(registry.definitions);
  const doc = generator.generateDocument({
    openapi: "3.0.0",
    info: { title: "API пользователей", version: "1.0.0" },
    paths: {},
  });

  doc.paths = {
    "/api/users": {
      get: {
        summary: "Список пользователей",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "perPage", in: "query", schema: { type: "integer" } },
          { name: "q", in: "query", schema: { type: "string" } },
          { name: "sort", in: "query", schema: { type: "string", example: "createdAt:desc" } },
          { name: "groupId", in: "query", schema: { type: "integer" } },
          { name: "ungroupedOnly", in: "query", schema: { type: "string", enum: ["true","false"] } }
        ]
      },
      post: {
        summary: "Создать пользователя",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/UserCreate" } } } }
      }
    },
    "/api/users/{id}": {
      get: { summary: "Получить пользователя", parameters: [{ name:"id", in:"path", required:true, schema:{ type:"integer" } }]},
      patch: { summary: "Изменить пользователя" },
      delete: { summary: "Удалить пользователя" }
    },
    "/api/groups": {
      get: { summary: "Список групп" }
    }
  };

  doc.components = doc.components || { schemas: {} };
  doc.components.schemas = doc.components.schemas || {};
  doc.components.schemas["User"] = (UserDto as any).openapi ? (UserDto as any).openapi() : { type: "object" };
  doc.components.schemas["UserCreate"] = (UserCreateDto as any).openapi ? (UserCreateDto as any).openapi() : { type: "object" };
  doc.components.schemas["UserPatch"] = (UserPatchDto as any).openapi ? (UserPatchDto as any).openapi() : { type: "object" };
  return doc;
}
