# Backend - Sistema de Gestão de Projetos Ágeis

## Visão Geral do Backend

O backend do Sistema de Gestão de Projetos Ágeis é desenvolvido em Node.js com TypeScript, seguindo rigorosamente o padrão Model-View-Controller (MVC) e implementando uma arquitetura em camadas que promove separação de responsabilidades, testabilidade e manutenibilidade. O sistema utiliza o framework Hono para criação de APIs RESTful, Drizzle ORM para acesso a dados e PostgreSQL como banco de dados relacional.

## Arquitetura MVC Implementada

### Model (Modelo)

O Model representa a camada de dados e lógica de negócio, implementado através do Drizzle ORM que mapeia diretamente as tabelas do banco de dados PostgreSQL. Conforme descrito por Martin Fowler em "Patterns of Enterprise Application Architecture" (2002), o Model encapsula toda a lógica de acesso a dados e garante a integridade das informações.

**Schema de Dados**: Implementado em `src/db/schema.ts`, define a estrutura completa do banco de dados com 15 entidades principais: tenants, users, projects, teams, epics, user_stories, tasks, sprints, comments, activities, status_flows, statuses, sprint_backlog_items, sprint_metrics e project_settings. Cada entidade possui campos tipados, relacionamentos definidos e constraints de integridade referencial.

**Tipos TypeScript**: O Drizzle ORM gera automaticamente tipos TypeScript baseados no schema, garantindo type safety completo em todas as operações de banco de dados. Esta abordagem elimina erros de runtime relacionados a tipos de dados e melhora significativamente a experiência de desenvolvimento.

**Relacionamentos**: O sistema implementa relacionamentos complexos entre entidades, incluindo many-to-many através de tabelas de junção (user_teams, team_projects, sprint_backlog_items) e relacionamentos hierárquicos (epics → user_stories → tasks). Todos os relacionamentos são definidos de forma declarativa no schema.

### View (Visão)

No contexto de uma API REST, a View é representada pela camada de serialização e formatação de respostas. O sistema implementa respostas JSON padronizadas que seguem um formato consistente em todos os endpoints.

**Formato de Resposta Padronizado**: Todas as respostas da API seguem o formato `{ success: boolean, data?: any, error?: string, message?: string }`, garantindo consistência e facilitando o consumo pelo frontend. Este padrão é implementado em todos os controllers e middlewares.

**Serialização de Dados**: Os dados são serializados automaticamente pelo framework Hono, que converte objetos JavaScript em JSON válido. O sistema inclui middlewares para formatação de datas e tratamento de valores nulos.

**Headers de Resposta**: O sistema implementa headers de segurança e CORS apropriados para APIs web, incluindo Content-Type, Access-Control-Allow-Origin e headers de segurança como X-Content-Type-Options.

### Controller (Controlador)

O Controller atua como intermediário entre o Model e a View, processando requisições HTTP e coordenando as operações. Conforme descrito por Trygve Reenskaug em sua tese seminal "Models-Views-Controllers" (1979), o Controller é responsável por receber input do usuário, validar dados e delegar a execução para os Services.

**Estrutura dos Controllers**: Implementados em `src/controllers/`, cada entidade possui seu próprio controller (UserController, ProjectController, TeamController, etc.) que segue um padrão consistente de tratamento de erros e formatação de respostas. Os controllers são implementados como classes estáticas para evitar instanciação desnecessária.

**Validação de Entrada**: Todos os controllers implementam validação de dados de entrada, verificando tipos, formatos e regras de negócio antes de delegar para os services. A validação inclui verificação de parâmetros obrigatórios, formatos de dados e permissões de acesso.

**Tratamento de Erros**: Implementado tratamento consistente de erros em todos os controllers, incluindo captura de exceções, logging de erros e retorno de respostas de erro padronizadas. O sistema diferencia entre erros de validação, erros de negócio e erros internos do servidor.

## Camadas de Arquitetura

### Camada de Controllers

A camada de controllers é responsável por receber requisições HTTP, validar parâmetros de entrada e coordenar a execução de operações. Esta camada implementa o padrão MVC e segue os princípios de Clean Architecture descritos por Robert C. Martin.

**Roteamento**: Implementado através do framework Hono, que oferece roteamento declarativo e suporte a middlewares. Cada entidade possui suas próprias rotas organizadas em arquivos separados em `src/routes/`.

**Middlewares**: O sistema implementa middlewares globais para CORS, logging, tratamento de erros e headers de segurança. Middlewares específicos são aplicados conforme necessário para validação de autenticação e autorização.

**Validação de Parâmetros**: Todos os endpoints implementam validação de parâmetros de entrada, incluindo verificação de tipos, formatos e regras de negócio. A validação é implementada tanto no nível do controller quanto através de middlewares especializados.

### Camada de Services

A camada de services contém toda a lógica de negócio do sistema, implementando as regras específicas do domínio de gestão ágil. Esta camada segue o princípio de responsabilidade única (SRP) de Robert C. Martin em "Clean Code" (2008).

**Lógica de Negócio Centralizada**: Toda a lógica de negócio está centralizada nos services, garantindo consistência e facilitando manutenção. Os services implementam validações complexas, cálculos de métricas e orquestração de operações que envolvem múltiplas entidades.

**Padrão Repository**: Cada service possui uma instância do repository correspondente, seguindo o padrão de injeção de dependência. Esta abordagem promove baixo acoplamento e facilita testes unitários.

**Transações**: Operações que envolvem múltiplas entidades são encapsuladas em transações, garantindo consistência dos dados. O sistema utiliza transações do PostgreSQL para operações críticas como criação de projetos com times associados.

### Camada de Repositories

A camada de repositories encapsula toda a lógica de acesso a dados, implementando o padrão Repository descrito por Martin Fowler. Esta camada abstrai completamente o acesso ao banco de dados, permitindo que a lógica de negócio seja independente da tecnologia de persistência.

**Abstração do Banco de Dados**: Os repositories abstraem completamente o acesso ao banco de dados, permitindo que a lógica de negócio seja independente da tecnologia de persistência. Esta abstração facilita mudanças futuras na tecnologia de banco de dados.

**Queries Otimizadas**: Todas as queries são escritas de forma otimizada, utilizando joins apropriados e evitando N+1 queries. O Drizzle ORM gera SQL otimizado automaticamente baseado nas definições do schema.

**Type Safety**: O Drizzle ORM garante type safety completo em todas as operações de banco de dados, eliminando erros de runtime relacionados a tipos de dados.

## Tecnologias e Dependências

### Framework Hono

O Hono é um framework web moderno e leve, desenvolvido por Yusuke Wada, que oferece excelente performance e uma API intuitiva. Sua arquitetura modular e suporte nativo a TypeScript o tornam ideal para desenvolvimento de APIs modernas.

**Performance**: O Hono oferece performance superior comparado a frameworks tradicionais como Express, com menor overhead e melhor utilização de recursos. O framework é otimizado para edge computing e serverless environments.

**TypeScript First**: O Hono foi desenvolvido com TypeScript em mente, oferecendo type safety completo e excelente integração com o ecossistema TypeScript.

**Middlewares**: O framework oferece middlewares built-in para funcionalidades comuns como CORS, logging e compressão, além de suporte a middlewares customizados.

### Drizzle ORM

O Drizzle ORM é uma solução TypeScript-first que oferece type safety completo e performance superior. Diferente de ORMs tradicionais como Sequelize ou Prisma, o Drizzle mantém a simplicidade do SQL enquanto oferece as vantagens da tipagem estática.

**Schema-First Approach**: O Drizzle utiliza uma abordagem schema-first, onde o schema é definido de forma declarativa e o ORM gera automaticamente as queries SQL e tipos TypeScript.

**Performance**: O Drizzle oferece performance superior comparado a outros ORMs, com menor overhead e queries SQL otimizadas. O ORM não adiciona camadas de abstração desnecessárias.

**Type Safety**: O Drizzle garante type safety completo em todas as operações de banco de dados, eliminando erros de runtime relacionados a tipos de dados.

### PostgreSQL

O PostgreSQL foi escolhido por sua robustez, conformidade com ACID e suporte avançado a tipos de dados JSON. Conforme descrito por Bruce Momjian em "PostgreSQL: Introduction and Concepts", o PostgreSQL oferece recursos avançados essenciais para sistemas empresariais.

**ACID Compliance**: O PostgreSQL oferece conformidade completa com ACID (Atomicity, Consistency, Isolation, Durability), garantindo integridade dos dados mesmo em cenários de falha.

**Tipos de Dados Avançados**: O PostgreSQL oferece suporte a tipos de dados avançados como JSON, arrays e tipos customizados, facilitando a modelagem de dados complexos.

**Performance**: O PostgreSQL oferece excelente performance para cargas de trabalho complexas, com otimizador de queries avançado e suporte a índices especializados.

## Funcionalidades Implementadas

### Gestão de Usuários e Autenticação

O sistema implementa gestão completa de usuários com autenticação JWT, seguindo as melhores práticas de segurança descritas na especificação RFC 7519.

**Registro e Login**: Implementado endpoints para registro e login de usuários, com validação de credenciais e geração de tokens JWT. O sistema inclui validação de força de senha e verificação de email único.

**Autenticação JWT**: Implementado sistema de autenticação baseado em JWT com tokens assinados digitalmente. O sistema inclui refresh tokens e expiração configurável.

**Gestão de Perfis**: Implementado endpoints para atualização de perfis de usuário, incluindo informações pessoais e configurações de preferência.

### Gestão de Projetos

O sistema implementa gestão completa de projetos, incluindo criação, edição, exclusão e consultas complexas com relacionamentos.

**CRUD Completo**: Implementado operações CRUD completas para projetos, incluindo validação de dados e tratamento de erros. O sistema suporta criação de projetos com configurações iniciais.

**Relacionamentos**: Implementado relacionamentos complexos entre projetos e outras entidades como times, epics e user stories. O sistema permite consultas que envolvem múltiplas entidades.

**Configurações de Projeto**: Implementado sistema de configurações de projeto, incluindo duração de sprints, pontos de história padrão e configurações de notificação.

### Gestão de Times

O sistema implementa gestão completa de times, incluindo criação, edição, exclusão e gestão de membros com papéis específicos.

**CRUD de Times**: Implementado operações CRUD completas para times, incluindo validação de dados e tratamento de erros. O sistema suporta criação de times com membros iniciais.

**Gestão de Membros**: Implementado sistema de gestão de membros de times, incluindo adição, remoção e alteração de papéis. O sistema suporta papéis como líder e membro.

**Associação com Projetos**: Implementado sistema de associação de times a projetos, permitindo que múltiplos times trabalhem em um projeto.

### Gestão de Sprints

O sistema implementa gestão de sprints seguindo a metodologia Scrum, incluindo criação, planejamento e acompanhamento.

**CRUD de Sprints**: Implementado operações CRUD completas para sprints, incluindo validação de datas e metas. O sistema suporta criação de sprints com configurações específicas.

**Sprint Backlog**: Implementado sistema de sprint backlog, permitindo associar user stories a sprints específicos com ordem de prioridade. O sistema suporta adição e remoção de itens do backlog.

**Métricas de Sprint**: Implementado sistema de métricas de sprint, incluindo pontos planejados, pontos completados e velocidade da equipe.

### Gestão de User Stories

O sistema implementa gestão de user stories com priorização, estimativas e critérios de aceitação.

**CRUD de User Stories**: Implementado operações CRUD completas para user stories, incluindo validação de dados e tratamento de erros. O sistema suporta criação de user stories com critérios de aceitação.

**Priorização**: Implementado sistema de priorização de user stories, permitindo ordenação baseada em valor de negócio e esforço técnico.

**Relacionamentos**: Implementado relacionamentos entre user stories e epics, permitindo agrupamento lógico de funcionalidades.

### Gestão de Tarefas

O sistema implementa gestão de tarefas com atribuição, estimativas e acompanhamento de progresso.

**CRUD de Tarefas**: Implementado operações CRUD completas para tarefas, incluindo validação de dados e tratamento de erros. O sistema suporta criação de tarefas com estimativas de tempo.

**Atribuição**: Implementado sistema de atribuição de tarefas a usuários específicos, permitindo distribuição de trabalho na equipe.

**Relacionamentos**: Implementado relacionamentos entre tarefas e user stories, permitindo decomposição técnica de funcionalidades.

### Sistema de Comentários

O sistema implementa sistema de comentários para colaboração em tempo real, permitindo discussões sobre user stories, tarefas e sprints.

**CRUD de Comentários**: Implementado operações CRUD completas para comentários, incluindo validação de dados e tratamento de erros. O sistema suporta criação de comentários em diferentes entidades.

**Relacionamentos**: Implementado relacionamentos entre comentários e entidades como user stories, tarefas e sprints.

**Threading**: Implementado sistema de threading de comentários, permitindo respostas e discussões organizadas.

### Sistema de Atividades

O sistema implementa registro automático de atividades para auditoria e acompanhamento de mudanças no sistema.

**Registro Automático**: Implementado registro automático de atividades para operações importantes como criação, edição e exclusão de entidades.

**Consultas**: Implementado endpoints para consulta de atividades por usuário, projeto ou entidade específica.

**Auditoria**: O sistema mantém histórico completo de atividades para fins de auditoria e debugging.

## Segurança e Validação

### Autenticação e Autorização

O sistema implementa sistema robusto de autenticação e autorização, seguindo as melhores práticas de segurança web.

**JWT Tokens**: Implementado sistema de autenticação baseado em JWT com tokens assinados digitalmente. Os tokens incluem claims que identificam o usuário e suas permissões.

**Refresh Tokens**: Implementado sistema de refresh tokens para renovação automática de sessões, melhorando a experiência do usuário sem comprometer a segurança.

**Validação de Tokens**: Implementado middleware para validação de tokens em endpoints protegidos, incluindo verificação de assinatura e expiração.

### Validação de Dados

O sistema implementa validação rigorosa de dados em múltiplas camadas, seguindo o princípio de "never trust user input" descrito por OWASP.

**Validação de Entrada**: Implementado validação de todos os dados de entrada, incluindo verificação de tipos, formatos e regras de negócio. A validação é implementada tanto no nível do controller quanto através de middlewares especializados.

**Sanitização**: Implementado sanitização de dados de entrada para prevenir ataques de injeção e XSS. O sistema remove caracteres perigosos e valida formatos de dados.

**Validação de Negócio**: Implementado validação de regras de negócio específicas do domínio, incluindo verificações de permissões e consistência de dados.

### Headers de Segurança

O sistema implementa headers de segurança apropriados para APIs web, seguindo as recomendações de OWASP.

**CORS**: Implementado configuração CORS apropriada, permitindo acesso apenas de origens autorizadas. O sistema suporta configuração dinâmica de origens baseada em ambiente.

**Security Headers**: Implementado headers de segurança como X-Content-Type-Options, X-Frame-Options e X-XSS-Protection para prevenir ataques comuns.

**Rate Limiting**: Implementado rate limiting básico para prevenir abuso da API, limitando o número de requisições por IP.

## Banco de Dados e Modelagem

### Modelagem Relacional

O banco de dados utiliza PostgreSQL com modelagem relacional normalizada, seguindo as formas normais descritas por E.F. Codd em "A Relational Model of Data for Large Shared Data Banks" (1970).

**Normalização**: O schema segue as três primeiras formas normais, eliminando redundância de dados e promovendo integridade referencial. A normalização reduz espaço de armazenamento e facilita manutenção.

**Chaves Primárias**: Todas as tabelas utilizam UUIDs como chaves primárias, garantindo unicidade global e facilitando distribuição de dados. Os UUIDs são gerados automaticamente pelo PostgreSQL.

**Chaves Estrangeiras**: Implementado constraints de integridade referencial em todas as chaves estrangeiras, garantindo consistência dos dados e prevenindo operações inválidas.

### Índices e Performance

A modelagem inclui índices estratégicos para otimizar consultas frequentes, seguindo as recomendações de PostgreSQL Performance Tuning.

**Índices Primários**: Todas as tabelas possuem índices primários em UUIDs, garantindo acesso rápido por identificador único.

**Índices Secundários**: Índices são criados em colunas frequentemente consultadas como project_id, user_id, status e datas. Estes índices melhoram significativamente a performance de consultas.

**Índices Compostos**: Índices compostos são utilizados para consultas complexas que envolvem múltiplas condições, como busca de projetos por tenant e status.

### Migrations e Versionamento

O sistema utiliza migrations para controle de versão do esquema de banco de dados, seguindo as práticas descritas por K. Scott Allen em "Database Migration Strategies".

**Controle de Versão**: O schema é versionado através de migrations que documentam todas as mudanças no banco de dados. Cada migration é atômica e pode ser aplicada ou revertida independentemente.

**Ambientes**: O sistema suporta diferentes ambientes (desenvolvimento, teste, produção) com configurações específicas de banco de dados.

**Rollback**: Implementado suporte a rollback de migrations, permitindo reverter mudanças problemáticas no banco de dados.

## Padrões de Design Implementados

### Repository Pattern

O sistema implementa rigorosamente o padrão Repository, conforme descrito por Martin Fowler em "Patterns of Enterprise Application Architecture". Este padrão encapsula a lógica de acesso a dados, promovendo separação de responsabilidades e facilitando testes unitários.

**Abstração do Banco de Dados**: Os repositories abstraem completamente o acesso ao banco de dados, permitindo que a lógica de negócio seja independente da tecnologia de persistência. Esta abstração facilita mudanças futuras na tecnologia de banco de dados.

**Interface Consistente**: Todos os repositories seguem uma interface consistente com métodos CRUD básicos (create, read, update, delete) e métodos específicos do domínio. Esta consistência facilita o uso e manutenção dos repositories.

**Testabilidade**: A abstração facilita a criação de mocks para testes unitários, permitindo testar a lógica de negócio sem dependência do banco de dados. Os repositories podem ser facilmente substituídos por implementações mock durante os testes.

### Service Layer Pattern

A camada de serviço implementa a lógica de negócio, seguindo o princípio de responsabilidade única (SRP) de Robert C. Martin em "Clean Code". Esta camada orquestra operações complexas e aplica regras de negócio específicas do domínio.

**Lógica de Negócio Centralizada**: Toda a lógica de negócio está centralizada nos services, garantindo consistência e facilitando manutenção. Os services implementam validações complexas, cálculos de métricas e orquestração de operações que envolvem múltiplas entidades.

**Validações Complexas**: Os services implementam validações complexas que envolvem múltiplas entidades e regras de negócio específicas. Estas validações garantem a integridade dos dados e a consistência do sistema.

**Transações**: Operações que envolvem múltiplas entidades são encapsuladas em transações, garantindo consistência dos dados. O sistema utiliza transações do PostgreSQL para operações críticas como criação de projetos com times associados.

### Dependency Injection

O sistema utiliza injeção de dependência para promover baixo acoplamento entre componentes. Esta prática, conforme descrita por Mark Seemann em "Dependency Injection in .NET", facilita testes unitários e promove flexibilidade na arquitetura.

**Injeção de Repositories**: Os services recebem instâncias dos repositories através de injeção de dependência, permitindo fácil substituição para testes. Esta abordagem promove baixo acoplamento entre as camadas.

**Singleton Pattern**: Os services são implementados como singletons para garantir uma única instância durante toda a execução da aplicação. Esta abordagem é apropriada para services que não mantêm estado.

**Configuração**: A configuração de dependências é centralizada e pode ser facilmente modificada para diferentes ambientes ou necessidades de teste.

## Testes e Qualidade de Código

### Testes de API

O projeto inclui testes de API implementados através de arquivos HTTP, permitindo testar endpoints de forma isolada e documentar o comportamento esperado da API.

**Arquivos de Teste**: Implementados em `tests/`, cada entidade possui seu próprio arquivo de teste com exemplos de requisições e respostas esperadas. Os arquivos seguem o formato HTTP request/response para facilitar execução e documentação.

**Cobertura de Endpoints**: Todos os endpoints da API são testados, incluindo casos de sucesso e erro. Os testes cobrem operações CRUD básicas e operações específicas do domínio.

**Documentação Viva**: Os testes servem como documentação viva da API, demonstrando como utilizar cada endpoint e quais respostas esperar. Esta abordagem garante que a documentação esteja sempre atualizada.

### Linting e Formatação

O projeto utiliza ESLint e Prettier para garantir consistência de código e identificar problemas potenciais. Esta prática, conforme descrita por Nicholas Zakas em "Maintainable JavaScript", melhora a legibilidade e manutenibilidade do código.

**Configuração ESLint**: Implementada configuração rigorosa que identifica problemas de qualidade de código e força boas práticas. A configuração inclui regras específicas para TypeScript e Node.js.

**Formatação Automática**: Prettier garante formatação consistente em todo o projeto, eliminando debates sobre estilo de código. A configuração é aplicada automaticamente no save.

**Integração com IDE**: Configuração para formatação automática no save e linting em tempo real, melhorando a experiência de desenvolvimento e reduzindo erros.

### Logging e Monitoramento

O sistema implementa sistema robusto de logging para monitoramento e debugging, seguindo as melhores práticas de observabilidade.

**Logs Estruturados**: Implementado sistema de logs estruturados que incluem informações de contexto, níveis de severidade e rastreamento de requisições. Os logs são formatados em JSON para facilitar parsing e análise.

**Níveis de Log**: Implementado diferentes níveis de log (debug, info, warn, error) para filtrar informações conforme necessário. O nível de log é configurável por ambiente.

**Contexto de Requisição**: Cada requisição HTTP gera um ID único que é incluído em todos os logs relacionados, facilitando o rastreamento de operações através do sistema.

## Performance e Escalabilidade

### Otimizações de Consulta

O sistema implementa otimizações de consulta utilizando índices estratégicos e queries otimizadas. Consultas complexas são otimizadas para reduzir tempo de resposta e consumo de recursos.

**Queries Otimizadas**: Todas as queries são escritas de forma otimizada, utilizando joins apropriados e evitando N+1 queries. O Drizzle ORM gera SQL otimizado automaticamente baseado nas definições do schema.

**Índices Estratégicos**: Índices são criados em colunas frequentemente consultadas para melhorar performance. A estratégia de indexação é baseada em análise de padrões de consulta e carga de trabalho.

**Paginação**: Sistema de paginação implementado para listagens grandes, reduzindo tempo de carregamento e consumo de memória. A paginação é implementada tanto no nível da API quanto no banco de dados.

### Caching

Implementação de cache em diferentes níveis para melhorar performance. Cache de consultas frequentes e cache de sessões de usuário são utilizados para reduzir carga no banco de dados.

**Cache de Sessão**: Tokens JWT são armazenados em localStorage para persistência de sessão, reduzindo a necessidade de reautenticação frequente.

**Cache de Dados**: Dados frequentemente acessados são cacheados no frontend para reduzir requisições. O cache é invalidado automaticamente quando os dados são atualizados.

**Cache de Consultas**: Consultas frequentes são cacheadas no nível do banco de dados quando apropriado, melhorando significativamente a performance.

## Configuração e Deploy

### Configuração por Ambiente

O sistema suporta configuração por ambiente, permitindo diferentes configurações para desenvolvimento, teste e produção.

**Variáveis de Ambiente**: Configuração através de variáveis de ambiente para informações sensíveis como credenciais de banco de dados e chaves de API. O sistema utiliza dotenv para carregamento de configurações.

**Configuração Dinâmica**: Configuração dinâmica baseada no ambiente de execução, incluindo níveis de log, origens CORS e configurações de banco de dados.

**Validação de Configuração**: Implementado validação de configuração na inicialização da aplicação, garantindo que todas as configurações necessárias estejam presentes e válidas.

### Docker e Containerização

O sistema inclui configuração Docker para facilitar deploy e desenvolvimento, seguindo as práticas descritas por Adrian Mouat em "Using Docker".

**Dockerfile**: Implementado Dockerfile otimizado para produção, incluindo multi-stage build para reduzir tamanho da imagem e melhorar segurança.

**Docker Compose**: Implementado docker-compose.yml para desenvolvimento local, incluindo configuração de banco de dados PostgreSQL e rede isolada.

**Volumes**: Configuração de volumes para persistência de dados e logs, garantindo que informações importantes não sejam perdidas entre reinicializações.

## Conclusão

O backend do Sistema de Gestão de Projetos Ágeis demonstra a aplicação prática de conceitos avançados de engenharia de software, incluindo arquitetura MVC, padrões de design, segurança, performance e boas práticas de desenvolvimento. A implementação segue rigorosamente os princípios estabelecidos por autores renomados na área de engenharia de software.

A arquitetura MVC implementada garante que o código seja organizado, testável e manutenível, seguindo os princípios estabelecidos por Trygve Reenskaug e popularizados por frameworks modernos. A separação clara entre Model, View e Controller facilita a evolução do sistema e a adição de novas funcionalidades.

O uso de tecnologias modernas como Hono, Drizzle ORM e PostgreSQL, combinado com padrões de design sólidos como Repository e Service Layer, resulta em um sistema robusto, escalável e fácil de manter. A implementação de segurança, validação de dados e logging garante que o sistema seja adequado para uso em ambientes de produção.

## Referências Bibliográficas

1. Reenskaug, Trygve. "Models-Views-Controllers." Xerox PARC, 1979.
2. Martin, Robert C. "Clean Code: A Handbook of Agile Software Craftsmanship." Prentice Hall, 2008.
3. Fowler, Martin. "Patterns of Enterprise Application Architecture." Addison-Wesley, 2002.
4. Momjian, Bruce. "PostgreSQL: Introduction and Concepts." Addison-Wesley, 2001.
5. Seemann, Mark. "Dependency Injection in .NET." Manning, 2011.
6. Zakas, Nicholas C. "Maintainable JavaScript: Writing Readable Code." O'Reilly Media, 2012.
7. Codd, E.F. "A Relational Model of Data for Large Shared Data Banks." Communications of the ACM, 1970.
8. Wada, Yusuke. "Hono: Fast Web Framework for the Edge." 2023.
9. Allen, K. Scott. "Database Migration Strategies." 2010.
10. Mouat, Adrian. "Using Docker." O'Reilly Media, 2015.
11. OWASP. "OWASP Top Ten." 2021.
12. RFC 7519. "JSON Web Token (JWT)." 2015.

## Licença

Este projeto é desenvolvido como trabalho acadêmico e está sujeito às políticas da instituição de ensino.
