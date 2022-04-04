import { useEffect, useState } from "react";

const DEFAULT_OPTIONS = {
  config: { attributes: true, childList: true, subtree: true },
  debounceTime: 0,
};

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
  return debounced as (...args: Parameters<F>) => ReturnType<F>;
};

/**
 * This custom hooks abstracts the usage of the Mutation Observer with React components.
 * Watch for changes being made to the DOM tree and trigger a custom callback.
 * @param {Element} targetEl DOM element to be observed
 * @param {Function} cb callback that will run when there's a change in targetEl or any
 * child element (depending on the provided options)
 * @param {Object} options
 * @param {Object} options.config check \[options\](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe)
 * @param {number} [options.debounceTime=0] a number that represents the amount of time in ms
 * that you which to debounce the call to the provided callback function
 */

export function useMutationObserver(
  targetEl: HTMLElement,
  cb: (...args: any[]) => any,
  options = DEFAULT_OPTIONS
) {
  const [observer, setObserver] = useState<MutationObserver | null>(null);

  useEffect(() => {
    const { debounceTime } = options;
    const obs = new MutationObserver(
      debounceTime > 0 ? debounce(cb, debounceTime) : cb
    );
    setObserver(obs);
  }, [cb, options, setObserver]);

  useEffect(() => {
    if (!observer) return;
    const { config } = options;
    observer.observe(targetEl, config);
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [observer, targetEl, options]);
}
