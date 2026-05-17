# Task Planner SaaS - Arquitetura Completa

## 📐 Visão Geral da Arquitetura

### Stack Tecnológica
- **Frontend**: Next.js 14 (App Router) + React 18 + TailwindCSS + shadcn/ui
- **Backend**: Next.js API Routes + Node.js
- **Banco de Dados**: PostgreSQL (Supabase)
- **Autenticação**: NextAuth.js (JWT)
- **Pagamentos**: Stripe
- **Deploy**: Vercel (Frontend) + Supabase (Database)

---

## 🗂️ Estrutura de Pastas

```
task-planner-saas/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── planner/
│   │   │   └── [date]/
│   │   │       └── page.tsx
│   │   ├── history/
│   │   │   └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── tasks/
│   │   │   └── route.ts
│   │   ├── appointments/
│   │   │   └── route.ts
│   │   ├── water/
│   │   │   └── route.ts
│   │   ├── finances/
│   │   │   └── route.ts
│   │   ├── goals/
│   │   │   └── route.ts
│   │   ├── mood/
│   │   │   └── route.ts
│   │   ├── notes/
│   │   │   └── route.ts
│   │   ├── weather/
│   │   │   └── route.ts
│   │   ├── planner/
│   │   │   └── route.ts
│   │   ├── export/
│   │   │   └── pdf/
│   │   │       └── route.ts
│   │   ├── stripe/
│   │   │   ├── checkout/
│   │   │   │   └── route.ts
│   │   │   └── webhook/
│   │   │       └── route.ts
│   │   └── subscription/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx (Landing Page)
│   └── globals.css
├── components/
│   ├── ui/ (shadcn/ui components)
│   ├── planner/
│   │   ├── PlannerGrid.tsx
│   │   ├── DateSelector.tsx
│   │   ├── TasksSection.tsx
│   │   ├── AppointmentsSection.tsx
│   │   ├── WaterTracker.tsx
│   │   ├── FinanceTracker.tsx
│   │   ├── GoalsSection.tsx
│   │   ├── MoodTracker.tsx
│   │   ├── WeatherWidget.tsx
│   │   ├── NotesSection.tsx
│   │   └── TomorrowPlan.tsx
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── ProductivityChart.tsx
│   │   └── StatsCards.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── pricing/
│   │   ├── PricingCard.tsx
│   │   └── FeaturesList.tsx
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/
│   ├── db.ts (PostgreSQL connection)
│   ├── auth.ts (NextAuth config)
│   ├── stripe.ts (Stripe config)
│   ├── utils.ts
│   └── validations.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── hooks/
│   ├── usePlanner.ts
│   ├── useTasks.ts
│   └── useSubscription.ts
├── types/
│   ├── planner.ts
│   ├── user.ts
│   └── subscription.ts
├── public/
│   ├── images/
│   └── icons/
├── middleware.ts
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## 🗄️ Schema do Banco de Dados (PostgreSQL)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  subscription  Subscription?
  planners      Planner[]
  tasks         Task[]
  appointments  Appointment[]
  waterIntakes  WaterIntake[]
  finances      Finance[]
  goals         Goal[]
  moods         Mood[]
  notes         Note[]
}

model Subscription {
  id              String    @id @default(cuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id])
  
  stripeCustomerId String?
  stripeSubscriptionId String?
  stripePriceId     String?
  status           String   // active, canceled, past_due
  
  planType         String   // free, premium
  currentPeriodEnd DateTime?
  
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}

model Planner {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  date        DateTime
  
  weather     String?
  temperature String?
  
  tasks       Task[]
  appointments Appointment[]
  waterIntakes WaterIntake[]
  finances     Finance[]
  goals        Goal[]
  moods        Mood[]
  notes        Note[]
  
  tomorrowPlan String?
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@unique([userId, date])
}

model Task {
  id          String   @id @default(cuid())
  plannerId   String
  planner     Planner  @relation(fields: [plannerId], references: [id])
  
  title       String
  description String?
  completed   Boolean  @default(false)
  priority    String   // low, medium, high
  order       Int
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Appointment {
  id          String   @id @default(cuid())
  plannerId   String
  planner     Planner  @relation(fields: [plannerId], references: [id])
  
  title       String
  time        String
  duration    Int?
  completed   Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model WaterIntake {
  id          String   @id @default(cuid())
  plannerId   String
  planner     Planner  @relation(fields: [plannerId], references: [id])
  
  amount      Int      // in ml
  time        DateTime
  
  createdAt   DateTime @default(now())
}

model Finance {
  id          String   @id @default(cuid())
  plannerId   String
  planner     Planner  @relation(fields: [plannerId], references: [id])
  
  type        String   // income, expense
  category    String
  amount      Float
  description String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Goal {
  id          String   @id @default(cuid())
  plannerId   String
  planner     Planner  @relation(fields: [plannerId], references: [id])
  
  title       String
  completed   Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Mood {
  id          String   @id @default(cuid())
  plannerId   String
  planner     Planner  @relation(fields: [plannerId], references: [id])
  
  mood        String   // happy, sad, neutral, anxious, productive
  note        String?
  time        DateTime
  
  createdAt   DateTime @default(now())
}

model Note {
  id          String   @id @default(cuid())
  plannerId   String
  planner     Planner  @relation(fields: [plannerId], references: [id])
  
  content     String
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🎨 Design System

### Cores
```css
/* Light Mode */
--background: #F8F8F5;
--surface: #FFFFFF;
--border: #E6DDD4;
--text-primary: #2D2D2D;
--text-secondary: #6B6B6B;
--accent: #8B7355;
--success: #4CAF50;
--warning: #FF9800;
--danger: #F44336;

/* Dark Mode */
--background: #1A1A1A;
--surface: #2D2D2D;
--border: #404040;
--text-primary: #FFFFFF;
--text-secondary: #A0A0A0;
--accent: #C4A77D;
```

### Tipografia
```css
/* Fontes */
--font-heading: 'Playfair Display', serif;
--font-body: 'Inter', sans-serif;

/* Tamanhos */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
--text-3xl: 1.875rem;
```

### Espaçamento
```css
--spacing-1: 0.25rem;
--spacing-2: 0.5rem;
--spacing-3: 0.75rem;
--spacing-4: 1rem;
--spacing-6: 1.5rem;
--spacing-8: 2rem;
--spacing-12: 3rem;
```

---

## 🔐 Autenticação

### NextAuth.js Configuration
- Provider: Credentials (email/password)
- JWT Strategy
- Session management
- Protected routes via middleware

---

## 💳 Sistema de Pagamentos

### Stripe Integration
- Planos: Free ($0), Premium ($9.99/mês)
- Checkout session
- Webhook handling
- Subscription management
- Trial period (7 dias)

---

## 📊 Funcionalidades Premium vs Free

### Free
- 1 planner por dia
- 5 tarefas por dia
- 3 compromissos por dia
- Histórico de 7 dias
- Sem exportação PDF
- Sem analytics avançado

### Premium
- Planners ilimitados
- Tarefas ilimitadas
- Compromissos ilimitados
- Histórico completo
- Exportação PDF
- Analytics avançado
- Dark mode
- Prioridade de suporte
- Backup automático

---

## 🚀 Deploy

### Vercel (Frontend)
- Environment variables
- Automatic deployments
- Custom domain

### Supabase (Database)
- PostgreSQL hosting
- Authentication
- Real-time subscriptions
- Storage (para PDFs)

---

## 📈 Monetização

### Estratégia
- Freemium model
- 7-day trial
- $9.99/mês ou $99/ano (17% de desconto)
- Upsell via analytics avançado
- Marketing via TikTok/Pinterest/Instagram

### Funil de Conversão
1. Landing page com CTA forte
2. Trial gratuito sem cartão
3. Onboarding guiado
4. Feature highlights durante uso
5. Limites gratuitos visíveis
6. Upgrade prompts em momentos de valor

---

## 🎯 Roadmap de Desenvolvimento

### Fase 1: MVP (2 semanas)
- [x] Setup Next.js + Tailwind
- [ ] Autenticação completa
- [ ] Planner básico com grid
- [ ] CRUD de tarefas
- [ ] Persistência no banco

### Fase 2: Core Features (2 semanas)
- [ ] Todas as seções do planner
- [ ] Drag and drop
- [ ] Dark mode
- [ ] Responsividade completa

### Fase 3: Analytics & Export (1 semana)
- [ ] Dashboard de produtividade
- [ ] Histórico diário
- [ ] Exportação PDF

### Fase 4: Monetização (1 semana)
- [ ] Integração Stripe
- [ ] Sistema de assinatura
- [ ] Limites gratuitos
- [ ] Landing page

### Fase 5: Polish & Launch (1 semana)
- [ ] Testes E2E
- [ ] Performance optimization
- [ ] SEO
- [ ] Deploy produção
