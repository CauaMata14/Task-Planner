import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  completed: z.boolean().default(false),
})

export const appointmentSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  time: z.string(),
  duration: z.number().optional(),
  completed: z.boolean().default(false),
})

export const financeSchema = z.object({
  type: z.enum(['income', 'expense']),
  category: z.string(),
  amount: z.number().positive('Valor deve ser positivo'),
  description: z.string().optional(),
})

export const goalSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  completed: z.boolean().default(false),
})

export const moodSchema = z.object({
  mood: z.enum(['happy', 'sad', 'neutral', 'anxious', 'productive']),
  note: z.string().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type TaskInput = z.infer<typeof taskSchema>
export type AppointmentInput = z.infer<typeof appointmentSchema>
export type FinanceInput = z.infer<typeof financeSchema>
export type GoalInput = z.infer<typeof goalSchema>
export type MoodInput = z.infer<typeof moodSchema>
