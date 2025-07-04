import { Context } from "hono";
import { TenantService } from "../services/TenantService";
import { ApiResponse } from "@shared";

export class TenantController {
  private static tenantService = new TenantService();

  // CRUD básico
  static async getAllTenants(c: Context) {
    try {
      const tenants = await TenantController.tenantService.getAllTenants();
      return c.json({ success: true, data: tenants });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar tenants" }, 500);
    }
  }

  static async getTenantById(c: Context) {
    try {
      const id = c.req.param("id");
      const tenant = await TenantController.tenantService.getTenantById(id);

      if (!tenant) {
        return c.json({ success: false, error: "Tenant não encontrado" }, 404);
      }

      return c.json({ success: true, data: tenant });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar tenant" }, 500);
    }
  }

  static async getTenantBySlug(c: Context) {
    try {
      const slug = c.req.param("slug");
      const tenant = await TenantController.tenantService.getTenantBySlug(slug);

      if (!tenant) {
        return c.json({ success: false, error: "Tenant não encontrado" }, 404);
      }

      return c.json({ success: true, data: tenant });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar tenant" }, 500);
    }
  }

  static async createTenant(c: Context) {
    try {
      const data = await c.req.json();
      const tenant = await TenantController.tenantService.createTenant(data);
      return c.json({ success: true, data: tenant }, 201);
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

      if (!tenant) {
        return c.json({ success: false, error: "Tenant não encontrado" }, 404);
      }

      return c.json({ success: true, data: tenant });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atualizar tenant" }, 500);
    }
  }

  static async deleteTenant(c: Context) {
    try {
      const id = c.req.param("id");
      const success = await TenantController.tenantService.deleteTenant(id);

      if (!success) {
        return c.json({ success: false, error: "Tenant não encontrado" }, 404);
      }

      return c.json({ success: true, message: "Tenant deletado com sucesso" });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao deletar tenant" }, 500);
    }
  }

  // Roles
  static async getTenantRoles(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const roles = await TenantController.tenantService.getTenantRoles(
        tenantId
      );
      return c.json({ success: true, data: roles });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar roles" }, 500);
    }
  }

  static async createRole(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const data = await c.req.json();
      const role = await TenantController.tenantService.createRole(
        tenantId,
        data
      );
      return c.json({ success: true, data: role }, 201);
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

      if (!role) {
        return c.json({ success: false, error: "Role não encontrada" }, 404);
      }

      return c.json({ success: true, data: role });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atualizar role" }, 500);
    }
  }

  static async deleteRole(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const roleId = c.req.param("roleId");
      const success = await TenantController.tenantService.deleteRole(
        tenantId,
        roleId
      );

      if (!success) {
        return c.json({ success: false, error: "Role não encontrada" }, 404);
      }

      return c.json({ success: true, message: "Role deletada com sucesso" });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao deletar role" }, 500);
    }
  }

  // Invitations
  static async getTenantInvitations(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const invitations =
        await TenantController.tenantService.getTenantInvitations(tenantId);
      return c.json({ success: true, data: invitations });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar convites" }, 500);
    }
  }

  static async createInvitation(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const data = await c.req.json();
      const invitation = await TenantController.tenantService.createInvitation(
        tenantId,
        data
      );
      return c.json({ success: true, data: invitation }, 201);
    } catch (error) {
      return c.json({ success: false, error: "Erro ao criar convite" }, 500);
    }
  }

  static async acceptInvitation(c: Context) {
    try {
      const token = c.req.param("token");
      const data = await c.req.json();
      const result = await TenantController.tenantService.acceptInvitation(
        token,
        data
      );
      return c.json({ success: true, data: result });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao aceitar convite" }, 500);
    }
  }

  static async cancelInvitation(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const invitationId = c.req.param("invitationId");
      const success = await TenantController.tenantService.cancelInvitation(
        tenantId,
        invitationId
      );

      if (!success) {
        return c.json({ success: false, error: "Convite não encontrado" }, 404);
      }

      return c.json({
        success: true,
        message: "Convite cancelado com sucesso",
      });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao cancelar convite" }, 500);
    }
  }

  // Users
  static async getTenantUsers(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const users = await TenantController.tenantService.getTenantUsers(
        tenantId
      );
      return c.json({ success: true, data: users });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao buscar usuários" }, 500);
    }
  }

  static async assignUserRole(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const userId = c.req.param("userId");
      const data = await c.req.json();
      const result = await TenantController.tenantService.assignUserRole(
        tenantId,
        userId,
        data
      );
      return c.json({ success: true, data: result });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao atribuir role" }, 500);
    }
  }

  static async removeUserRole(c: Context) {
    try {
      const tenantId = c.req.param("id");
      const userId = c.req.param("userId");
      const roleId = c.req.param("roleId");
      const success = await TenantController.tenantService.removeUserRole(
        tenantId,
        userId,
        roleId
      );

      if (!success) {
        return c.json({ success: false, error: "Role não encontrada" }, 404);
      }

      return c.json({ success: true, message: "Role removida com sucesso" });
    } catch (error) {
      return c.json({ success: false, error: "Erro ao remover role" }, 500);
    }
  }
}
