import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-heading font-bold mb-4">Task Planner</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Monorepo com Turborepo - Frontend Next.js
        </p>
        <div className="space-x-4">
          <Link href="/dashboard">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
              Ir para Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
