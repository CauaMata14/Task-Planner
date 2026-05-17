# Configuração do Banco de Dados PostgreSQL

O Docker não está disponível no seu sistema. Escolha uma das opções abaixo para configurar o PostgreSQL:

## Opção 1: PostgreSQL Local (Recomendado para Desenvolvimento)

### Windows

1. **Baixe e instale PostgreSQL**
   - Acesse: https://www.postgresql.org/download/windows/
   - Baixe a versão mais recente (15 ou 16)
   - Execute o instalador
   - Anote a senha que você definir para o usuário `postgres`

2. **Crie o banco de dados**
   ```powershell
   # Abra o SQL Shell (psql) do menu iniciar
   # Entre com a senha do postgres
   CREATE DATABASE taskplanner;
   \q
   ```

3. **Atualize o .env**
   ```env
   DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/taskplanner"
   ```

4. **Execute as migrations**
   ```bash
   npx prisma migrate dev --schema apps/api/prisma/schema.prisma --name init
   ```

## Opção 2: Supabase (Cloud - Gratuito)

1. **Crie uma conta no Supabase**
   - Acesse: https://supabase.com
   - Clique em "Start your project"
   - Crie um projeto novo

2. **Obtenha a connection string**
   - Vá em Settings > Database
   - Copie a "Connection string" (URI)
   - Substitua `[YOUR-PASSWORD]` pela senha que você definiu

3. **Atualize o .env**
   ```env
   DATABASE_URL="postgresql://postgres:[SUA_SENHA]@db.[SEU-PROJETO-REF].supabase.co:5432/postgres"
   ```

4. **Execute as migrations**
   ```bash
   npx prisma migrate dev --schema apps/api/prisma/schema.prisma --name init
   ```

## Opção 3: Railway (Cloud - Gratuito)

1. **Crie uma conta no Railway**
   - Acesse: https://railway.app
   - Clique em "New Project"
   - Selecione "Provision PostgreSQL"

2. **Obtenha a connection string**
   - Clique no projeto PostgreSQL
   - Vá em "Variables"
   - Copie a `DATABASE_URL`

3. **Atualize o .env**
   ```env
   DATABASE_URL="postgresql://postgres:[SUA_SENHA]@[SEU-PROJETO].railway.app:5432/railway"
   ```

4. **Execute as migrations**
   ```bash
   npx prisma migrate dev --schema apps/api/prisma/schema.prisma --name init
   ```

## Após Configurar o Banco de Dados

Execute os seguintes comandos:

```bash
# Gerar o Prisma Client
npx prisma generate --schema apps/api/prisma/schema.prisma

# Executar migrations (criar tabelas)
npx prisma migrate dev --schema apps/api/prisma/schema.prisma --name init

# (Opcional) Popular com dados de teste
npx prisma db seed --schema apps/api/prisma/schema.prisma
```

## Verificar Conexão

Para verificar se a conexão está funcionando:

```bash
npx prisma studio --schema apps/api/prisma/schema.prisma
```

Isso abrirá uma interface visual no navegador para visualizar e editar os dados do banco.
