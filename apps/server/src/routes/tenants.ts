import { Hono } from "hono";
import { cors } from "hono/cors";
import { TenantController } from "../controllers/TenantController";
import { Config } from "../config";

const tenants = new Hono();

// Middleware CORS
tenants.use(
  "*",
  cors({
    origin: Config.getCorsOrigins(),
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rotas básicas CRUD
tenants.get("/", TenantController.getAllTenants);
tenants.get("/:id", TenantController.getTenantById);
tenants.get("/slug/:slug", TenantController.getTenantBySlug);
tenants.post("/", TenantController.createTenant);
tenants.put("/:id", TenantController.updateTenant);
tenants.delete("/:id", TenantController.deleteTenant);

// Rotas de roles
tenants.get("/:id/roles", TenantController.getTenantRoles);
tenants.post("/:id/roles", TenantController.createRole);
tenants.put("/:id/roles/:roleId", TenantController.updateRole);
tenants.delete("/:id/roles/:roleId", TenantController.deleteRole);

// Rotas de convites
tenants.get("/:id/invitations", TenantController.getTenantInvitations);
tenants.post("/:id/invitations", TenantController.createInvitation);
tenants.post("/invitations/:token/accept", TenantController.acceptInvitation);
tenants.delete(
  "/:id/invitations/:invitationId",
  TenantController.cancelInvitation
);

// Rotas de usuários do tenant
tenants.get("/:id/users", TenantController.getTenantUsers);
tenants.post("/:id/users/:userId/roles", TenantController.assignUserRole);
tenants.delete(
  "/:id/users/:userId/roles/:roleId",
  TenantController.removeUserRole
);

export default tenants;
