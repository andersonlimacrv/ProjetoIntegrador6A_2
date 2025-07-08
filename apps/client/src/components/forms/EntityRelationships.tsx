import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Search, Eye, Pencil, Trash } from "lucide-react";
import type { ApiResponse } from "@packages/shared";

interface EntityRelationshipsProps {
  title: string;
  description: string;
  entityId: string;
  relatedEntities: any[];
  loading: boolean;
  onAddRelationship: (
    entityId: string,
    relatedEntityId: string
  ) => Promise<void>;
  onRemoveRelationship: (
    entityId: string,
    relatedEntityId: string
  ) => Promise<void>;
  onViewEntity: (entity: any) => void;
  onEditEntity: (entity: any) => void;
  onDeleteEntity: (entity: any) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  getPriorityColor?: (priority: string) => string;
  getPriorityLabel?: (priority: string) => string;
  entityType: "epic" | "story" | "sprint" | "team" | "task";
  searchPlaceholder?: string;
  emptyMessage?: string;
  addButtonText?: string;
}

export function EntityRelationships({
  title,
  description,
  entityId,
  relatedEntities,
  loading,
  onAddRelationship,
  onRemoveRelationship,
  onViewEntity,
  onEditEntity,
  onDeleteEntity,
  getStatusColor,
  getStatusLabel,
  getPriorityColor,
  getPriorityLabel,
  entityType,
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhum item encontrado",
  addButtonText = "Adicionar",
}: EntityRelationshipsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [availableEntities, setAvailableEntities] = useState<any[]>([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);

  // Simular busca de entidades disponíveis
  const fetchAvailableEntities = async () => {
    setLoadingAvailable(true);
    try {
      // TODO: Implementar busca real de entidades disponíveis
      // Por enquanto, simulamos com dados vazios
      setAvailableEntities([]);
    } catch (error) {
      console.error("Erro ao buscar entidades disponíveis:", error);
    } finally {
      setLoadingAvailable(false);
    }
  };

  const handleAddRelationship = async () => {
    if (!selectedEntityId) return;

    try {
      await onAddRelationship(entityId, selectedEntityId);
      setShowAddDialog(false);
      setSelectedEntityId("");
    } catch (error) {
      console.error("Erro ao adicionar relacionamento:", error);
    }
  };

  const handleRemoveRelationship = async (relatedEntityId: string) => {
    if (confirm("Tem certeza que deseja remover este relacionamento?")) {
      try {
        await onRemoveRelationship(entityId, relatedEntityId);
      } catch (error) {
        console.error("Erro ao remover relacionamento:", error);
      }
    }
  };

  const getEntityIcon = () => {
    switch (entityType) {
      case "epic":
        return "🎯";
      case "story":
        return "📄";
      case "sprint":
        return "📅";
      case "team":
        return "👥";
      case "task":
        return "✅";
      default:
        return "📋";
    }
  };

  const getEntityTitle = (entity: any) => {
    switch (entityType) {
      case "epic":
        return entity.name;
      case "story":
        return entity.title;
      case "sprint":
        return entity.name;
      case "team":
        return entity.name;
      case "task":
        return entity.title;
      default:
        return entity.name || entity.title;
    }
  };

  const getEntityDescription = (entity: any) => {
    switch (entityType) {
      case "epic":
        return entity.description;
      case "story":
        return entity.description;
      case "sprint":
        return entity.goal;
      case "team":
        return entity.description;
      case "task":
        return entity.description;
      default:
        return entity.description;
    }
  };

  const filteredEntities = relatedEntities.filter((entity) =>
    getEntityTitle(entity).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          {addButtonText}
        </Button>
      </div>

      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de entidades relacionadas */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Carregando...
        </div>
      ) : filteredEntities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-4xl mb-4">{getEntityIcon()}</div>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredEntities.map((entity) => (
            <Card key={entity.id} className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span>{getEntityIcon()}</span>
                  {getEntityTitle(entity)}
                </CardTitle>
                <CardDescription className="text-xs space-y-1">
                  <div className="flex gap-2">
                    <Badge
                      className={`text-xs ${getStatusColor(entity.status)}`}
                    >
                      {getStatusLabel(entity.status)}
                    </Badge>
                    {getPriorityColor &&
                      getPriorityLabel &&
                      entity.priority && (
                        <Badge
                          className={`text-xs ${getPriorityColor(
                            entity.priority
                          )}`}
                        >
                          {getPriorityLabel(entity.priority)}
                        </Badge>
                      )}
                    {entity.storyPoints && (
                      <Badge className="text-xs bg-blue-100 text-blue-800">
                        {entity.storyPoints} pts
                      </Badge>
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {getEntityDescription(entity) && (
                  <p className="text-xs text-muted-foreground mb-2">
                    {getEntityDescription(entity)}
                  </p>
                )}
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2"
                    onClick={() => onViewEntity(entity)}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2"
                    onClick={() => onEditEntity(entity)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2"
                    onClick={() => handleRemoveRelationship(entity.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para adicionar relacionamento */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar {title}</DialogTitle>
            <DialogDescription>
              Selecione uma entidade para associar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entity-select">Selecionar {entityType}</Label>
              <Select
                value={selectedEntityId}
                onValueChange={setSelectedEntityId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Selecione um ${entityType}`} />
                </SelectTrigger>
                <SelectContent>
                  {loadingAvailable ? (
                    <SelectItem value="" disabled>
                      Carregando...
                    </SelectItem>
                  ) : availableEntities.length === 0 ? (
                    <SelectItem value="" disabled>
                      Nenhuma opção disponível
                    </SelectItem>
                  ) : (
                    availableEntities.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {getEntityTitle(entity)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddRelationship}
              disabled={!selectedEntityId || loadingAvailable}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
