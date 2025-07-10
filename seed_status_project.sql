-- Script SQL para povoar status por projeto
-- Execute este script no pgAdmin para criar os status necessários

-- 1. Primeiro, vamos verificar se existem projetos
SELECT 'Projetos existentes:' as info, COUNT(*) as total FROM projects;

-- 2. Criar fluxos de status para cada projeto (se não existirem)
INSERT INTO status_flows (id, project_id, name, entity_type, is_default, created_at)
SELECT 
    gen_random_uuid(),
    p.id,
    'Fluxo Kanban Padrão',
    'task',
    true,
    CURRENT_TIMESTAMP
FROM projects p
WHERE NOT EXISTS (
    SELECT 1 FROM status_flows sf 
    WHERE sf.project_id = p.id 
    AND sf.entity_type = 'task'
    AND sf.is_default = true
);

-- 3. Inserir status padrão para cada fluxo criado
INSERT INTO statuses (id, flow_id, name, color, "order", is_final, is_initial)
SELECT 
    gen_random_uuid(),
    sf.id,
    'TODO',
    '#6B7280',
    1,
    false,
    true
FROM status_flows sf
WHERE sf.entity_type = 'task' 
AND sf.is_default = true
AND NOT EXISTS (
    SELECT 1 FROM statuses s 
    WHERE s.flow_id = sf.id 
    AND s.name = 'TODO'
);

INSERT INTO statuses (id, flow_id, name, color, "order", is_final, is_initial)
SELECT 
    gen_random_uuid(),
    sf.id,
    'IN PROGRESS',
    '#3B82F6',
    2,
    false,
    false
FROM status_flows sf
WHERE sf.entity_type = 'task' 
AND sf.is_default = true
AND NOT EXISTS (
    SELECT 1 FROM statuses s 
    WHERE s.flow_id = sf.id 
    AND s.name = 'IN PROGRESS'
);

INSERT INTO statuses (id, flow_id, name, color, "order", is_final, is_initial)
SELECT 
    gen_random_uuid(),
    sf.id,
    'REVIEW',
    '#F59E0B',
    3,
    false,
    false
FROM status_flows sf
WHERE sf.entity_type = 'task' 
AND sf.is_default = true
AND NOT EXISTS (
    SELECT 1 FROM statuses s 
    WHERE s.flow_id = sf.id 
    AND s.name = 'REVIEW'
);

INSERT INTO statuses (id, flow_id, name, color, "order", is_final, is_initial)
SELECT 
    gen_random_uuid(),
    sf.id,
    'DONE',
    '#10B981',
    4,
    true,
    false
FROM status_flows sf
WHERE sf.entity_type = 'task' 
AND sf.is_default = true
AND NOT EXISTS (
    SELECT 1 FROM statuses s 
    WHERE s.flow_id = sf.id 
    AND s.name = 'DONE'
);

INSERT INTO statuses (id, flow_id, name, color, "order", is_final, is_initial)
SELECT 
    gen_random_uuid(),
    sf.id,
    'CANCELLED',
    '#EF4444',
    5,
    true,
    false
FROM status_flows sf
WHERE sf.entity_type = 'task' 
AND sf.is_default = true
AND NOT EXISTS (
    SELECT 1 FROM statuses s 
    WHERE s.flow_id = sf.id 
    AND s.name = 'CANCELLED'
);

-- 4. Verificar os status criados por projeto
SELECT 
    p.name as projeto,
    sf.name as fluxo,
    s.name as status,
    s.color,
    s."order",
    s.is_final,
    s.is_initial
FROM projects p
JOIN status_flows sf ON sf.project_id = p.id
JOIN statuses s ON s.flow_id = sf.id
WHERE sf.entity_type = 'task' 
AND sf.is_default = true
ORDER BY p.name, s."order"; 