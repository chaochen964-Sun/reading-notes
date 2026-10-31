"use client";

import { useEffect, useState, type CSSProperties } from "react";

export function BookmarkRain() {
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const update = () => setHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return <>
    <div className="bookmark-fall" aria-hidden="true" data-paused={paused || hidden}>
      {[5, 23, 42, 61, 79, 94, 14, 52, 86, 34].map((left, i) =>
        <span key={left} style={{ left: `${left}%`, animationDuration: `${28 + i * 2}s`, animationDelay: `${-i * 7 - 3}s`, "--rest-y": `${(i * 17 + 12) % 95}%` } as CSSProperties} />
      )}
    </div>
    <button className="bookmark-motion-toggle" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "继续飘落" : "暂停飘落"}</button>
  </>;
}
