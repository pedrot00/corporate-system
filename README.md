# 📦 Sistema de Gestão de Solicitações e Compras Corporativas


![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)


Plataforma full-stack para automação e controle de fluxo de solicitações de compras corporativas. O sistema substitui processos manuais por um fluxo auditável de aprovações com métricas em tempo real, controle de acesso baseado em papéis (RBAC) e interface adaptável a qualquer dispositivo.

🚀 **[Clique aqui para acessar o sistema em Produção](https://corporate-system-frontend.vercel.app/login)**

---

## 📱 Visualização do Sistema & Design Responsivo

A interface foi projetada do zero focado na experiência do usuário (UX/UI), garantindo navegação fluida tanto em monitores ultrawide quanto em smartphones.

### 1. Dashboard Analítico
Exibição de KPIs operacionais, volume por departamento, solicitações por prioridade e acompanhamento do fluxo de compras.

| Desktop | Mobile |
| :---: | :---: |
| ![Dashboard Desktop](https://github.com/pedrot00/corporate-system/blob/main/frontend/public/dashboard_desktop.png) | ![Dashboard Mobile](https://github.com/pedrot00/corporate-system/blob/main/frontend/public/dashboard_mobile.png) |


### 2. Relatórios e Métricas Detalhadas
Geração de relatórios consolidados com filtros avançados por período, departamento e categoria, otimizados para análise gerencial e acompanhamento financeiro.


| Desktop | Mobile |
| :---: | :---: |
| ![Relatorios Desktop](https://github.com/pedrot00/corporate-system/blob/main/frontend/public/relatorio_desktop.png) | ![Relatorios Mobile](https://github.com/pedrot00/corporate-system/blob/main/frontend/public/relatorio_mobile.png) |


### 3. Fluxo e Aprovações de Solicitações
Tabela dinâmica com filtros avançados, suporte a busca em tempo real e visualização em cards responsivos em telas menores.

| Desktop | Mobile |
| :---: | :---: |
| ![Solicitacoes Desktop](https://github.com/pedrot00/corporate-system/blob/main/frontend/public/solicitacoes_desktop.png) | ![Solicitacoes Mobile](https://github.com/pedrot00/corporate-system/blob/main/frontend/public/solicitacoes_mobile.png) |

---

## ⚙️ Regras de Negócio e Funcionalidades

*   **Máquina de Estados Finita para Solicitações:** Transições auditadas e restritas via backend (`PENDENTE` ➔ `APROVADA` / `REJEITADA` ➔ `EM_COMPRA` ➔ `FINALIZADA`).
*   **Controle de Acesso Baseado em Papéis (RBAC):**
    *   `FUNCIONARIO`: Apenas abre e acompanha suas próprias solicitações.
    *   `GESTOR`: Aprova ou rejeita solicitações do seu setor, altera o status para cotações e finalização de entregas. Gestão de dados e relatórios gerais.
    *   `ADMIN`: Acesso irrestrito a configurações de usuários
*   **Histórico e Auditoria:** Cada mudança de status ou edição gera um registro temporal imutável com justificativa, descrição, datação e responsável.
*   **Relatórios Dinâmicos:** Filtros combinados por data, departamento, prioridade e status do pedido.

---

## 🛠️ Stack Tecnológica e Arquitetura

### Frontend
*   **React.js (Vite):** Interface reativa com componentes modulares.
*   **Tailwind CSS / Styled Components:** Estilização responsiva nativa adaptada para Mobile & Desktop.
*   **Lucide React:** Iconografia leve e acessível.

### Backend & Banco de Dados
*   **Node.js & Express:** API RESTful modularizada com validações de middleware.
*   **Prisma ORM:** Mapeamento objeto-relacional com suporte nativo a TypeScript/JavaScript, migrações e *Driver Adapters*.
*   **PostgreSQL (NeonDB):** Banco de dados relacional em nuvem com arquitetura *Serverless*.
*   **JWT & Bcrypt:** Autenticação segura via Tokens HTTP Bearer e hashing de senhas.

### Infraestrutura & Deploy
*   **Vercel Serverless Functions:** Backend distribuído em arquitetura sem servidor para alta escala.

---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos

- **Node.js** v18 ou superior instalado.
- Instância do **PostgreSQL** ou conta ativa no **NeonDB**.
- **Git** instalado.

### 1. Clonar o Repositório

```bash
git clone https://github.com/pedrot00/corporate-system.git
cd corporate-system
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` dentro do diretório `backend` com o seguinte conteúdo:

```env
DATABASE_URL="postgresql://usuario:senha@seu-host-neon.tech/neondb?sslmode=require"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3000
```

> ⚠️ **Atenção:** substitua `usuario`, `senha` e `seu-host-neon.tech` pelos dados reais da sua instância PostgreSQL/NeonDB. O `JWT_SECRET` deve ser uma string longa e aleatória.

### 3. Instalar Dependências do Backend

```bash
cd backend
npm install
```

### 4. Configurar o Banco de Dados

Aplique a estrutura de tabelas definida no schema do Prisma:

```bash
npx prisma db push
```

### 5. Popular o Banco com Dados de Teste (Seed)

O script de seed cria **6 usuários de teste** (um para cada papel) e **80 solicitações parametrizadas** para facilitar a validação das regras de negócio:

```bash
node prisma/seed.js
```

### 6. Iniciar o Backend

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

### 7. Instalar Dependências e Iniciar o Frontend

Em outro terminal, a partir da raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173` (porta padrão do Vite).

---

## 🔐 Usuários de Teste

Após rodar o seed, utilize as credenciais abaixo para testar cada nível de acesso:

| Papel | E-mail | Senha |
| :--- | :--- | :--- |
| `FUNCIONARIO` | funcionario@teste.com | `123456` |
| `GESTOR` | gestor@teste.com | `123456` |
| `ADMIN` | admin@teste.com | `123456` |

> 💡 Ajuste os e-mails e senhas conforme definido no seu `prisma/seed.js`.

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 👤 Autor

**Pedro T.** — [GitHub](https://github.com/pedrot00)

Se este projeto te ajudou de alguma forma, considere deixar uma ⭐ no repositório!
