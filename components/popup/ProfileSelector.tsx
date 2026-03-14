import { Check, ChevronDown, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

import type { ReviewProfile } from "~constants/review-profiles"
import { REVIEW_PROFILES } from "~constants/review-profiles"
import { Button } from "~components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "~components/ui/popover"
import { cn } from "~lib/utils"

interface ProfileSelectorProps {
  selectedProfileId: string
  onSelectProfile: (profile: ReviewProfile) => void
  customProfiles: ReviewProfile[]
  onDeleteCustomProfile?: (profileId: string) => void
  label?: string
}

export function ProfileSelector({
  selectedProfileId,
  onSelectProfile,
  customProfiles,
  onDeleteCustomProfile,
  label = "Review Profile"
}: ProfileSelectorProps) {
  const [open, setOpen] = useState(false)

  const allProfiles = [...REVIEW_PROFILES, ...customProfiles]
  const selectedProfile = allProfiles.find((p) => p.id === selectedProfileId)

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto py-2.5 px-3">
            <div className="flex items-center gap-2 text-left">
              <span className="text-base">{selectedProfile?.icon}</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">
                  {selectedProfile?.name}
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  {selectedProfile?.description}
                </span>
              </div>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <div className="max-h-[400px] overflow-y-auto">
            {/* Built-in Profiles */}
            <div className="p-2 border-b border-border">
              <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Built-in Profiles
              </div>
              {REVIEW_PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => {
                    onSelectProfile(profile)
                    setOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent transition-colors text-left",
                    selectedProfileId === profile.id && "bg-accent"
                  )}>
                  <span className="text-base">{profile.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold">{profile.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {profile.description}
                    </div>
                  </div>
                  {selectedProfileId === profile.id && (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Profiles */}
            {customProfiles.length > 0 && (
              <div className="p-2">
                <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Custom Profiles
                </div>
                {customProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent transition-colors group",
                      selectedProfileId === profile.id && "bg-accent"
                    )}>
                    <button
                      onClick={() => {
                        onSelectProfile(profile)
                        setOpen(false)
                      }}
                      className="flex-1 flex items-center gap-2 text-left">
                      <span className="text-base">{profile.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold">
                          {profile.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {profile.description}
                        </div>
                      </div>
                      {selectedProfileId === profile.id && (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </button>
                    {onDeleteCustomProfile && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteCustomProfile(profile.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity">
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
