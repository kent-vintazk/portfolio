"use client";

import { useEffect } from "react";

// Known-harmless noise from third-party libraries that we cannot silence
// at the source. Each string is checked as a substring of the logged message.
const SUPPRESSED = [
  "THREE.Clock: This module has been deprecated",
  "OpenGL error checking is disabled",
  "NORM_RECT without IMAGE_DIMENSIONS",
  "landmark_projection_calculator",
  "gl_context.cc",
  "vision_wasm_internal.js",
];

type LogFn = (...args: unknown[]) => void;

function shouldSuppress(args: unknown[]): boolean {
  const joined = args.map((a) => (typeof a === "string" ? a : JSON.stringify(a ?? ""))).join(" ");
  return SUPPRESSED.some((p) => joined.includes(p));
}

export default function ConsoleFilter() {
  useEffect(() => {
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;
    const origInfo = console.info;

    const wrap = (orig: LogFn): LogFn =>
      (...args: unknown[]) => {
        if (shouldSuppress(args)) return;
        orig(...args);
      };

    console.log = wrap(origLog);
    console.warn = wrap(origWarn);
    console.error = wrap(origError);
    console.info = wrap(origInfo);

    return () => {
      console.log = origLog;
      console.warn = origWarn;
      console.error = origError;
      console.info = origInfo;
    };
  }, []);

  return null;
}
