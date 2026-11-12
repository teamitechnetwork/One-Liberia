import type { AnchorHTMLAttributes, MouseEvent } from "react";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Link({ href, onClick, ...props }: LinkProps) {
  const isSectionLink = href.startsWith("#");
  const safeHref = isSectionLink ? href : "#preview-link";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (!isSectionLink) event.preventDefault();
  };

  return <a {...props} href={safeHref} onClick={handleClick} />;
}

export function useLocation(): [string, (to: string) => void] {
  return [window.location.hash || "/", () => undefined];
}
