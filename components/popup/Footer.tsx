import { Avatar, AvatarFallback, AvatarImage } from "~components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~components/ui/tooltip"
import { useContributors } from "~hooks/useContributors"
import versionData from "~package.json"

export function Footer() {
  const { contributors, loading } = useContributors()

  return (
    <TooltipProvider delayDuration={100}>
      <div className="px-4 py-3 border-t border-border bg-card/50 flex items-center justify-between">
        <div className="text-[10px] text-muted-foreground font-medium">
          Sparkfy Reviewer v{versionData.version}
        </div>

        <div className="flex items-center -space-x-1.5">
          {!loading &&
            contributors.map((contributor) => (
              <Tooltip key={contributor.id}>
                <TooltipTrigger asChild>
                  <a
                    href={contributor.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="relative rounded-full border border-background transition-transform hover:z-10 hover:scale-110"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={contributor.avatar_url} alt={contributor.login} />
                      <AvatarFallback className="text-[8px]">
                        {contributor.login.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8}>
                  <p>{contributor.login}</p>
                </TooltipContent>
              </Tooltip>
            ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
