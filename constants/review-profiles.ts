export interface ReviewProfile {
  id: string
  name: string
  description: string
  instructions: string
  icon: string
}

export const REVIEW_PROFILES: ReviewProfile[] = [
  {
    id: "general",
    name: "General Review",
    description: "Análise completa de código boas práticas",
    instructions: "Analyze the code for Clean Code, SOLID, Typescript Strict, Security and Performance. Focused on Senior JS/TS Engineer persona.",
    icon: "🎯"
  },
  {
    id: "security",
    name: "Security Focus",
    description: "Foco em vulnerabilidades e segurança",
    instructions: "Focus on security vulnerabilities, authentication/authorization issues, data validation, SQL injection risks, XSS vulnerabilities, CSRF protection, sensitive data exposure, secure dependencies, input sanitization, and cryptography best practices.",
    icon: "🔒"
  },
  {
    id: "performance",
    name: "Performance Optimization",
    description: "Otimização de performance e eficiência",
    instructions: "Focus on performance optimizations: algorithmic complexity, unnecessary re-renders, memory leaks, bundle size, lazy loading opportunities, caching strategies, database query optimization, API response times, and resource-intensive operations.",
    icon: "⚡"
  },
  {
    id: "clean-code",
    name: "Clean Code & SOLID",
    description: "Princípios de código limpo e SOLID",
    instructions: "Focus on Clean Code principles and SOLID design: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. Check for code duplication (DRY), naming conventions, function length, complexity, readability, and maintainability.",
    icon: "✨"
  },
  {
    id: "react",
    name: "React Best Practices",
    description: "Boas práticas específicas de React",
    instructions: "Focus on React best practices: proper hooks usage (useEffect dependencies, useCallback, useMemo), component composition, prop drilling vs context, key props, controlled vs uncontrolled components, error boundaries, accessibility (a11y), and React performance patterns.",
    icon: "⚛️"
  },
  {
    id: "typescript",
    name: "TypeScript Strict",
    description: "Tipagem rigorosa e type safety",
    instructions: "Focus on TypeScript strict mode compliance: eliminate 'any' types, proper interface/type definitions, generic types usage, type guards, discriminated unions, strict null checks, proper return types, avoid type assertions, and leverage TypeScript's type system fully.",
    icon: "📘"
  },
  {
    id: "api",
    name: "API & Backend",
    description: "Revisão de APIs e código backend",
    instructions: "Focus on API design and backend code: RESTful principles, proper HTTP methods and status codes, error handling, request validation, authentication/authorization, rate limiting, API versioning, database transactions, proper logging, and scalability considerations.",
    icon: "🔌"
  },
  {
    id: "testing",
    name: "Testing & Quality",
    description: "Cobertura de testes e qualidade",
    instructions: "Focus on testing practices: test coverage, unit test quality, integration tests, test readability, proper mocking, edge cases handling, test organization, TDD principles, and testable code structure. Check if critical paths have tests.",
    icon: "🧪"
  }
]

export const getProfileById = (id: string): ReviewProfile | undefined => {
  return REVIEW_PROFILES.find(profile => profile.id === id)
}

export const getDefaultProfile = (): ReviewProfile => {
  return REVIEW_PROFILES[0]
}
