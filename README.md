# 📦 Sistema de Gestão de Solicitações e Compras Corporativas

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
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
| ![Dashboard Desktop](/frontend/public/dashboard_desktop.PNG) | ![Dashboard Mobile](./docs/dashboard-mobile.png) |

### 2. Fluxo e Aprovações de Solicitações
Tabela dinâmica com filtros avançados, suporte a busca em tempo real e visualização em cards responsivos em telas menores.

| Desktop | Mobile |
| :---: | :---: |
| ![Solicitacoes Desktop](./docs/solicitacoes-desktop.png) | ![Solicitacoes Mobile](./docs/solicitacoes-mobile.png) |

---

## ⚙️ Regras de Negócio e Funcionalidades

*   **Máquina de Estados Finita para Solicitações:** Transições auditadas e restritas via backend (`PENDENTE` ➔ `APROVADA` / `REJEITADA` ➔ `EM_COMPRA` ➔ `FINALIZADA`).
*   **Controle de Acesso Baseado em Papéis (RBAC):**
    *   `FUNCIONARIO`: Apenas abre e acompanha suas próprias solicitações.
    *   `GESTOR`: Aprova ou rejeita solicitações do seu setor.
    *   `COMPRAS`: Altera o status para cotações e finalização de entregas.
    *   `ADMIN`: Acesso irrestrito a configurações, dados e relatórios gerais.
*   **Histórico e Auditoria:** Cada mudança de status ou edição gera um registro temporal imutável com justificativa e responsável.
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
*   **Node.js** v18 ou superior instalado.
*   Instância do **PostgreSQL** ou conta ativa no **NeonDB**.

### 1. Clonar o Repositório
```bash
git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
cd seu-repositorio
