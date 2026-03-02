import { useEffect, useRef, useState } from "react";

export function useVisible(options) {
  const { root = null, rootMargin = "0px", threshold = 0, onChange } = options || {};

  const ref = useRef(null); // ✔ 正确的 ref
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isVisible = entry.isIntersecting;

        setVisible(isVisible);
        onChange?.(isVisible);
      },
      { root, rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold, onChange]);

  return { ref, visible };
}
