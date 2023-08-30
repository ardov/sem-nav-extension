const IconWrapper = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    {...props}
  />
)

export const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path
      fillRule="evenodd"
      d="M11 1a10 10 0 1 0 6.3 17.7l4 4a1 1 0 0 0 1.4-1.4l-4-4A10 10 0 0 0 11 1ZM3 11a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z"
      clipRule="evenodd"
    />
  </IconWrapper>
)

export const BookmarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path
      fillRule="evenodd"
      d="m12 20 8 3V4.5c0-2-1.6-3.5-3.5-3.5h-9C5.5 1 4 2.6 4 4.5V23l8-3Zm-6 .1 6-2.2 6 2.2V4.5c0-.8-.7-1.5-1.5-1.5h-9C6.7 3 6 3.7 6 4.5v15.6Z"
      clipRule="evenodd"
    />
  </IconWrapper>
)

export const BookmarkFilledIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <path d="M4 4a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v19l-8-3-8 3V4Z" />
  </IconWrapper>
)
