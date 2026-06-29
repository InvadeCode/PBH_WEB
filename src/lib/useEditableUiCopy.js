import { useEffect } from 'react';

const COPY_ATTRIBUTES = ['placeholder', 'aria-label', 'title', 'alt'];
const SKIP_SELECTOR = 'script, style, noscript, textarea, [data-pbh-copy-ignore]';

const normalizeCopyText = (value) => (
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : ''
);

const getReplacementValue = (entry) => {
  const value = normalizeCopyText(entry?.value);
  const source = normalizeCopyText(entry?.source);
  return value || source;
};

const buildCopyLookup = (entries) => {
  const lookup = new Map();

  (Array.isArray(entries) ? entries : []).forEach((entry) => {
    const source = normalizeCopyText(entry?.source);
    const replacement = getReplacementValue(entry);
    if (source && replacement) lookup.set(source, replacement);
  });

  return lookup;
};

const replacePreservingWhitespace = (raw, replacement) => {
  const leading = raw.match(/^\s*/)?.[0] || '';
  const trailing = raw.match(/\s*$/)?.[0] || '';
  return `${leading}${replacement}${trailing}`;
};

export const useEditableUiCopy = (entries) => {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const lookup = buildCopyLookup(entries);
    if (lookup.size === 0) return undefined;

    const originalTextNodes = new WeakMap();
    const originalAttributes = new WeakMap();
    let frame = null;

    const getOriginalAttributeMap = (element) => {
      let attrMap = originalAttributes.get(element);
      if (!attrMap) {
        attrMap = new Map();
        originalAttributes.set(element, attrMap);
      }
      return attrMap;
    };

    const applyToTextNode = (node) => {
      const parent = node.parentElement;
      if (!parent || parent.closest(SKIP_SELECTOR)) return;

      const current = node.nodeValue || '';
      const normalizedCurrent = normalizeCopyText(current);
      if (!normalizedCurrent) return;

      const original = originalTextNodes.get(node) || normalizedCurrent;
      originalTextNodes.set(node, original);

      const replacement = lookup.get(original);
      if (!replacement || replacement === normalizedCurrent) return;

      node.nodeValue = replacePreservingWhitespace(current, replacement);
    };

    const applyToElementAttributes = (element) => {
      if (element.closest(SKIP_SELECTOR)) return;

      const attrMap = getOriginalAttributeMap(element);
      COPY_ATTRIBUTES.forEach((attr) => {
        if (!element.hasAttribute(attr)) return;

        const current = element.getAttribute(attr) || '';
        const normalizedCurrent = normalizeCopyText(current);
        if (!normalizedCurrent) return;

        const original = attrMap.get(attr) || normalizedCurrent;
        attrMap.set(attr, original);

        const replacement = lookup.get(original);
        if (replacement && replacement !== normalizedCurrent) {
          element.setAttribute(attr, replacement);
        }
      });
    };

    const applyCopy = (root = document.body) => {
      if (!root) return;

      if (root.nodeType === Node.ELEMENT_NODE) {
        applyToElementAttributes(root);
      }

      const elementWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
      while (elementWalker.nextNode()) {
        applyToElementAttributes(elementWalker.currentNode);
      }

      const textWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (textWalker.nextNode()) {
        applyToTextNode(textWalker.currentNode);
      }
    };

    const scheduleApply = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        applyCopy(document.body);
      });
    };

    applyCopy(document.body);

    const observer = new MutationObserver(scheduleApply);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: COPY_ATTRIBUTES,
    });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [entries]);
};
