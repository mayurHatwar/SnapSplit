"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { SortAsc, SortDesc, Calendar, Users, FileImage, Filter, Grid3X3, List } from "lucide-react"

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "name-asc"
  | "name-desc"
  | "faces-desc"
  | "faces-asc"
  | "size-desc"
  | "size-asc"
export type ViewMode = "grid" | "list"
export type FilterOption = "all" | "with-faces" | "no-faces" | "analyzed" | "unanalyzed"

interface PhotoSortControlsProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  filterBy: FilterOption
  onFilterChange: (filter: FilterOption) => void
  totalPhotos: number
  filteredCount: number
}

export function PhotoSortControls({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  filterBy,
  onFilterChange,
  totalPhotos,
  filteredCount,
}: PhotoSortControlsProps) {
  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case "date-desc":
        return "Newest First"
      case "date-asc":
        return "Oldest First"
      case "name-asc":
        return "Name A-Z"
      case "name-desc":
        return "Name Z-A"
      case "faces-desc":
        return "Most Faces"
      case "faces-asc":
        return "Fewest Faces"
      case "size-desc":
        return "Largest First"
      case "size-asc":
        return "Smallest First"
    }
  }

  const getFilterLabel = (filter: FilterOption) => {
    switch (filter) {
      case "all":
        return "All Photos"
      case "with-faces":
        return "With Faces"
      case "no-faces":
        return "No Faces"
      case "analyzed":
        return "Analyzed"
      case "unanalyzed":
        return "Unanalyzed"
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {sortBy.includes("desc") ? <SortDesc className="w-4 h-4 mr-2" /> : <SortAsc className="w-4 h-4 mr-2" />}
              {getSortLabel(sortBy)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onSortChange("date-desc")}>
              <Calendar className="w-4 h-4 mr-2" />
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("date-asc")}>
              <Calendar className="w-4 h-4 mr-2" />
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSortChange("name-asc")}>
              <FileImage className="w-4 h-4 mr-2" />
              Name A-Z
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("name-desc")}>
              <FileImage className="w-4 h-4 mr-2" />
              Name Z-A
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSortChange("faces-desc")}>
              <Users className="w-4 h-4 mr-2" />
              Most Faces
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("faces-asc")}>
              <Users className="w-4 h-4 mr-2" />
              Fewest Faces
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSortChange("size-desc")}>
              <FileImage className="w-4 h-4 mr-2" />
              Largest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("size-asc")}>
              <FileImage className="w-4 h-4 mr-2" />
              Smallest First
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              {getFilterLabel(filterBy)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onFilterChange("all")}>All Photos</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onFilterChange("with-faces")}>
              <Users className="w-4 h-4 mr-2" />
              With Faces
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange("no-faces")}>No Faces Detected</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onFilterChange("analyzed")}>Analyzed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange("unanalyzed")}>Not Analyzed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Results Badge */}
        {filteredCount !== totalPhotos && (
          <Badge variant="secondary">
            {filteredCount} of {totalPhotos}
          </Badge>
        )}
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-1 border rounded-md p-1">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("grid")}
          className="h-8 w-8 p-0"
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("list")}
          className="h-8 w-8 p-0"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
