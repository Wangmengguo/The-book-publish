"use client";

import { CSSProperties, useEffect, useRef } from "react";

interface HeroVideoProps {
  poster: string;
  mp4Src?: string;
  webmSrc?: string;
  className?: string;
  style?: CSSProperties;
}

export default function HeroVideo({ poster, mp4Src, webmSrc, className, style }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        // Append sources lazily when entering viewport
        if (webmSrc) {
          const sWebm = document.createElement("source");
          sWebm.src = webmSrc;
          sWebm.type = "video/webm";
          el.appendChild(sWebm);
        }
        if (mp4Src) {
          const sMp4 = document.createElement("source");
          sMp4.src = mp4Src;
          sMp4.type = "video/mp4";
          el.appendChild(sMp4);
        }

        el.load();
        io.disconnect();
      },
      { rootMargin: "200px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [mp4Src, webmSrc]);

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      style={style}
    >
      <track kind="captions" />
    </video>
  );
}


