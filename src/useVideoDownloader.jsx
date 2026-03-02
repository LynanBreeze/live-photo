import { useEffect } from "react";
import { useState, useCallback } from "react";

export function useVideoDownloader() {
  const [progress, setProgress] = useState(0);
  const [blobUrl, setBlobUrl] = useState(null);

  const download = useCallback(async (url) => {
    setProgress(0);
    setBlobUrl(null);

    const res = await fetch(url);

    if (!res.ok || !res.body) return null;

    const contentLength = Number(res.headers.get("Content-Length") || 0);
    const hasLength = contentLength > 0;

    const reader = res.body.getReader();
    const chunks = [];
    let received = 0;

    // 用于模拟进度
    let fakeProgress = 0;
    let fakeTimer = null;

    if (!hasLength) {
      fakeTimer = setInterval(() => {
        fakeProgress = Math.min(fakeProgress + 1, 95);
        setProgress(fakeProgress);
      }, 100);
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (value && value.length > 0) {
        chunks.push(value);
        received += value.length;

        if (hasLength) {
          setProgress(Math.round((received / contentLength) * 100));
        }
      }
    }

    if (fakeTimer) clearInterval(fakeTimer);
    setProgress(100);

    const blob = new Blob(chunks, { type: "video/mp4" });
    const urlObject = URL.createObjectURL(blob);
    setBlobUrl(urlObject);

    return urlObject;
  }, []);

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  return { progress, blobUrl, download };
}
