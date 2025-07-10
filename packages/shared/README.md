# Pacote Shared - Tipos e Utilitários Compartilhados

## Visão Geral do Pacote Shared

O pacote shared representa um componente fundamental da arquitetura do Sistema de Gestão de Projetos Ágeis, implementando o conceito de "Shared Kernel" descrito por Eric Evans em "Domain-Driven Design: Tackling Complexity in the Heart of Software" (2003). Este pacote centraliza tipos, interfaces e utilitários compartilhados entre frontend e backend, garantindo consistência de dados, type safety e facilitando a evolução do sistema.

## Arquitetura de Tipagem Compartilhada

### Conceito de Shared Kernel

O Shared Kernel é um padrão fundamental do Domain-Driven Design que define um conjunto de conceitos, tipos e regras compartilhados entre diferentes contextos da aplicação. Conforme descrito por Evans, este padrão promove consistência e reduz duplicação, sendo especialmente valioso em arquiteturas de microserviços e aplicações full-stack.

**Definição Centralizada**: Todos os tipos de dados, interfaces e enums relacionados ao domínio de negócio são definidos centralmente no pacote shared. Esta centralização garante que frontend e backend utilizem exatamente as mesmas definições de dados, eliminando inconsistências e erros de runtime.

**Evolução Controlada**: Mudanças nos tipos compartilhados são controladas e versionadas, garantindo que alterações sejam aplicadas de forma coordenada em todos os contextos. Esta abordagem segue os princípios de "Evolutionary Design" descritos por Martin Fowler.

**Type Safety End-to-End**: A tipagem compartilhada garante type safety completo desde o banco de dados até a interface do usuário, eliminando erros de tipo e melhorando significativamente a experiência de desenvolvimento.

### Estrutura de Tipos

O pacote shared implementa uma estrutura de tipos bem organizada que reflete o domínio de negócio do sistema de gestão ágil, seguindo as práticas descritas por Robert C. Martin em "Clean Architecture" (2017).

**Entidades de Domínio**: Implementadas em `src/types/`, cada entidade do sistema possui seu próprio arquivo de tipos (user.ts, project.ts, team.ts, etc.). Esta organização facilita manutenção e evolução dos tipos.

**Interfaces Consistentes**: Todas as entidades seguem interfaces consistentes que incluem campos obrigatórios como id, createdAt e updatedAt, além de campos específicos do domínio. Esta consistência facilita operações genéricas e serialização.

**Tipos de Relacionamento**: Implementados tipos específicos para relacionamentos entre entidades, incluindo tipos para operações de criação, atualização e consulta. Esta abordagem garante type safety em operações complexas.

## Tipos Implementados

### Tipos de Usuário (User)

O tipo User representa os usuários do sistema, incluindo informações de autenticação, perfil e relacionamentos com outras entidades.

**Campos Básicos**: Implementado campos básicos como id, email, name, avatarUrl e isActive, seguindo as melhores práticas de modelagem de usuários descritas por Kimball e Ross em "The Data Warehouse Toolkit" (2002).

**Campos de Auditoria**: Implementado campos de auditoria como createdAt, updatedAt e lastLogin para rastreamento de atividades e conformidade regulatória.

**Relacionamentos**: Implementado tipos para relacionamentos com tenants, teams e projects, facilitando consultas complexas e operações de autorização.

### Tipos de Projeto (Project)

O tipo Project representa os projetos do sistema, incluindo configurações, status e relacionamentos com times e usuários.

**Campos de Identificação**: Implementado campos como id, name, slug, projectKey e description para identificação e descrição do projeto.

**Campos de Configuração**: Implementado campos como startDate, endDate, status e ownerId para configuração e controle do projeto.

**Relacionamentos**: Implementado tipos para relacionamentos com tenants, teams, epics e user stories, facilitando consultas hierárquicas.

### Tipos de Time (Team)

O tipo Team representa os times de desenvolvimento, incluindo membros, papéis e relacionamentos com projetos.

**Campos Básicos**: Implementado campos como id, name, description e tenantId para identificação e descrição do time.

**Campos de Auditoria**: Implementado campos de auditoria como createdAt e updatedAt para rastreamento de mudanças.

**Relacionamentos**: Implementado tipos para relacionamentos com users, projects e tenants, facilitando operações de gestão de membros.

### Tipos de Sprint

O tipo Sprint representa os sprints do sistema, seguindo a metodologia Scrum conforme descrito por Ken Schwaber e Jeff Sutherland em "The Scrum Guide" (2020).

**Campos de Identificação**: Implementado campos como id, name, goal e projectId para identificação e descrição do sprint.

**Campos Temporais**: Implementado campos como startDate, endDate e status para controle temporal e acompanhamento do sprint.

**Campos de Auditoria**: Implementado campos de auditoria como createdAt e updatedAt para rastreamento de mudanças.

### Tipos de User Story

O tipo UserStory representa as histórias de usuário do sistema, seguindo as práticas de User Story Mapping descritas por Jeff Patton em "User Story Mapping" (2014).

**Campos de Conteúdo**: Implementado campos como id, title, description, acceptanceCriteria e storyPoints para definição completa da user story.

**Campos de Controle**: Implementado campos como priority, status, assigneeId e dueDate para controle e acompanhamento.

**Relacionamentos**: Implementado tipos para relacionamentos com epics, projects e tasks, facilitando decomposição hierárquica.

### Tipos de Tarefa (Task)

O tipo Task representa as tarefas técnicas do sistema, incluindo estimativas, atribuições e relacionamentos com user stories.

**Campos de Conteúdo**: Implementado campos como id, title, description e priority para definição da tarefa.

**Campos de Estimativa**: Implementado campos como estimatedHours e actualHours para controle de tempo e métricas de performance.

**Relacionamentos**: Implementado tipos para relacionamentos com user stories, projects e users, facilitando atribuição e acompanhamento.

### Tipos de Epic

O tipo Epic representa os epics do sistema, que agrupam user stories relacionadas conforme descrito por Mike Cohn em "User Stories Applied" (2004).

**Campos de Identificação**: Implementado campos como id, name, description e projectId para identificação e descrição do epic.

**Campos de Controle**: Implementado campos como priority, storyPoints, assigneeId e status para controle e acompanhamento.

**Relacionamentos**: Implementado tipos para relacionamentos com user stories e projects, facilitando agrupamento lógico.

### Tipos de Comentário (Comment)

O tipo Comment representa o sistema de comentários para colaboração em tempo real.

**Campos de Conteúdo**: Implementado campos como id, content e userId para definição do comentário.

**Campos de Relacionamento**: Implementado campos como entityType, entityId e parentId para relacionamento com outras entidades e suporte a threading.

**Campos de Auditoria**: Implementado campos de auditoria como createdAt e updatedAt para rastreamento de mudanças.

### Tipos de Atividade (Activity)

O tipo Activity representa o sistema de auditoria e rastreamento de atividades.

**Campos de Identificação**: Implementado campos como id, action, entityType e entityId para identificação da atividade.

**Campos de Contexto**: Implementado campos como userId, tenantId, oldValues e newValues para contexto completo da atividade.

**Campos de Auditoria**: Implementado campos de auditoria como createdAt para rastreamento temporal.

### Tipos de Tenant

O tipo Tenant representa o sistema de multi-tenancy, permitindo que múltiplas organizações utilizem o sistema de forma isolada.

**Campos de Identificação**: Implementado campos como id, name, slug e description para identificação e descrição do tenant.

**Campos de Configuração**: Implementado campos como avatarUrl para personalização visual.

**Campos de Auditoria**: Implementado campos de auditoria como createdAt e updatedAt para rastreamento de mudanças.

### Tipos de Status

O tipo Status representa o sistema de fluxos de status para diferentes entidades.

**Campos de Identificação**: Implementado campos como id, name, color e order para identificação e ordenação do status.

**Campos de Controle**: Implementado campos como isFinal, isInitial e flowId para controle do fluxo de status.

### Tipos de Sprint Backlog

O tipo SprintBacklogItem representa os itens do sprint backlog, conectando sprints e user stories.

**Campos de Relacionamento**: Implementado campos como sprintId e storyId para relacionamento entre sprint e user story.

**Campos de Controle**: Implementado campos como order e addedAt para controle de prioridade e rastreamento.

### Tipos de Métricas de Sprint

O tipo SprintMetric representa as métricas de performance dos sprints.

**Campos de Métricas**: Implementado campos como plannedPoints, completedPoints, totalTasks e completedTasks para métricas de progresso.

**Campos de Performance**: Implementado campos como velocity para métricas de performance da equipe.

**Campos de Auditoria**: Implementado campos como calculatedAt para rastreamento temporal das métricas.

## Utilitários Compartilhados

### Funções de Validação

O pacote shared inclui funções de validação reutilizáveis que garantem consistência na validação de dados entre frontend e backend.

**Validação de Tipos**: Implementado funções para validação de tipos básicos como email, UUID e datas, seguindo as práticas descritas por Yaron Minsky em "Real World OCaml" (2013).

**Validação de Negócio**: Implementado funções para validação de regras de negócio específicas do domínio, como validação de datas de sprint e prioridades.

**Funções de Transformação**: Implementado funções para transformação de dados, como formatação de datas e normalização de strings.

### Funções de Serialização

O pacote shared inclui funções para serialização e deserialização de dados, garantindo consistência na comunicação entre frontend e backend.

**Serialização JSON**: Implementado funções para serialização segura de objetos complexos, incluindo tratamento de valores nulos e undefined.

**Deserialização JSON**: Implementado funções para deserialização segura de dados JSON, incluindo validação de tipos e tratamento de erros.

**Funções de Mapeamento**: Implementado funções para mapeamento entre diferentes representações de dados, facilitando transformações entre camadas.

## Boas Práticas Implementadas

### Type Safety

O pacote shared implementa type safety rigoroso seguindo as práticas descritas por Anders Hejlsberg e as recomendações da equipe do TypeScript.

**Tipos Estritos**: Todos os tipos são definidos de forma estrita, evitando tipos any e promovendo type safety completo.

**Interfaces vs Types**: Utilizado interfaces para objetos com estrutura fixa e types para unions e intersections, seguindo as melhores práticas do TypeScript.

**Generic Types**: Implementado generic types para operações reutilizáveis, como operações CRUD e validação de dados.

### Documentação de Tipos

O pacote shared inclui documentação completa dos tipos, seguindo as práticas descritas por Steve McConnell em "Code Complete" (2004).

**JSDoc Comments**: Implementado comentários JSDoc para todos os tipos e funções, incluindo descrições, exemplos e informações de uso.

**Exemplos de Uso**: Incluído exemplos de uso para tipos complexos, facilitando compreensão e implementação.

**Informações de Evolução**: Documentado informações sobre evolução dos tipos, incluindo breaking changes e migrações.

### Versionamento

O pacote shared implementa versionamento semântico seguindo as práticas descritas por Tom Preston-Werner em "Semantic Versioning" (2013).

**Versionamento Semântico**: Implementado versionamento semântico (MAJOR.MINOR.PATCH) para controle de mudanças e compatibilidade.

**Changelog**: Mantido changelog detalhado documentando todas as mudanças, incluindo breaking changes e novas funcionalidades.

**Compatibilidade**: Garantido compatibilidade backward sempre que possível, facilitando evolução do sistema.

## Integração com Frontend e Backend

### Integração com Frontend

O pacote shared é integrado ao frontend através de importações diretas, garantindo type safety completo na interface do usuário.

**Importações Tipadas**: Todos os componentes e serviços do frontend importam tipos do pacote shared, garantindo consistência de dados.

**Validação de Formulários**: Formulários do frontend utilizam tipos do pacote shared para validação, garantindo que dados enviados sejam válidos.

**Type Safety de API**: Chamadas de API utilizam tipos do pacote shared para garantir type safety nas requisições e respostas.

### Integração com Backend

O pacote shared é integrado ao backend através de importações diretas, garantindo type safety completo na API.

**Tipos de Entidades**: Todas as entidades do banco de dados utilizam tipos do pacote shared, garantindo consistência entre schema e código.

**Validação de Dados**: Middlewares de validação utilizam tipos do pacote shared para garantir que dados recebidos sejam válidos.

**Serialização de Respostas**: Respostas da API utilizam tipos do pacote shared para garantir consistência de formato.

## Configuração e Build

### Configuração TypeScript

O pacote shared possui configuração TypeScript otimizada para bibliotecas, seguindo as práticas descritas pela equipe do TypeScript.

**Configuração de Build**: Implementado configuração de build que gera tipos de declaração (.d.ts) para uso em projetos consumidores.

**Configuração de Export**: Configurado exports apropriados para diferentes ambientes (ESM, CommonJS) e diferentes tipos de uso.

**Configuração de Resolução**: Configurado resolução de módulos para garantir que dependências sejam resolvidas corretamente.

### Configuração de Package

O package.json do pacote shared é configurado seguindo as melhores práticas para bibliotecas TypeScript.

**Entry Points**: Configurado entry points apropriados para diferentes ambientes e tipos de uso.

**Dependencies**: Separado dependencies de devDependencies apropriadamente, minimizando o tamanho do pacote final.

**Scripts**: Implementado scripts para build, test e publish, facilitando desenvolvimento e distribuição.

## Testes e Qualidade

### Testes de Tipos

O pacote shared inclui testes de tipos utilizando TypeScript compiler API, garantindo que tipos sejam válidos e funcionem corretamente.

**Testes de Compilação**: Implementado testes que verificam se tipos compilam corretamente, identificando problemas de tipo em tempo de desenvolvimento.

**Testes de Compatibilidade**: Implementado testes que verificam compatibilidade entre diferentes versões de tipos, facilitando evolução controlada.

**Testes de Validação**: Implementado testes para funções de validação, garantindo que funcionem corretamente com diferentes tipos de entrada.

### Linting e Formatação

O pacote shared implementa linting e formatação rigorosos para garantir qualidade de código.

**ESLint**: Configurado ESLint com regras específicas para bibliotecas TypeScript, identificando problemas de qualidade de código.

**Prettier**: Configurado Prettier para formatação automática, garantindo consistência de estilo.

**TypeScript Strict Mode**: Habilitado modo estrito do TypeScript para identificar problemas de tipo e promover boas práticas.

## Evolução e Manutenção

### Processo de Evolução

O pacote shared implementa processo de evolução controlado que garante compatibilidade e facilita manutenção.

**Review de Mudanças**: Todas as mudanças nos tipos são revisadas para garantir compatibilidade e consistência.

**Breaking Changes**: Breaking changes são documentados e comunicados adequadamente, facilitando migração em projetos consumidores.

**Deprecação**: Tipos e funções obsoletos são marcados como deprecated antes da remoção, facilitando migração gradual.

### Monitoramento de Uso

O pacote shared implementa monitoramento de uso para identificar padrões e oportunidades de melhoria.

**Análise de Dependências**: Monitorado uso do pacote em projetos consumidores para identificar padrões de uso.

**Feedback de Desenvolvedores**: Coletado feedback de desenvolvedores para identificar oportunidades de melhoria e novos requisitos.

**Métricas de Qualidade**: Monitorado métricas de qualidade como cobertura de testes e tempo de build para garantir manutenibilidade.

## Conclusão

O pacote shared representa um componente fundamental da arquitetura do Sistema de Gestão de Projetos Ágeis, implementando o conceito de Shared Kernel do Domain-Driven Design. Este pacote garante consistência de dados, type safety e facilita a evolução do sistema através de tipagem compartilhada e utilitários reutilizáveis.

A implementação segue rigorosamente as melhores práticas de desenvolvimento TypeScript e bibliotecas, incluindo type safety completo, documentação adequada e processo de evolução controlado. O pacote facilita significativamente o desenvolvimento tanto no frontend quanto no backend, reduzindo erros de tipo e promovendo consistência de dados.

A arquitetura de tipagem compartilhada garante que mudanças no domínio sejam aplicadas de forma coordenada em todos os contextos da aplicação, facilitando manutenção e evolução do sistema. O pacote serve como contrato entre frontend e backend, garantindo que a comunicação entre as camadas seja type-safe e consistente.

## Referências Bibliográficas

1. Evans, Eric. "Domain-Driven Design: Tackling Complexity in the Heart of Software." Addison-Wesley, 2003.
2. Martin, Robert C. "Clean Architecture: A Craftsman's Guide to Software Structure and Design." Prentice Hall, 2017.
3. Hejlsberg, Anders. "TypeScript: JavaScript that scales." Microsoft, 2012.
4. Schwaber, Ken; Sutherland, Jeff. "The Scrum Guide." 2020.
5. Patton, Jeff. "User Story Mapping: Discover the Whole Story, Build the Right Product." O'Reilly Media, 2014.
6. Cohn, Mike. "User Stories Applied: For Agile Software Development." Addison-Wesley, 2004.
7. Kimball, Ralph; Ross, Margy. "The Data Warehouse Toolkit: The Definitive Guide to Dimensional Modeling." Wiley, 2002.
8. Minsky, Yaron; Madhavapeddy, Anil; Hickey, Jason. "Real World OCaml: Functional Programming for the Masses." O'Reilly Media, 2013.
9. McConnell, Steve. "Code Complete: A Practical Handbook of Software Construction." Microsoft Press, 2004.
10. Preston-Werner, Tom. "Semantic Versioning 2.0.0." 2013.
11. TypeScript Team. "TypeScript Handbook." Microsoft, 2023.
12. Fowler, Martin. "Evolutionary Design." 2004.

## Licença

Este projeto é desenvolvido como trabalho acadêmico e está sujeito às políticas da instituição de ensino.
