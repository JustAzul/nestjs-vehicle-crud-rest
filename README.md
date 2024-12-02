# API REST CRUD de Veículos com NestJS

Uma API REST CRUD desenvolvida com o [framework NestJS](https://nestjs.com/), projetada para gerenciar dados de veículos de forma eficiente. O projeto utiliza TypeScript, Mocha, Chai, Swagger e Docker para testes, documentação e implantação.

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
$ npm install
```

---

## Executando a Aplicação

### Usando Docker Compose

1. Construir e iniciar a aplicação:

   ```bash
   $ docker compose up
   ```

   O servidor estará acessível em: [http://localhost:3000](http://localhost:3000).

2. Executar testes:
   ```bash
   $ docker compose run app sh -c "npm run test"
   ```

---

## Documentação da API

A documentação da API está disponível no Swagger. Acesse:

```
http://localhost:3000/api
```

### Screenshot do Swagger

![image](https://github.com/user-attachments/assets/9f518e88-de3d-4fc3-880e-525be57b7bdc)

---

## Testes

Execute os testes unitários e de ponta a ponta:

```bash
# Executar testes unitários/ponta a ponta
$ docker compose run app sh -c "npm run test"
```

---

## Estrutura do Projeto

Aqui está uma visão geral das pastas e arquivos principais:

```plaintext
src
├── vehicle
│   ├── __tests__            # Testes unitários e de ponta a ponta
│   ├── dto                 # Data Transfer Objects
│   ├── entities            # Definição da entidade Veículo
│   ├── repositories        # Interfaces e implementações do repositório
│   ├── vehicle.controller.ts # Endpoints da API para veículos
│   ├── vehicle.module.ts    # Definição do módulo Veículo
│   └── vehicle.mapper.ts    # Utilitário para mapear entidades para DTOs
├── app.module.ts            # Módulo raiz da aplicação
├── app.error.ts             # Tratamento centralizado de erros
└── main.ts                  # Ponto de entrada da aplicação
```

---

## Deploy

Para implantar sua aplicação:

1. Construa a imagem Docker:

   ```bash
   docker compose build
   ```

2. Inicie a aplicação:
   ```bash
   docker compose up
   ```

---

## Autor

- **Diego (Azul) Ferreira**
- Email: [metalloger@gmail.com](mailto:metalloger@gmail.com)
