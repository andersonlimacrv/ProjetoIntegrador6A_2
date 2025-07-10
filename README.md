# Sistema de Gestão de Projetos Ágeis - Projeto Integrador 6A

## Visão Geral do Projeto

Este projeto representa um sistema completo de gestão de projetos ágeis desenvolvido como trabalho de conclusão do curso de Engenharia de Software. O sistema implementa metodologias ágeis modernas, incluindo Scrum e Kanban, com foco em gestão de projetos, times, sprints, user stories e tarefas. A arquitetura adota o padrão Model-View-Controller (MVC) em um monorepo, utilizando tecnologias modernas e boas práticas de engenharia de software.

## Arquitetura do Sistema

### Padrão Model-View-Controller (MVC)

O projeto implementa rigorosamente o padrão Model-View-Controller, conforme descrito por Trygve Reenskaug em sua tese seminal "Models-Views-Controllers" (1979). Este padrão arquitetural separa a aplicação em três componentes principais, cada um com responsabilidades bem definidas, promovendo baixo acoplamento e alta coesão.

**Model (Modelo)**: Representa a camada de dados e lógica de negócio. No backend, os Models são implementados através do Drizzle ORM, que mapeia diretamente as tabelas do banco de dados PostgreSQL. Cada entidade do sistema (User, Project, Team, Sprint, UserStory, Task, etc.) possui seu próprio modelo com validações, relacionamentos e regras de negócio específicas. Os Models encapsulam toda a lógica de acesso a dados e garantem a integridade das informações, seguindo o princípio de responsabilidade única descrito por Robert C. Martin em "Clean Code" (2008).

**View (Visão)**: Representa a interface do usuário e a apresentação dos dados. No frontend React, as Views são implementadas através de componentes funcionais que utilizam hooks modernos para gerenciamento de estado. Cada página do sistema (Dashboard, Projects, Teams, Epics, User Stories, Tasks, Analytics) possui seus próprios componentes de visualização, que se comunicam com o Controller através de chamadas de API. A View é responsável apenas pela apresentação, não contendo lógica de negócio, seguindo o princípio de separação de responsabilidades.

**Controller (Controlador)**: Atua como intermediário entre o Model e a View, processando requisições HTTP e coordenando as operações. No backend, os Controllers são implementados como classes estáticas que recebem requisições do framework Hono, validam os dados de entrada, delegam a execução para os Services e retornam respostas padronizadas. Cada entidade possui seu próprio Controller (UserController, ProjectController, TeamController, etc.), garantindo organização e manutenibilidade do código.

### Estrutura de Camadas do Backend

O backend implementa uma arquitetura em camadas que segue os princípios de Clean Architecture descritos por Robert C. Martin em "Clean Architecture" (2017). Esta abordagem promove independência de frameworks, testabilidade e flexibilidade para mudanças futuras.

**Camada de Controllers**: Implementada em `apps/server/src/controllers/`, esta camada é responsável por receber requisições HTTP, validar parâmetros de entrada e coordenar a execução de operações. Cada Controller segue um padrão consistente de tratamento de erros e formatação de respostas, garantindo uniformidade na API. Os Controllers não contêm lógica de negócio, apenas orquestração de operações.

**Camada de Services**: Implementada em `apps/server/src/services/`, esta camada contém toda a lógica de negócio do sistema. Os Services implementam as regras específicas do domínio de gestão ágil, incluindo validações complexas, cálculos de métricas e orquestração de operações que envolvem múltiplas entidades. Cada Service possui uma instância do Repository correspondente, seguindo o padrão de injeção de dependência.

**Camada de Repositories**: Implementada em `apps/server/src/repositories/`, esta camada encapsula toda a lógica de acesso a dados. Os Repositories utilizam o Drizzle ORM para executar queries SQL otimizadas e mapear os resultados para objetos TypeScript tipados. Esta camada implementa o padrão Repository descrito por Martin Fowler em "Patterns of Enterprise Application Architecture" (2002), promovendo abstração do banco de dados e facilitando testes unitários.

**Camada de Models**: Implementada através do Drizzle ORM em `apps/server/src/db/schema.ts`, esta camada define a estrutura do banco de dados e os relacionamentos entre entidades. O schema é definido de forma declarativa, permitindo que o Drizzle gere automaticamente as queries SQL e garanta type safety em tempo de compilação.

### Estrutura do Frontend

O frontend implementa uma arquitetura baseada em componentes que segue as melhores práticas de React moderno, conforme descrito por Dan Abramov em "React: The Complete Guide" (2020). A estrutura é organizada de forma modular, facilitando manutenção e reutilização de código.

**Componentes de Páginas**: Implementados em `apps/client/src/pages/`, cada página do sistema possui seu próprio componente que coordena a apresentação e interação com o usuário. As páginas utilizam hooks personalizados para gerenciamento de estado e comunicação com a API.

**Componentes de UI**: Implementados em `apps/client/src/components/ui/`, estes componentes fornecem elementos de interface reutilizáveis como botões, formulários, tabelas e modais. Todos os componentes seguem o design system definido pelo Tailwind CSS, garantindo consistência visual.

**Contextos de Estado**: Implementados em `apps/client/src/contexts/`, os contextos React gerenciam estado global da aplicação, incluindo autenticação, tema e notificações. Esta abordagem segue o padrão Context API do React, evitando prop drilling e centralizando o gerenciamento de estado.

**Serviços de API**: Implementados em `apps/client/src/services/`, estes serviços encapsulam toda a comunicação com o backend, fornecendo métodos tipados para cada operação da API. Os serviços utilizam o cliente HTTP nativo do navegador com interceptors para tratamento de erros e autenticação.

## Tecnologias e Stack Tecnológico

### Backend (Server)

O backend é desenvolvido em **Node.js** com **TypeScript**, utilizando o framework **Hono** para criação de APIs RESTful. A escolha do Node.js é fundamentada em sua capacidade de I/O não-bloqueante e na possibilidade de compartilhar código entre frontend e backend.

**Hono Framework**: O Hono é um framework web moderno e leve, desenvolvido por Yusuke Wada, que oferece excelente performance e uma API intuitiva. Sua arquitetura modular e suporte nativo a TypeScript o tornam ideal para desenvolvimento de APIs modernas. O framework implementa middlewares para CORS, logging, tratamento de erros e headers de segurança, seguindo as melhores práticas de desenvolvimento web.

**Drizzle ORM**: Para acesso a dados, utilizamos o Drizzle ORM, uma solução TypeScript-first que oferece type safety completo e performance superior. Diferente de ORMs tradicionais como Sequelize ou Prisma, o Drizzle mantém a simplicidade do SQL enquanto oferece as vantagens da tipagem estática. O ORM gera automaticamente queries SQL otimizadas e garante que todas as operações de banco de dados sejam type-safe.

**PostgreSQL**: O banco de dados PostgreSQL foi escolhido por sua robustez, conformidade com ACID e suporte avançado a tipos de dados JSON. Conforme descrito por Bruce Momjian em "PostgreSQL: Introduction and Concepts", o PostgreSQL oferece recursos avançados como transações, integridade referencial e extensibilidade que são essenciais para sistemas empresariais. O banco implementa relacionamentos complexos entre entidades, incluindo chaves estrangeiras e índices otimizados.

### Frontend (Client)

O frontend é desenvolvido em **React 18** com **TypeScript**, seguindo as melhores práticas de desenvolvimento moderno. A escolha do React é fundamentada em sua popularidade, ecossistema rico e capacidade de criar interfaces de usuário interativas e responsivas.

**TypeScript**: A utilização de TypeScript, conforme recomendado por Anders Hejlsberg (criador da linguagem), oferece tipagem estática que reduz significativamente erros em tempo de execução, melhora a experiência de desenvolvimento com IntelliSense avançado e facilita a manutenção de código em projetos de grande escala. Todos os componentes, hooks e serviços são tipados, garantindo consistência e reduzindo bugs.

**Vite**: O bundler Vite foi escolhido por sua velocidade superior em desenvolvimento, hot module replacement eficiente e configuração simplificada. Evan You, criador do Vite, destaca que a ferramenta resolve problemas de performance que afetam projetos modernos com muitas dependências. O Vite oferece build otimizado para produção e desenvolvimento rápido com hot reload.

**Tailwind CSS**: Para estilização, utilizamos Tailwind CSS, uma abordagem utility-first que promove consistência de design e reduz significativamente o tempo de desenvolvimento. Adam Wathan, criador do Tailwind, argumenta que esta abordagem elimina a necessidade de nomear classes CSS e promove um design system consistente. O sistema utiliza componentes customizados que estendem as classes base do Tailwind.

**React Router**: Para navegação, utilizamos React Router v6, que oferece roteamento declarativo e suporte a rotas aninhadas. O router implementa proteção de rotas através do componente ProtectedRoute, garantindo que apenas usuários autenticados acessem páginas restritas.

## Funcionalidades Implementadas

### Gestão de Projetos

O sistema implementa gestão completa de projetos, incluindo criação, edição, exclusão e visualização detalhada. Cada projeto possui configurações específicas como nome, descrição, chave do projeto, datas de início e fim, e status (ativo, arquivado, concluído). O sistema permite associação de times a projetos e acompanhamento de métricas de progresso.

**Criação de Projetos**: Implementada através do formulário em `apps/client/src/pages/projects/create-project.tsx`, permite criação de projetos com validação de dados e feedback visual. O formulário utiliza componentes reutilizáveis e validação em tempo real.

**Listagem de Projetos**: Implementada em `apps/client/src/pages/projects/all-project.tsx`, apresenta todos os projetos do usuário em formato de cards com informações resumidas. A listagem inclui filtros e busca por nome ou descrição.

**Detalhes do Projeto**: Implementada em `apps/client/src/pages/projects/[id].tsx`, apresenta informações detalhadas do projeto, incluindo times associados e sprints. A página utiliza tabs para organizar diferentes seções de informação.

### Gestão de Times

O sistema implementa gestão completa de times, incluindo criação, edição, exclusão e gestão de membros. Cada time possui nome, descrição e lista de membros com papéis específicos (líder, membro).

**Criação de Times**: Implementada através do formulário em `apps/client/src/pages/teams/create-team.tsx`, permite criação de times com validação de dados e seleção de membros iniciais.

**Gestão de Membros**: Implementada em `apps/client/src/pages/teams/members.tsx`, permite adicionar e remover membros de times, além de alterar papéis e permissões.

**Listagem de Times**: Implementada em `apps/client/src/pages/teams/all-teams.tsx`, apresenta todos os times em formato de cards com informações resumidas e ações rápidas.

### Gestão de Sprints

O sistema implementa gestão de sprints seguindo a metodologia Scrum, incluindo criação, planejamento e acompanhamento. Cada sprint possui nome, meta, datas de início e fim, e status (planejado, ativo, concluído, cancelado).

**Criação de Sprints**: Implementada através do formulário em `apps/client/src/components/forms/SprintForm.tsx`, permite criação de sprints com validação de datas e metas específicas.

**Sprint Backlog**: Implementado através da tabela `sprint_backlog_items`, permite associar user stories a sprints específicos com ordem de prioridade.

**Detalhes do Sprint**: Implementada em `apps/client/src/pages/sprints/project-sprint-details.tsx`, apresenta informações detalhadas do sprint, incluindo backlog, tarefas e métricas.

### Gestão de User Stories

O sistema implementa gestão de user stories com priorização, estimativas e critérios de aceitação. Cada user story possui título, descrição, critérios de aceitação, pontos de história, prioridade e status.

**Backlog de User Stories**: Implementado em `apps/client/src/pages/user-stories/backlog.tsx`, apresenta todas as user stories do projeto em formato de lista com informações de prioridade e status.

**Kanban Board**: Implementado em `apps/client/src/pages/user-stories/kanban.tsx`, permite visualização das user stories em formato de board com colunas por status.

**Templates**: Implementado em `apps/client/src/pages/user-stories/templates.tsx`, permite criação e reutilização de templates de user stories para acelerar o processo de criação.

### Gestão de Tarefas

O sistema implementa gestão de tarefas com atribuição, estimativas e acompanhamento de progresso. Cada tarefa possui título, descrição, estimativa de horas, horas reais, responsável e status.

**Listagem de Tarefas**: Implementada em `apps/client/src/pages/tasks/index.tsx`, apresenta todas as tarefas em formato de tabela com filtros e busca.

**Detalhes da Tarefa**: Permite visualização detalhada de tarefas, incluindo comentários, atividades e dependências.

### Gestão de Epics

O sistema implementa gestão de epics para agrupamento de user stories relacionadas. Cada epic possui nome, descrição, prioridade, pontos de história e status.

**Board de Epics**: Implementado em `apps/client/src/pages/epics/board.tsx`, permite visualização dos epics em formato de board com colunas por status.

**Timeline de Epics**: Implementado em `apps/client/src/pages/epics/timeline.tsx`, permite visualização temporal dos epics com datas de início e fim.

### Analytics e Métricas

O sistema implementa dashboard de analytics com métricas de projeto, incluindo velocidade da equipe, burndown charts e relatórios de progresso.

**Dashboard de Analytics**: Implementado em `apps/client/src/pages/analytics/dashboard.tsx`, apresenta métricas gerais do projeto com gráficos e indicadores.

**Relatórios**: Implementado em `apps/client/src/pages/analytics/reports.tsx`, permite geração de relatórios detalhados de progresso e performance.

**Métricas**: Implementado em `apps/client/src/pages/analytics/metrics.tsx`, apresenta métricas específicas como velocidade, qualidade e produtividade.

## Segurança e Autenticação

### Autenticação JWT

O sistema implementa autenticação baseada em JWT (JSON Web Tokens), conforme especificação RFC 7519. Os tokens são assinados digitalmente e contêm claims que identificam o usuário e suas permissões. A implementação segue as melhores práticas de segurança, incluindo expiração de tokens e refresh tokens.

**Login**: Implementado através do componente `apps/client/src/components/auth/LoginDialog.tsx`, permite autenticação de usuários com validação de credenciais e feedback visual.

**Proteção de Rotas**: Implementada através do componente `apps/client/src/components/auth/ProtectedRoute.tsx`, garante que apenas usuários autenticados acessem páginas restritas.

**Contexto de Autenticação**: Implementado em `apps/client/src/contexts/auth-context.tsx`, gerencia estado global de autenticação e fornece métodos para login, logout e verificação de token.

### Validação de Dados

Todas as entradas de dados são validadas utilizando bibliotecas como Zod, seguindo o princípio de "never trust user input" descrito por OWASP. A validação ocorre tanto no frontend quanto no backend, implementando defesa em profundidade.

**Validação no Frontend**: Implementada através de hooks personalizados e bibliotecas de validação, garante que dados inválidos não sejam enviados para o backend.

**Validação no Backend**: Implementada através de middlewares e validação nos controllers, garante integridade dos dados mesmo se a validação do frontend for contornada.

## Banco de Dados e Modelagem

### Modelagem Relacional

O banco de dados utiliza PostgreSQL com modelagem relacional normalizada, seguindo as formas normais descritas por E.F. Codd em "A Relational Model of Data for Large Shared Data Banks" (1970). A normalização reduz redundância de dados e promove integridade referencial.

**Entidades Principais**: O sistema possui 15 entidades principais: tenants, users, projects, teams, epics, user_stories, tasks, sprints, comments, activities, status_flows, statuses, sprint_backlog_items, sprint_metrics e project_settings.

**Relacionamentos**: Implementa relacionamentos complexos entre entidades, incluindo many-to-many através de tabelas de junção (user_teams, team_projects, sprint_backlog_items) e relacionamentos hierárquicos (epics → user_stories → tasks).

**Integridade Referencial**: Todas as chaves estrangeiras possuem constraints de integridade referencial, garantindo consistência dos dados e prevenindo operações inválidas.

### Índices e Performance

A modelagem inclui índices estratégicos para otimizar consultas frequentes, seguindo as recomendações de PostgreSQL Performance Tuning. Índices compostos são utilizados para consultas que envolvem múltiplas colunas, melhorando significativamente a performance.

**Índices Primários**: Todas as tabelas possuem índices primários em UUIDs, garantindo acesso rápido por identificador único.

**Índices Secundários**: Índices são criados em colunas frequentemente consultadas como project_id, user_id, status e datas.

**Índices Compostos**: Índices compostos são utilizados para consultas complexas que envolvem múltiplas condições.

## Padrões de Design Implementados

### Repository Pattern

O sistema implementa rigorosamente o padrão Repository, conforme descrito por Martin Fowler em "Patterns of Enterprise Application Architecture". Este padrão encapsula a lógica de acesso a dados, promovendo separação de responsabilidades e facilitando testes unitários.

**Abstração do Banco de Dados**: Os repositories abstraem completamente o acesso ao banco de dados, permitindo que a lógica de negócio seja independente da tecnologia de persistência.

**Interface Consistente**: Todos os repositories seguem uma interface consistente com métodos CRUD básicos e métodos específicos do domínio.

**Testabilidade**: A abstração facilita a criação de mocks para testes unitários, permitindo testar a lógica de negócio sem dependência do banco de dados.

### Service Layer Pattern

A camada de serviço implementa a lógica de negócio, seguindo o princípio de responsabilidade única (SRP) de Robert C. Martin em "Clean Code". Esta camada orquestra operações complexas e aplica regras de negócio específicas do domínio.

**Lógica de Negócio Centralizada**: Toda a lógica de negócio está centralizada nos services, garantindo consistência e facilitando manutenção.

**Validações Complexas**: Os services implementam validações complexas que envolvem múltiplas entidades e regras de negócio específicas.

**Transações**: Operações que envolvem múltiplas entidades são encapsuladas em transações, garantindo consistência dos dados.

### Dependency Injection

O sistema utiliza injeção de dependência para promover baixo acoplamento entre componentes. Esta prática, conforme descrita por Mark Seemann em "Dependency Injection in .NET", facilita testes unitários e promove flexibilidade na arquitetura.

**Injeção de Repositories**: Os services recebem instâncias dos repositories através de injeção de dependência, permitindo fácil substituição para testes.

**Singleton Pattern**: Os services são implementados como singletons para garantir uma única instância durante toda a execução da aplicação.

## Testes e Qualidade de Código

### Testes de API

O projeto inclui testes de API implementados através de arquivos HTTP, permitindo testar endpoints de forma isolada e documentar o comportamento esperado da API.

**Arquivos de Teste**: Implementados em `apps/server/tests/`, cada entidade possui seu próprio arquivo de teste com exemplos de requisições e respostas esperadas.

**Cobertura de Endpoints**: Todos os endpoints da API são testados, incluindo casos de sucesso e erro.

**Documentação Viva**: Os testes servem como documentação viva da API, demonstrando como utilizar cada endpoint.

### Linting e Formatação

O projeto utiliza ESLint e Prettier para garantir consistência de código e identificar problemas potenciais. Esta prática, conforme descrita por Nicholas Zakas em "Maintainable JavaScript", melhora a legibilidade e manutenibilidade do código.

**Configuração ESLint**: Implementada configuração rigorosa que identifica problemas de qualidade de código e força boas práticas.

**Formatação Automática**: Prettier garante formatação consistente em todo o projeto, eliminando debates sobre estilo de código.

**Integração com IDE**: Configuração para formatação automática no save e linting em tempo real.

## Metodologia Ágil e Scrum

### Implementação de Scrum

O sistema implementa metodologia Scrum, conforme descrito por Ken Schwaber e Jeff Sutherland em "The Scrum Guide" (2020). As funcionalidades incluem:

**Sprints**: Períodos de tempo fixo (time-boxed) para desenvolvimento de funcionalidades específicas. O sistema permite criação, planejamento e acompanhamento de sprints com metas claras e datas de início e fim.

**Sprint Backlog**: Lista de user stories e tarefas selecionadas para um sprint específico. O sistema permite adicionar, remover e reordenar itens do backlog conforme necessário durante o sprint.

**User Stories**: Histórias de usuário que descrevem funcionalidades do ponto de vista do usuário final. O sistema suporta criação, priorização e acompanhamento de user stories com critérios de aceitação.

**Tarefas**: Decomposição técnica das user stories em tarefas específicas. O sistema permite criação, atribuição e acompanhamento de tarefas com estimativas de tempo.

### Kanban Board

O sistema implementa visualização Kanban para acompanhamento de trabalho em progresso, conforme descrito por David J. Anderson em "Kanban: Successful Evolutionary Change for Your Technology Business" (2010). O board permite visualizar o fluxo de trabalho e identificar gargalos.

**Colunas por Status**: O board organiza user stories e tarefas em colunas baseadas no status atual (To Do, In Progress, Done).

**Drag and Drop**: Implementa funcionalidade de drag and drop para mover itens entre colunas, facilitando atualização de status.

**Limite de WIP**: O sistema suporta definição de limites de trabalho em progresso (WIP) para prevenir sobrecarga da equipe.

## Estrutura de Dados

### Entidades Principais

**Tenants**: Organizações ou empresas que utilizam o sistema (multi-tenancy)
**Users**: Usuários do sistema com autenticação e perfis
**Projects**: Projetos dentro de uma organização
**Teams**: Times de desenvolvimento
**Sprints**: Períodos de desenvolvimento
**User Stories**: Histórias de usuário
**Tasks**: Tarefas técnicas
**Epics**: Agrupamentos de user stories

### Relacionamentos

O sistema implementa relacionamentos complexos entre entidades, seguindo as melhores práticas de modelagem de dados. Relacionamentos many-to-many são implementados através de tabelas de junção, e relacionamentos hierárquicos são suportados para epics e user stories.

**Many-to-Many**: Implementados através de tabelas de junção como user_teams, team_projects e sprint_backlog_items.

**One-to-Many**: Implementados através de chaves estrangeiras como project_id em user_stories e epic_id em tasks.

**Hierárquicos**: Epics podem conter múltiplas user stories, que por sua vez podem conter múltiplas tasks.

## Performance e Escalabilidade

### Otimizações de Consulta

O sistema implementa otimizações de consulta utilizando índices estratégicos e queries otimizadas. Consultas complexas são otimizadas para reduzir tempo de resposta e consumo de recursos.

**Queries Otimizadas**: Todas as queries são escritas de forma otimizada, utilizando joins apropriados e evitando N+1 queries.

**Índices Estratégicos**: Índices são criados em colunas frequentemente consultadas para melhorar performance.

**Paginação**: Sistema de paginação implementado para listagens grandes, reduzindo tempo de carregamento.

### Caching

Implementação de cache em diferentes níveis para melhorar performance. Cache de consultas frequentes e cache de sessões de usuário são utilizados para reduzir carga no banco de dados.

**Cache de Sessão**: Tokens JWT são armazenados em localStorage para persistência de sessão.

**Cache de Dados**: Dados frequentemente acessados são cacheados no frontend para reduzir requisições.

## Monitoramento e Logs

### Sistema de Logs

Implementação de sistema de logs estruturados para monitoramento e debugging. Logs incluem informações de contexto, níveis de severidade e rastreamento de requisições.

**Logs de Requisição**: Todas as requisições HTTP são logadas com informações de contexto e tempo de resposta.

**Logs de Erro**: Erros são logados com stack trace completo e contexto da operação.

**Logs de Negócio**: Operações importantes de negócio são logadas para auditoria e debugging.

## Conclusão

Este projeto demonstra a aplicação prática de conceitos avançados de engenharia de software, incluindo arquitetura MVC, padrões de design, segurança, performance e metodologias ágeis. A implementação segue as melhores práticas da indústria e serve como referência para desenvolvimento de sistemas empresariais modernos.

O sistema não apenas implementa funcionalidades de gestão ágil, mas também demonstra como aplicar princípios sólidos de engenharia de software em um projeto real, incluindo separação de responsabilidades, testabilidade, manutenibilidade e escalabilidade.

A arquitetura MVC implementada garante que o código seja organizado, testável e manutenível, seguindo os princípios estabelecidos por Trygve Reenskaug e popularizados por frameworks modernos. A separação clara entre Model, View e Controller facilita a evolução do sistema e a adição de novas funcionalidades.

## Referências Bibliográficas

1. Reenskaug, Trygve. "Models-Views-Controllers." Xerox PARC, 1979.
2. Martin, Robert C. "Clean Code: A Handbook of Agile Software Craftsmanship." Prentice Hall, 2008.
3. Martin, Robert C. "Clean Architecture: A Craftsman's Guide to Software Structure and Design." Prentice Hall, 2017.
4. Fowler, Martin. "Patterns of Enterprise Application Architecture." Addison-Wesley, 2002.
5. Schwaber, Ken; Sutherland, Jeff. "The Scrum Guide." 2020.
6. Anderson, David J. "Kanban: Successful Evolutionary Change for Your Technology Business." Blue Hole Press, 2010.
7. Momjian, Bruce. "PostgreSQL: Introduction and Concepts." Addison-Wesley, 2001.
8. Seemann, Mark. "Dependency Injection in .NET." Manning, 2011.
9. Zakas, Nicholas C. "Maintainable JavaScript: Writing Readable Code." O'Reilly Media, 2012.
10. Abramov, Dan. "React: The Complete Guide." 2020.
11. Codd, E.F. "A Relational Model of Data for Large Shared Data Banks." Communications of the ACM, 1970.
12. Wada, Yusuke. "Hono: Fast Web Framework for the Edge." 2023.

## Licença

Este projeto é desenvolvido como trabalho acadêmico e está sujeito às políticas da instituição de ensino.
