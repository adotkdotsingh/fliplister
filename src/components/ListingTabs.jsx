import { Button } from "@/components/ui/button"

export default function ListingTabs({
  listings,
  activeIndex,
  onTabClick,
  onAddTab,
  onDeleteTab,
}) {
  return (
    <div className="flex items-center gap-2 p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-x-auto">
      {listings.map((_, i) => (
        <div
          key={i}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors
            ${activeIndex === i
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-600"
            }
          `}
        >
          <button onClick={() => onTabClick(i)} className="font-medium text-sm">
            Listing {i + 1}
          </button>
          {listings.length > 1 && (
            <button
              onClick={() => onDeleteTab(i)}
              className="ml-1 text-lg leading-none hover:opacity-70 transition-opacity"
              title="Delete listing"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <Button
        onClick={onAddTab}
        size="sm"
        className="ml-auto bg-blue-500 hover:bg-blue-600 text-white"
      >
        + Add
      </Button>
    </div>
  )
}
