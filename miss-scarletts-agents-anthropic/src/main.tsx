// Resilient polyfills for older browsers (e.g. Safari 14/15 on macOS 11) to prevent cloning and communication crashes
if (typeof window !== 'undefined') {
  // 1. Resilient structuredClone polyfill/wrapper
  const nativeClone = (window as any).structuredClone;
  (window as any).structuredClone = function resilientStructuredClone(obj: any, options?: any) {
    try {
      if (nativeClone) {
        return nativeClone(obj, options);
      }
    } catch (e) {
      // Ignore native cloning failures and use fallback
    }

    // Deep copy fallback that never throws on complex/uncloneable objects
    function safeClone(value: any, seen = new Map()): any {
      if (value === null || value === undefined) return value;
      if (typeof value !== 'object' && typeof value !== 'function') return value;
      if (typeof value === 'function') return undefined;

      if (seen.has(value)) {
        return seen.get(value);
      }

      if (value instanceof Date) return new Date(value.getTime());
      if (value instanceof RegExp) return new RegExp(value.source, value.flags);
      if (value instanceof Map) {
        const map = new Map();
        seen.set(value, map);
        value.forEach((v, k) => map.set(safeClone(k, seen), safeClone(v, seen)));
        return map;
      }
      if (value instanceof Set) {
        const set = new Set();
        seen.set(value, set);
        value.forEach((v) => set.add(safeClone(v, seen)));
        return set;
      }
      if (Array.isArray(value)) {
        const arr: any[] = [];
        seen.set(value, arr);
        value.forEach((item) => arr.push(safeClone(item, seen)));
        return arr;
      }

      // Safeguard against DOM Elements and events
      if (value.nodeType && typeof value.nodeName === 'string') {
        return undefined;
      }

      const cloned: any = {};
      seen.set(value, cloned);
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          try {
            cloned[key] = safeClone(value[key], seen);
          } catch (e) {
            // Ignore non-clonable property
          }
        }
      }
      return cloned;
    }

    return safeClone(obj);
  };

  // 2. Resilient postMessage wrapper
  const originalPostMessage = window.postMessage;
  window.postMessage = function resilientPostMessage(message: any, ...args: any[]) {
    try {
      return originalPostMessage.apply(this, [message, ...args]);
    } catch (e) {
      try {
        const sanitized = JSON.parse(JSON.stringify(message));
        return originalPostMessage.apply(this, [sanitized, ...args]);
      } catch (innerEx) {
        return originalPostMessage.apply(this, [`[Uncloneable Message] ${String(message)}`, ...args]);
      }
    }
  };

  // 3. Resilient parent postMessage wrapper
  if (window.parent && window.parent !== window) {
    const originalParentPostMessage = window.parent.postMessage;
    window.parent.postMessage = function resilientParentPostMessage(message: any, ...args: any[]) {
      try {
        return originalParentPostMessage.apply(window.parent, [message, ...args]);
      } catch (e) {
        try {
          const sanitized = JSON.parse(JSON.stringify(message));
          return originalParentPostMessage.apply(window.parent, [sanitized, ...args]);
        } catch (innerEx) {
          return originalParentPostMessage.apply(window.parent, [`[Uncloneable Message] ${String(message)}`, ...args]);
        }
      }
    };
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
