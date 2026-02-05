"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface ScrollFadeIndicatorProps {
  /** ref attached to the scrollable container */
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Renders a bottom gradient fade + bouncing chevron when the scroll
 * container has more content below.  Place this as a sibling inside
 * a `relative` wrapper that also contains the scrollable div.
 */
export function ScrollFadeIndicator({ scrollRef }: ScrollFadeIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const check = () => {
      setShowIndicator(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
    };

    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, [scrollRef]);

  if (!showIndicator) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none flex flex-col items-center justify-end pb-2">
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
      <ChevronDown className="relative z-10 w-4 h-4 text-slate-400 animate-bounce" />
    </div>
  );
}
