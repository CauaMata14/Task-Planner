export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const FREE_PLAN_LIMITS = {
  tasksPerDay: 5,
  appointmentsPerDay: 3,
  historyDays: 7,
}

export const PREMIUM_PLAN_LIMITS = {
  tasksPerDay: Infinity,
  appointmentsPerDay: Infinity,
  historyDays: Infinity,
}

export const PRIORITIES = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
} as const

export const MOODS = {
  happy: '😊 Feliz',
  sad: '😢 Triste',
  neutral: '😐 Neutro',
  anxious: '😰 Ansioso',
  productive: '🚀 Produtivo',
} as const

export const FINANCE_CATEGORIES = {
  income: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
  expense: ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Outros'],
} as const
