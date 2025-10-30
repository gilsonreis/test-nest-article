# Test News API

API construída com NestJS e MySQL, organizada em módulos de autenticação, usuários e artigos, com autorização baseada em permissões e documentação via Swagger.

## Visão Geral

- Framework: NestJS 11 (Node 20)
- Banco: MySQL 8
- ORM: TypeORM 0.3
- Autenticação: JWT Bearer
- Autorização: Permissions Guard + RequirePermissions
- Documentação: Swagger (`/docs`)
- Testes: Jest (unitários e e2e)
- Docker: `Dockerfile` + `docker-compose.yml`

## Arquitetura

- Módulos
  - `auth`: login e registro.
  - `users`: CRUD de usuários.
  - `articles`: CRUD de artigos e listagem por usuário.
  - `permissions`: guard e decorator para autorização por permissão.
  - `commons`: helpers, config TypeORM, guards JWT.

- Padrão de organização
  - Actions (Controllers): `app/<modulo>/actions/*.action.ts`
  - UseCases (Regras de negócio): `app/<modulo>/use-cases/*.use-case.ts`
  - DTOs: `app/<modulo>/dto/input|output/*.ts`
  - Repositórios (Interfaces e implementações): `app/<modulo>/repositories/*.ts`

- Autorização por permissões
  - `RequirePermissions('...')`: define metadados exigidos na rota.
  - `PermissionsGuard`: valida permissões do usuário conforme o papel (role).

- Justificativa e benefícios da arquitetura

  - SOLID
    - Single Responsibility Principle (SRP): 
      - Actions cuidam de protocolo/HTTP e validação superficial da requisição.
      - UseCases concentram a lógica de negócio, sem dependências de framework.
      - Repositories isolam acesso a dados/persistência.
      - Resultado: cada classe faz uma coisa bem definida e é mais fácil de testar e evoluir.
    - Open/Closed Principle (OCP):
      - Novos endpoints e regras são adicionados criando novas Actions/UseCases e implementações de Repositories, sem modificar as existentes.
      - Amplia funcionalidades sem quebrar o que já está funcionando.
    - Dependency Inversion Principle (DIP):
      - UseCases dependem de abstrações (`Repositories`) e não de implementações concretas (TypeORM).
      - Facilita troca de tecnologia de persistência e simplifica testes via mocks.

  - Clean Architecture
    - Independência de detalhes:
      - UseCases são o núcleo da aplicação e não dependem de Nest, Express ou TypeORM.
      - Actions (controllers) e TypeORM são “detalhes” de implementação, plugados nas bordas.
    - Boundaries bem definidos:
      - Fluxo: `Action` → `UseCase` → `Repository (interface)` → `Repository TypeORM (implementação)`.
      - Depêndencias sempre apontam para dentro (para as regras), protegendo a regra de negócio.
    - Facilidade de teste:
      - UseCases testados com mocks de `Repositories`.
      - Actions testadas isolando transporte (HTTP) e guards/autorização.

  - Object Calisthenics
    - Pequenas classes e métodos focados (baixa complexidade por unidade).
    - Alta coesão, baixo acoplamento:
      - Cada Action trata apenas um endpoint.
      - Cada UseCase resolve um caso de uso específico.
      - Repositories expõem operações pequenas e explícitas.
    - Composição sobre herança:
      - Preferência por injeção de dependências (DI) e instâncias colaboradoras.
    - Nomes significativos e objetos pequenos:
      - DTOs claros, separação entre entrada e saída.
      - Evita “God classes” e facilita refatoração incremental.

  - Benefícios práticos
    - Testabilidade superior: mocks simples, cobertura alta sem configurar infraestrutura.
    - Manutenibilidade e escalabilidade: adicionar regras/endpoints com impacto mínimo.
    - Portabilidade de infraestrutura: possível trocar MySQL/TypeORM sem tocar na regra de negócio.
    - Segurança consistente: autorização via guard e decorator, aplicado sistematicamente nas Actions.

## Funcionalidades

- Auth
  - `POST /auth/login`: retorna `accessToken` (JWT). Use `Authorization: Bearer <token>` nas rotas protegidas.
  - `POST /auth/register`: cria novo usuário (admin/editor/reader).
- Users
  - `GET /users`: lista usuários com paginação e `search`.
  - `GET /users/{id}`: detalha usuário.
  - `POST /users`: cria usuário.
  - `PUT /users/{id}`: atualiza usuário.
  - `DELETE /users/{id}`: remove usuário.
- Articles
  - `GET /articles`: lista artigos com paginação e `search` (LIKE em título e FULLTEXT em conteúdo).
  - `GET /articles/{id}`: detalha artigo.
  - `POST /articles`: cria artigo.
  - `PUT /articles/{id}`: atualiza artigo.
  - `DELETE /articles/{id}`: remove artigo.
  - `GET /users/{userId}/articles`: lista artigos pertencentes ao usuário.
- Paginação
  - Parâmetros: `page` e `_perPage`.
  - Padrões: `page=1`, `_perPage=15`.
- Permissões seedadas
  - `articles:create`, `articles:read`, `articles:update`, `articles:delete`, `articles:read_by_user`.
- Regras por papel (seed)
  - `admin`: todas permissões de artigos.
  - `editor`: criar, ler, atualizar e ler por usuário.
  - `reader`: ler e ler por usuário.
- Usuários seedados
  - Admin: `admin@example.com` / `secret123`
  - Editor: `editor@example.com` / `secret123`
  - Reader: `reader@example.com` / `secret123`

## Instalação (Docker)

1) Copie o arquivo de ambiente:
- `cp .env.dist .env`

2) Ajuste variáveis de ambiente conforme necessário:
- `PORT=3000`
- `DB_HOST=db` (dentro do container; para IDE use `localhost`)
- `DB_PORT=3306`
- `DB_USERNAME=user`
- `DB_PASSWORD=secret`
- `DB_DATABASE=articles_db`
- `JWT_SECRET=dev-secret`
- `JWT_EXPIRATION=86400` (em segundos; manter valor numérico)

3) Suba os containers:
- `docker compose up -d --build`

4) Conecte à base (IDE externa, exemplo: DBeaver, TablePlus, MySQL Workbench)
- Host: `localhost`
- Porta: `3306`
- Usuário: `user`
- Senha: `secret`
- Database: `articles_db`

Obs.: Dentro do container `app`, o host do banco é `db` (rede interna do Docker).

## Migrations e Seeds (dentro do container)

1) Acesse o container da aplicação:
- `docker compose exec app sh`

2) Execute as migrations:
- `npm run migration:run`

3) Execute os seeds:
- `npm run db:seed`

Opcionalmente, pode rodar os comandos direto no container do docker, adicionando `docker compose exec app` antes de cada comando. 
- `docker compose exec app npm run migration:run`
- `docker compose exec app npm run db:seed`

Ordem de seeds (automática via `src/database/seeds/index.ts`):
- Permissions → Roles → Permissions por Role → Users → Articles

## Testes
- Para executar os testes, execute no terminal:
  - `docker compose exec app npm test`

## Swagger

- Acesse: `http://localhost:3000/docs`
- Agrupamento por tags:
  - `Auth`
  - `User`
  - `Article`
- Autenticação no Swagger:
  - Clique em “Authorize”
  - Informe `Bearer <token>` (faça login em `POST /auth/login` para obter o token).
- Observação: a UI está configurada com `persistAuthorization` ligado.

## Coleção Postman

- Há uma coleção de endpoints para Postman prevista na raiz do projeto (arquivo `.json` de coleção). Importe-a no Postman (menu “Import”) para testar os endpoints rapidamente.
- Caso não encontre a coleção, você pode usar o Swagger para explorar os endpoints e montar sua própria collection.

## Observações e Dicas

- JWT: `JWT_EXPIRATION` deve ser numérico (segundos). Ex.: `86400`.
- Banco: se quiser limpar dados de desenvolvimento, pare os containers e remova o volume local do MySQL mapeado em `docker-compose.yml`.
- Query de artigos: utiliza `LIKE` em título e FULLTEXT (`MATCH ... AGAINST`) em conteúdo.
- Padrão Actions + UseCases: promove testabilidade e evolução sem acoplamento.
