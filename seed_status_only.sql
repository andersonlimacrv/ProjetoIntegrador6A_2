-- Script SQL para povoar apenas a tabela de status
-- Execute este script no pgAdmin para criar os status necessários

-- 1. Primeiro, vamos criar um status flow padrão (se não existir)
INSERT INTO status_flows (id, project_id, name, entity_type, is_default, created_at)
VALUES (
    gen_random_uuid(),
    (SELECT id FROM projects LIMIT 1), -- Assumindo que existe pelo menos um projeto
    'Fluxo Kanban Padrão',
    'task',
    true,
    CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

-- 2. Agora vamos inserir os status padrão
INSERT INTO statuses (id, flow_id, name, color, "order", is_final, is_initial)
VALUES 
    (
        gen_random_uuid(),
        (SELECT id FROM status_flows WHERE name = 'Fluxo Kanban Padrão' LIMIT 1),
        'TODO',
        '#6B7280',
        1,
        false,
        true
    ),
    (
        gen_random_uuid(),
        (SELECT id FROM status_flows WHERE name = 'Fluxo Kanban Padrão' LIMIT 1),
        'IN PROGRESS',
        '#3B82F6',
        2,
        false,
        false
    ),
    (
        gen_random_uuid(),
        (SELECT id FROM status_flows WHERE name = 'Fluxo Kanban Padrão' LIMIT 1),
        'REVIEW',
        '#F59E0B',
        3,
        false,
        false
    ),
    (
        gen_random_uuid(),
        (SELECT id FROM status_flows WHERE name = 'Fluxo Kanban Padrão' LIMIT 1),
        'DONE',
        '#10B981',
        4,
        true,
        false
    ),
    (
        gen_random_uuid(),
        (SELECT id FROM status_flows WHERE name = 'Fluxo Kanban Padrão' LIMIT 1),
        'CANCELLED',
        '#EF4444',
        5,
        true,
        false
    )
ON CONFLICT DO NOTHING;

-- 3. Verificar se os status foram criados
SELECT 
    s.id,
    s.name,
    s.color,
    s."order",
    s.is_final,
    s.is_initial,
    sf.name as flow_name
FROM statuses s
JOIN status_flows sf ON s.flow_id = sf.id
WHERE sf.name = 'Fluxo Kanban Padrão'
ORDER BY s."order"; 