# Testes - Sistema de Gestão de Projetos Ágeis

## Visão Geral dos Testes

O sistema de testes do backend implementa uma estratégia abrangente de testing que segue as melhores práticas descritas por Kent Beck em "Test-Driven Development: By Example" (2002) e Gerard Meszaros em "xUnit Test Patterns" (2007). Os testes são organizados utilizando arquivos HTTP para testes de API, uma abordagem moderna que permite testar endpoints de forma isolada, documentar o comportamento esperado da API e facilitar a execução de testes manuais e automatizados.

## Estratégia de Testing

### Testes de API com Arquivos HTTP

O sistema implementa testes de API utilizando arquivos HTTP (.http), uma abordagem inovadora que combina documentação e testes em um único formato. Esta estratégia, conforme descrita por Roy Osherove em "The Art of Unit Testing" (2009), oferece vantagens significativas sobre abordagens tradicionais de testing.

**Documentação Viva**: Os arquivos de teste servem como documentação viva da API, demonstrando como utilizar cada endpoint e quais respostas esperar. Esta abordagem garante que a documentação esteja sempre atualizada e sincronizada com a implementação real.

**Testes Isolados**: Cada endpoint é testado de forma isolada, permitindo identificar problemas específicos sem interferência de outros componentes. Esta abordagem facilita debugging e manutenção dos testes.

**Execução Manual e Automatizada**: Os arquivos HTTP podem ser executados manualmente através de IDEs como VS Code ou IntelliJ IDEA, ou automatizados através de ferramentas como REST Client ou Newman. Esta flexibilidade permite diferentes abordagens de testing conforme necessário.

**Versionamento de Testes**: Os arquivos de teste são versionados junto com o código, garantindo que mudanças na API sejam acompanhadas por mudanças nos testes. Esta abordagem facilita rastreamento de mudanças e rollback de funcionalidades.

### Cobertura de Testes

O sistema implementa cobertura completa de testes para todos os endpoints da API, seguindo o princípio de "test everything that could possibly break" descrito por Michael Feathers em "Working Effectively with Legacy Code" (2004).

**Testes CRUD**: Todos os endpoints CRUD (Create, Read, Update, Delete) são testados para cada entidade do sistema, incluindo casos de sucesso e erro. Esta cobertura garante que operações básicas funcionem corretamente.

**Testes de Negócio**: Endpoints específicos do domínio são testados para garantir que regras de negócio sejam aplicadas corretamente. Estes testes incluem validações complexas e operações que envolvem múltiplas entidades.

**Testes de Autenticação**: Endpoints protegidos são testados para garantir que autenticação e autorização funcionem corretamente. Estes testes incluem casos de token válido, token inválido e token expirado.

**Testes de Validação**: Endpoints que recebem dados de entrada são testados para garantir que validação funcione corretamente. Estes testes incluem casos de dados válidos, dados inválidos e dados malformados.

## Estrutura dos Testes

### Organização por Entidade

Os testes são organizados por entidade do sistema, seguindo a estrutura de domínio implementada no backend. Esta organização facilita localização de testes e manutenção.

**Arquivos por Entidade**: Cada entidade possui seu próprio arquivo de teste (users.http, projects.http, teams.http, etc.), facilitando navegação e manutenção dos testes.

**Testes Sequenciais**: Os testes dentro de cada arquivo são organizados sequencialmente, seguindo o fluxo natural de operações (criar, ler, atualizar, deletar).

**Dependências entre Testes**: Testes que dependem de outros testes (como testes de relacionamento) são organizados de forma que dependências sejam criadas antes do uso.

### Configuração de Ambiente

O sistema implementa configuração de ambiente para testes que permite execução em diferentes contextos, seguindo as práticas descritas por Jez Humble e David Farley em "Continuous Delivery" (2010).

**Variáveis de Ambiente**: Configuração através de arquivo http-client.env.json que define variáveis como base URL, tokens de autenticação e dados de teste.

**Ambientes Separados**: Configuração para diferentes ambientes (desenvolvimento, teste, produção) permitindo execução de testes em contextos apropriados.

**Dados de Teste**: Definição de dados de teste consistentes que podem ser reutilizados em diferentes testes, facilitando manutenção e garantindo consistência.

## Testes Implementados

### Testes de Usuários (users.http)

O arquivo users.http implementa testes completos para a entidade User, incluindo operações CRUD básicas e funcionalidades específicas do domínio.

**Testes CRUD**: Implementado testes para criação, leitura, atualização e exclusão de usuários, incluindo validação de dados e tratamento de erros.

**Testes de Autenticação**: Implementado testes para login e logout de usuários, incluindo validação de credenciais e geração de tokens JWT.

**Testes de Relacionamento**: Implementado testes para consulta de projetos e times associados a usuários, garantindo que relacionamentos funcionem corretamente.

**Testes de Validação**: Implementado testes para validação de dados de entrada, incluindo casos de email inválido, senha fraca e dados obrigatórios ausentes.

### Testes de Projetos (projects.http)

O arquivo projects.http implementa testes completos para a entidade Project, incluindo operações CRUD e funcionalidades específicas de gestão de projetos.

**Testes CRUD**: Implementado testes para criação, leitura, atualização e exclusão de projetos, incluindo validação de dados e tratamento de erros.

**Testes de Relacionamento**: Implementado testes para consulta de times, epics, user stories e tarefas associados a projetos, garantindo que relacionamentos hierárquicos funcionem corretamente.

**Testes de Configuração**: Implementado testes para configurações de projeto, incluindo criação, atualização e consulta de configurações específicas.

**Testes de Labels**: Implementado testes para gestão de labels de projeto, incluindo criação, atualização e exclusão de labels.

### Testes de Times (teams.http)

O arquivo teams.http implementa testes completos para a entidade Team, incluindo operações CRUD e funcionalidades de gestão de membros.

**Testes CRUD**: Implementado testes para criação, leitura, atualização e exclusão de times, incluindo validação de dados e tratamento de erros.

**Testes de Membros**: Implementado testes para gestão de membros de times, incluindo adição, remoção e consulta de membros.

**Testes de Relacionamento**: Implementado testes para consulta de projetos associados a times, garantindo que relacionamentos funcionem corretamente.

**Testes de Validação**: Implementado testes para validação de dados de entrada, incluindo casos de nome duplicado e dados obrigatórios ausentes.

### Testes de Sprints (sprints.http)

O arquivo sprints.http implementa testes completos para a entidade Sprint, incluindo operações CRUD e funcionalidades específicas de metodologia ágil.

**Testes CRUD**: Implementado testes para criação, leitura, atualização e exclusão de sprints, incluindo validação de datas e metas.

**Testes de Backlog**: Implementado testes para gestão de sprint backlog, incluindo adição e remoção de user stories do backlog.

**Testes de Métricas**: Implementado testes para consulta de métricas de sprint, garantindo que cálculos de performance funcionem corretamente.

**Testes de Validação**: Implementado testes para validação de datas de sprint, incluindo casos de datas inválidas e conflitos temporais.

### Testes de User Stories (userStories.http)

O arquivo userStories.http implementa testes completos para a entidade UserStory, incluindo operações CRUD e funcionalidades de priorização.

**Testes CRUD**: Implementado testes para criação, leitura, atualização e exclusão de user stories, incluindo validação de dados e tratamento de erros.

**Testes de Relacionamento**: Implementado testes para consulta de tarefas associadas a user stories, garantindo que decomposição hierárquica funcione corretamente.

**Testes de Priorização**: Implementado testes para atualização de prioridade de user stories, garantindo que ordenação funcione corretamente.

**Testes de Validação**: Implementado testes para validação de critérios de aceitação e estimativas, incluindo casos de dados inválidos.

### Testes de Tarefas (tasks.http)

O arquivo tasks.http implementa testes completos para a entidade Task, incluindo operações CRUD e funcionalidades de atribuição.

**Testes CRUD**: Implementado testes para criação, leitura, atualização e exclusão de tarefas, incluindo validação de dados e tratamento de erros.

**Testes de Atribuição**: Implementado testes para atribuição de tarefas a usuários específicos, garantindo que distribuição de trabalho funcione corretamente.

**Testes de Relacionamento**: Implementado testes para consulta de comentários e atividades associadas a tarefas, garantindo que colaboração funcione corretamente.

**Testes de Validação**: Implementado testes para validação de estimativas de tempo, incluindo casos de estimativas inválidas.

### Testes de Epics (epics.http)

O arquivo epics.http implementa testes completos para a entidade Epic, incluindo operações CRUD e funcionalidades de agrupamento.

**Testes CRUD**: Implementado testes para criação, leitura, atualização e exclusão de epics, incluindo validação de dados e tratamento de erros.

**Testes de Relacionamento**: Implementado testes para consulta de user stories associadas a epics, garantindo que agrupamento lógico funcione corretamente.

**Testes de Priorização**: Implementado testes para atualização de prioridade de epics, garantindo que ordenação funcione corretamente.

**Testes de Validação**: Implementado testes para validação de dados de entrada, incluindo casos de nome duplicado e dados obrigatórios ausentes.

### Testes de Comentários (comments.http)

O arquivo comments.http implementa testes completos para a entidade Comment, incluindo operações CRUD e funcionalidades de colaboração.

**Testes CRUD**: Implementado testes para criação, leitura, atualização e exclusão de comentários, incluindo validação de dados e tratamento de erros.

**Testes de Threading**: Implementado testes para comentários aninhados, garantindo que discussões organizadas funcionem corretamente.

**Testes de Relacionamento**: Implementado testes para comentários em diferentes entidades (user stories, tarefas, sprints), garantindo que colaboração funcione corretamente.

**Testes de Validação**: Implementado testes para validação de conteúdo de comentários, incluindo casos de conteúdo vazio e muito longo.

### Testes de Atividades (activities.http)

O arquivo activities.http implementa testes completos para a entidade Activity, incluindo operações CRUD e funcionalidades de auditoria.

**Testes CRUD**: Implementado testes para criação, leitura, atualização e exclusão de atividades, incluindo validação de dados e tratamento de erros.

**Testes de Auditoria**: Implementado testes para consulta de atividades por usuário e projeto, garantindo que rastreamento funcione corretamente.

**Testes de Contexto**: Implementado testes para atividades com contexto completo (valores antigos e novos), garantindo que auditoria seja detalhada.

**Testes de Validação**: Implementado testes para validação de dados de atividade, incluindo casos de ação inválida e entidade inexistente.

### Testes de Tenants (tenants.http)

O arquivo tenants.http implementa testes completos para a entidade Tenant, incluindo operações CRUD e funcionalidades de multi-tenancy.

**Testes CRUD**: Implementado testes para criação, leitura, atualização e exclusão de tenants, incluindo validação de dados e tratamento de erros.

**Testes de Isolamento**: Implementado testes para garantir que dados de diferentes tenants sejam isolados corretamente.

**Testes de Validação**: Implementado testes para validação de slug único e dados obrigatórios, incluindo casos de slug duplicado.

## Execução dos Testes

### Execução Manual

Os testes podem ser executados manualmente através de IDEs que suportam arquivos HTTP, seguindo as práticas descritas por James Shore em "The Art of Agile Development" (2007).

**VS Code**: Utilizando a extensão REST Client, que permite execução direta de requisições HTTP e visualização de respostas.

**IntelliJ IDEA**: Utilizando a funcionalidade HTTP Client integrada, que oferece execução, debugging e histórico de requisições.

**Outras IDEs**: Qualquer IDE que suporte arquivos HTTP pode ser utilizada para execução dos testes.

### Execução Automatizada

Os testes podem ser automatizados através de ferramentas especializadas, seguindo as práticas de Continuous Integration descritas por Martin Fowler em "Continuous Integration" (2006).

**REST Client**: Ferramenta de linha de comando que permite execução automatizada de arquivos HTTP em pipelines de CI/CD.

**Newman**: Ferramenta de linha de comando do Postman que permite execução de coleções de testes em ambientes automatizados.

**Scripts Customizados**: Scripts personalizados que utilizam ferramentas como curl ou wget para execução automatizada de testes.

### Configuração de Ambiente

O sistema implementa configuração de ambiente que permite execução de testes em diferentes contextos.

**Arquivo de Configuração**: http-client.env.json define variáveis como base URL, tokens de autenticação e dados de teste.

**Ambientes Separados**: Configuração para diferentes ambientes (desenvolvimento, teste, produção) permitindo execução apropriada.

**Dados de Teste**: Definição de dados de teste consistentes que podem ser reutilizados em diferentes testes.

## Boas Práticas Implementadas

### Nomenclatura e Organização

O sistema implementa nomenclatura e organização consistentes para facilitar manutenção e compreensão dos testes.

**Nomenclatura Descritiva**: Nomes de testes descritivos que explicam claramente o que está sendo testado e qual resultado é esperado.

**Organização Lógica**: Testes organizados logicamente seguindo o fluxo natural de operações e relacionamentos entre entidades.

**Comentários Explicativos**: Comentários em cada teste explicando o propósito e contexto da operação sendo testada.

### Dados de Teste

O sistema implementa estratégia consistente para dados de teste que garante reprodutibilidade e isolamento.

**Dados Consistentes**: Dados de teste consistentes que podem ser reutilizados em diferentes testes, facilitando manutenção.

**Isolamento de Dados**: Cada teste utiliza dados isolados para evitar interferência entre testes e garantir reprodutibilidade.

**Limpeza de Dados**: Estratégia para limpeza de dados após execução de testes, garantindo que ambiente de teste permaneça limpo.

### Tratamento de Erros

O sistema implementa tratamento de erros consistente que garante que problemas sejam identificados e documentados adequadamente.

**Testes de Erro**: Testes específicos para casos de erro, garantindo que sistema responda adequadamente a situações problemáticas.

**Validação de Respostas**: Validação de respostas de erro para garantir que mensagens sejam apropriadas e códigos de status sejam corretos.

**Documentação de Erros**: Documentação de erros esperados e como sistema deve responder a diferentes tipos de problema.

## Integração com Desenvolvimento

### Test-Driven Development

O sistema de testes suporta práticas de Test-Driven Development (TDD), conforme descrito por Kent Beck em "Test-Driven Development: By Example".

**Red-Green-Refactor**: Ciclo TDD implementado através de testes que definem comportamento esperado antes da implementação.

**Documentação de Requisitos**: Testes servem como documentação de requisitos, garantindo que implementação atenda às expectativas.

**Feedback Rápido**: Execução rápida de testes fornece feedback imediato sobre qualidade da implementação.

### Continuous Integration

O sistema de testes integra-se com práticas de Continuous Integration, seguindo as práticas descritas por Jez Humble e David Farley.

**Execução Automatizada**: Testes executados automaticamente em pipelines de CI/CD para garantir qualidade contínua.

**Gate de Qualidade**: Testes servem como gate de qualidade, impedindo deploy de código que não passe nos testes.

**Feedback Contínuo**: Resultados de testes fornecem feedback contínuo sobre saúde do sistema.

## Monitoramento e Relatórios

### Relatórios de Teste

O sistema implementa relatórios de teste que fornecem visibilidade sobre cobertura e qualidade dos testes.

**Cobertura de Endpoints**: Relatórios que mostram quais endpoints estão cobertos por testes e quais precisam de atenção.

**Taxa de Sucesso**: Métricas de taxa de sucesso dos testes, identificando tendências e problemas recorrentes.

**Tempo de Execução**: Métricas de tempo de execução dos testes, identificando gargalos e oportunidades de otimização.

### Análise de Tendências

O sistema implementa análise de tendências que permite identificar padrões e melhorar continuamente a qualidade dos testes.

**Histórico de Falhas**: Análise de histórico de falhas de testes, identificando problemas recorrentes e oportunidades de melhoria.

**Padrões de Uso**: Análise de padrões de uso dos endpoints, identificando quais funcionalidades são mais utilizadas e precisam de mais atenção.

**Feedback de Desenvolvedores**: Coleta de feedback de desenvolvedores sobre qualidade e utilidade dos testes.

## Conclusão

O sistema de testes do backend implementa uma estratégia abrangente e moderna de testing que combina documentação viva, testes isolados e execução flexível. A abordagem utilizando arquivos HTTP oferece vantagens significativas sobre métodos tradicionais, incluindo documentação sempre atualizada, testes isolados e flexibilidade de execução.

A cobertura completa de testes garante que todos os endpoints da API sejam testados adequadamente, incluindo casos de sucesso e erro. A organização por entidade facilita manutenção e navegação dos testes, enquanto a configuração de ambiente permite execução em diferentes contextos.

O sistema de testes integra-se perfeitamente com práticas modernas de desenvolvimento como Test-Driven Development e Continuous Integration, fornecendo feedback rápido e garantindo qualidade contínua. A implementação de boas práticas como nomenclatura consistente, dados isolados e tratamento de erros garante que os testes sejam confiáveis e manuteníveis.

## Referências Bibliográficas

1. Beck, Kent. "Test-Driven Development: By Example." Addison-Wesley, 2002.
2. Meszaros, Gerard. "xUnit Test Patterns: Refactoring Test Code." Addison-Wesley, 2007.
3. Osherove, Roy. "The Art of Unit Testing: With Examples in .NET." Manning, 2009.
4. Feathers, Michael. "Working Effectively with Legacy Code." Prentice Hall, 2004.
5. Humble, Jez; Farley, David. "Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation." Addison-Wesley, 2010.
6. Shore, James. "The Art of Agile Development." O'Reilly Media, 2007.
7. Fowler, Martin. "Continuous Integration." 2006.
8. REST Client Team. "REST Client Documentation." 2023.
9. Postman Team. "Newman Documentation." 2023.
10. VS Code Team. "VS Code REST Client Extension Documentation." 2023.

## Licença

Este projeto é desenvolvido como trabalho acadêmico e está sujeito às políticas da instituição de ensino.
