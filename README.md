# API REST CRUD de Veículos com NestJS

Uma API REST CRUD desenvolvida com o [framework NestJS](https://nestjs.com/), projetada para gerenciar dados de veículos de forma eficiente. O projeto utiliza TypeScript, Mocha, Chai, Swagger e Docker para testes, documentação e implantação.

---

## Estrutura do Projeto

```plaintext
src
├── vehicle
│   ├── __tests__            # Testes unitários e de ponta a ponta
│   ├── dto                  # Data Transfer Objects
│   ├── entities             # Definição da entidade Veículo
│   ├── repositories         # Interfaces e implementações do repositório
│   ├── vehicle.controller.ts # Endpoints da API
│   ├── vehicle.module.ts    # Módulo Veículo
│   └── vehicle.mapper.ts    # Utilitário para mapear entidades para DTOs
├── app.module.ts            # Módulo raiz
├── app.error.ts             # Tratamento de erros
└── main.ts                  # Ponto de entrada
```

---

## Funcionalidades

- **Operações CRUD**: Gerenciamento completo de veículos com funcionalidades de Criar, Ler, Atualizar e Deletar.
- **Paginação**: Suporte para paginação em listagens, com parâmetros de página e tamanho configuráveis.
- **Validação de Campos Únicos**: Verificação e tratamento de duplicação para campos como `chassis`, `placa` e `renavam`.
- **Documentação com Swagger**: Documentação interativa da API disponível em `/api`.
- **Banco de Dados em Memória**: Configuração simplificada com repositório em memória.
- **Validação e Tratamento de Erros**: Validação de entrada com `class-validator` e tratamento de erros consistente.
- **Testes Automatizados**: Testes unitários e de ponta a ponta com Mocha e Chai.
- **Cobertura de Testes**: Relatórios de cobertura detalhados com `nyc`.
- **Ambiente Dockerizado**: Configuração e execução simplificadas com Docker.

---

## Instalação

Clone o repositório e instale as dependências:

```bash
$ git clone https://github.com/JustAzul/nestjs-vehicle-crud-rest.git
$ cd nestjs-vehicle-crud-rest
$ npm ci
```

---

## Executando a Aplicação

### Usando Docker Compose

1. Inicie a aplicação:

   ```bash
   $ docker compose up
   ```

   O servidor estará acessível em: [http://localhost:3000](http://localhost:3000).

---

## Documentação da API

A documentação está disponível no Swagger. Acesse:

```
http://localhost:3000/api
```

### Screenshot

![Swagger Screenshot](https://github.com/user-attachments/assets/9f518e88-de3d-4fc3-880e-525be57b7bdc)

---

## Casos de Teste

### Executar Testes

```bash
$ docker compose run app sh -c "npm run test"
```

### Casos de Teste do `VehicleController (E2E)`

- **POST /vehicle**
  - ✔ Deve criar um novo veículo
  - ✔ Deve retornar erro se o veículo já existir
- **PUT /vehicle/:id**
  - ✔ Deve atualizar um veículo pelo ID
  - ✔ Deve retornar erro se o veículo não for encontrado
  - ✔ Deve retornar erro ao tentar atualizar campos únicos
- **GET /vehicle**
  - ✔ Deve retornar a primeira página de veículos
  - ✔ Deve retornar a segunda página de veículos
  - ✔ Deve retornar resultados da primeira página quando nenhuma consulta for fornecida
  - ✔ Deve retornar erro para valores inválidos de página ou tamanho de página
  - ✔ Deve retornar erro se a página solicitada exceder o máximo
- **GET /vehicle/:id**
  - ✔ Deve retornar um veículo pelo ID
  - ✔ Deve retornar erro se o veículo não for encontrado
- **DELETE /vehicle/:id**
  - ✔ Deve deletar um veículo pelo ID
  - ✔ Deve retornar sucesso ao deletar um veículo
  - ✔ Deve retornar erro se o veículo não for encontrado

### Casos de Teste do `InMemoryVehicleRepository`

- **Criar Veículos**
  - ✔ Deve criar um novo veículo
  - ✔ Deve retornar erro para campos únicos duplicados
- **Consulta por ID**
  - ✔ Deve retornar um veículo pelo ID
  - ✔ Deve retornar `null` para IDs inexistentes
- **Paginação**
  - ✔ Deve recuperar veículos com paginação
  - ✔ Deve retornar erro para paginação inválida
  - ✔ Deve retornar erro se a página solicitada exceder o máximo
- **Atualização**
  - ✔ Deve atualizar campos como `brand`, `chassis`, `model`, `plate`, e `renavam`
  - ✔ Deve retornar erro ao atualizar um veículo inexistente
  - ✔ Deve retornar erro ao tentar atualizar com valores duplicados
- **Deleção**
  - ✔ Deve deletar um veículo pelo ID
  - ✔ Deve retornar sucesso ao deletar
  - ✔ Deve retornar erro para veículos inexistentes

---

## Cobertura de Testes

A cobertura de testes está configurada com `nyc`. Abaixo está o resumo atual:

```plaintext
-------------------------------------|---------|----------|---------|---------|-------------------
File                                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------------------|---------|----------|---------|---------|-------------------
All files                            |       0 |        0 |       0 |       0 |
 src                                 |       0 |      100 |       0 |       0 |
  app.error.ts                       |       0 |      100 |       0 |       0 | 5-6
 src/vehicle                         |       0 |      100 |       0 |       0 |
  vehicle.mapper.ts                  |       0 |      100 |       0 |       0 | 6-18
 src/vehicle/constants               |       0 |      100 |       0 |       0 |
  errors.constants.ts                |       0 |      100 |       0 |       0 | 8-15
  module.contants.ts                 |       0 |      100 |     100 |       0 | 3-9
 src/vehicle/dto                     |       0 |        0 |       0 |       0 |
  update-vehicle-data.dto.ts         |       0 |        0 |       0 |       0 |
 src/vehicle/entities                |       0 |        0 |       0 |       0 |
  vehicle.entity.ts                  |       0 |        0 |       0 |       0 | 15-48
 src/vehicle/repositories            |       0 |        0 |       0 |       0 |
  in-memory.vehicle.repository.ts    |       0 |        0 |       0 |       0 | 15-160
 src/vehicle/repositories/interfaces |       0 |        0 |       0 |       0 |
  vehicle.repository.ts              |       0 |        0 |       0 |       0 |
-------------------------------------|---------|----------|---------|---------|-------------------
```

### Como Gerar o Relatório de Cobertura

Para gerar o relatório de cobertura localmente, use:

```bash
$ docker compose run app sh -c "npm run test:cov"
```

Os detalhes da cobertura serão exibidos no terminal.
