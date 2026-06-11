# expense-tracker-api

API RESTful para o **Mini Organizador de Gastos Financeiros**.

**Stack:** Node.js · Express · TypeScript · Supabase

---

## 1. Setup do Supabase

Acesse o **SQL Editor** do seu projeto Supabase e execute:

```sql
CREATE TABLE expenses (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  amount      DECIMAL(10,2) NOT NULL,
  category    VARCHAR(100) NOT NULL,
  date        DATE NOT NULL,
  description TEXT,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 2. Instalação

```bash
git clone <url-do-repo>
cd expense-tracker-api
npm install
```

---

## 3. Configuração

```bash
cp .env.example .env
```

Preencha o `.env`:

```env
PORT=3000
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua-service-role-key
```

> As chaves ficam em: **Supabase → Project Settings → API → service_role**

---

## 4. Execução

```bash
# Desenvolvimento (hot reload)
npm run dev

# Produção
npm run build
npm start
```

---

## 5. Endpoints

| Método   | Rota                  | Descrição             |
|----------|-----------------------|-----------------------|
| `GET`    | `/api/expenses`       | Lista todos os gastos |
| `GET`    | `/api/expenses/:id`   | Busca gasto por ID    |
| `POST`   | `/api/expenses`       | Cria novo gasto       |
| `PUT`    | `/api/expenses/:id`   | Atualiza gasto        |
| `DELETE` | `/api/expenses/:id`   | Remove gasto          |
| `GET`    | `/health`             | Health check          |

### Payload (POST / PUT)

```json
{
  "title": "Almoço",
  "amount": 45.90,
  "category": "alimentação",
  "date": "2024-11-15",
  "description": "Restaurante centro"
}
```

### Categorias válidas

`alimentação` · `transporte` · `lazer` · `saúde` · `moradia` · `outros`

---

## 6. Estrutura

```
src/
├── config/
│   └── supabase.ts        # cliente Supabase
├── controllers/
│   └── expenseController.ts
├── models/
│   └── expense.ts         # tipos / interfaces
├── routes/
│   └── expenseRoutes.ts
└── server.ts
```
