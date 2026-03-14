import { useEffect, useState } from "react"

export interface Contributor {
  login: string
  id: number
  avatar_url: string
  html_url: string
}

export function useContributors() {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContributors() {
      try {
        const response = await fetch(
          "https://api.github.com/repos/luizndev/sparkfy-reviewer/contributors"
        )
        if (!response.ok) throw new Error("Failed to fetch")
        
        const data: Contributor[] = await response.json()
        
        const sorted = data.sort((a, b) => {
          if (a.login === "luizndev") return -1
          if (b.login === "luizndev") return 1
          return 0
        })

        setContributors(sorted)
      } catch (error) {
        console.error("Error fetching contributors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContributors()
  }, [])

  return { contributors, loading }
}
