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
- **Documentação com Swagger**: Documentação interativa da API disponível em `/api`.
- **Banco de Dados em Memória**: Configuração simplificada com repositório em memória.
- **Validação e Tratamento de Erros**: Validação de entrada com `class-validator` e tratamento de erros consistente.
- **Testes Automatizados**: Testes unitários e de ponta a ponta com Mocha e Chai.
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

## Testes

Execute os testes:

```bash
$ docker compose run app sh -c "npm run test"
```
