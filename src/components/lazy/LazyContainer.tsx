import { useEffect, useRef, useState } from "react";

interface LazyContainerProps {
  children: React.ReactNode;
}

export function LazyContainer({ children }: LazyContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef}>{visible && children}</div>;
}
