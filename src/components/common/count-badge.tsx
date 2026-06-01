export function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span
      aria-label={`${count} pending`}
      className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 min-w-[1.25rem] h-5"
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
