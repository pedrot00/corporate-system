-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('FUNCIONARIO', 'GESTOR', 'COMPRAS', 'ADMIN');

-- CreateEnum
CREATE TYPE "Prioridade" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- CreateEnum
CREATE TYPE "EstadoSolicitacao" AS ENUM ('PENDENTE', 'APROVADA', 'REJEITADA', 'SOLICITACAO_REENVIADA', 'EM_COMPRA', 'FINALIZADA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "perfil" "Perfil" NOT NULL DEFAULT 'FUNCIONARIO',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitacoes" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor_estimado" DECIMAL(10,2) NOT NULL,
    "categoria" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "prioridade" "Prioridade" NOT NULL DEFAULT 'BAIXA',
    "estado" "EstadoSolicitacao" NOT NULL DEFAULT 'PENDENTE',
    "solicitante_id" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_solicitacoes" (
    "id" SERIAL NOT NULL,
    "solicitacao_id" INTEGER NOT NULL,
    "usuario_id" INTEGER,
    "estado_anterior" "EstadoSolicitacao",
    "novo_estado" "EstadoSolicitacao" NOT NULL,
    "observacao" TEXT,
    "data_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_solicitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_solicitante_id_fkey" FOREIGN KEY ("solicitante_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_solicitacoes" ADD CONSTRAINT "historico_solicitacoes_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_solicitacoes" ADD CONSTRAINT "historico_solicitacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
