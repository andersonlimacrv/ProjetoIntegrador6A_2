import { Context } from "hono";
import { TenantService } from "../services/TenantService";

export class TenantController {
  private static tenantService = new TenantService();

  // CRUD básico
  static async getAllTenants(c: Context) {
    try {
      const tenants = await TenantController.tenantService.getAllTenants();
      return c.json(
        {
          ...tenants,
          message: tenants.success
            ? "Tenants listados com sucesso"
            : tenants.error || "Erro ao buscar tenants",
        },
        tenants.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar tenants" }, 500);
    }
  }

  static async getTenantById(c: Context) {
    try {
      const id = c.req.param("id");
      const tenant = await TenantController.tenantService.getTenantById(id);
      return c.json(
        {
          ...tenant,
          message: tenant.success
            ? "Tenant encontrado com sucesso"
            : tenant.error || "Tenant não encontrado",
        },
        tenant.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar tenant" }, 500);
    }
  }

  static async getTenantBySlug(c: Context) {
    try {
      const slug = c.req.param("slug");
      const tenant = await TenantController.tenantService.getTenantBySlug(slug);
      return c.json(
        {
          ...tenant,
          message: tenant.success
            ? "Tenant encontrado com sucesso"
            : tenant.error || "Tenant não encontrado",
        },
        tenant.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar tenant" }, 500);
    }
  }

  static async createTenant(c: Context) {
    try {
      const data = await c.req.json();
      const tenant = await TenantController.tenantService.createTenant(data);
      return c.json(
        {
          ...tenant,
          message: tenant.success
            ? "Tenant criado com sucesso"
            : tenant.error || "Erro ao criar tenant",
        },
        tenant.success ? 201 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao criar tenant" }, 500);
    }
  }

  static async updateTenant(c: Context) {
    try {
      const id = c.req.param("id");
      const data = await c.req.json();
      const tenant = await TenantController.tenantService.updateTenant(
        id,
        data
      );
      return c.json(
        {
          ...tenant,
          message: tenant.success
            ? "Tenant atualizado com sucesso"
            : tenant.error || "Tenant não encontrado",
        },
        tenant.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atualizar tenant" }, 500);
    }
  }

  static async deleteTenant(c: Context) {
    try {
      const id = c.req.param("id");
      const deleted = await TenantController.tenantService.deleteTenant(id);
      return c.json(
        {
          ...deleted,
          message: deleted.success
            ? "Tenant deletado com sucesso"
            : deleted.error || "Tenant não encontrado",
        },
        deleted.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao deletar tenant" }, 500);
    }
  }

  // Roles
  static async getTenantRoles(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const roles = await TenantController.tenantService.getTenantRoles(tenantId);
      return c.json(
        { ...roles, message: roles.success ? "Roles do tenant listadas com sucesso" : roles.error || "Erro ao buscar roles" },
        roles.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar roles" }, 500);
    }
  }

  static async createRole(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const data = await c.req.json();
      const role = await TenantController.tenantService.createRole(tenantId, data);
      return c.json(
        { ...role, message: role.success ? "Role criada com sucesso" : role.error || "Erro ao criar role" },
        role.success ? 201 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao criar role" }, 500);
    }
  }

  static async updateRole(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const roleId = c.req.param("roleId");
      const data = await c.req.json();
      const role = await TenantController.tenantService.updateRole(
        tenantId,
        roleId,
        data
      );
      return c.json(
        {
          ...role,
          message: role.success
            ? "Role atualizada com sucesso"
            : role.error || "Role não encontrada",
        },
        role.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atualizar role" }, 500);
    }
  }

  static async deleteRole(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const roleId = c.req.param("roleId");
      const deleted = await TenantController.tenantService.deleteRole(
        tenantId,
        roleId
      );
      return c.json(
        {
          ...deleted,
          message: deleted.success
            ? "Role removida com sucesso"
            : deleted.error || "Role não encontrada",
        },
        deleted.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao deletar role" }, 500);
    }
  }

  // Invitations
  static async getTenantInvitations(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const invitations = await TenantController.tenantService.getTenantInvitations(tenantId);
      return c.json(
        { ...invitations, message: invitations.success ? "Convites do tenant listados com sucesso" : invitations.error || "Erro ao buscar convites" },
        invitations.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar convites" }, 500);
    }
  }

  static async createInvitation(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const data = await c.req.json();
      const invitation = await TenantController.tenantService.createInvitation({ ...data, tenantId });
      return c.json(
        { ...invitation, message: invitation.success ? "Convite criado com sucesso" : invitation.error || "Erro ao criar convite" },
        invitation.success ? 201 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao criar convite" }, 500);
    }
  }

  static async acceptInvitation(c: Context) {
    try {
      const token = c.req.param("token");
      const result = await TenantController.tenantService.acceptInvitation({ token });
      return c.json(
        { ...result, message: result.success ? "Convite aceito com sucesso" : result.error || "Convite não encontrado" },
        result.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao aceitar convite" }, 500);
    }
  }

  static async cancelInvitation(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const invitationId = c.req.param("invitationId");
      const result = await TenantController.tenantService.cancelInvitation({ tenantId, invitationId });
      return c.json(
        { ...result, message: result.success ? "Convite cancelado com sucesso" : result.error || "Convite não encontrado" },
        result.success ? 200 : 404
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao cancelar convite" }, 500);
    }
  }

  // Users
  static async getTenantUsers(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const users = await TenantController.tenantService.getTenantUsers(tenantId);
      return c.json(
        { ...users, message: users.success ? "Usuários do tenant listados com sucesso" : users.error || "Erro ao buscar usuários" },
        users.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar usuários" }, 500);
    }
  }

  static async assignUserRole(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const data = await c.req.json();
      const result = await TenantController.tenantService.assignUserRole({ ...data, tenantId });
      return c.json(
        { ...result, message: result.success ? "Role atribuída ao usuário com sucesso" : result.error || "Erro ao atribuir role" },
        result.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atribuir role" }, 500);
    }
  }

  static async removeUserRole(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const data = await c.req.json();
      const result = await TenantController.tenantService.removeUserRole({ ...data, tenantId });
      return c.json(
        { ...result, message: result.success ? "Role removida do usuário com sucesso" : result.error || "Erro ao remover role" },
        result.success ? 200 : 400
      );
    } catch (error) {
      return c.json({ success: false, error: "Erro ao remover role" }, 500);
    }
  }
}
