"use client";
import { useState } from "react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

export function useCookie<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<any>(() => {
    try {
      // Get from cookie by key
      const cookieValue = getCookie(key);
      // Parse stored json or if none return initialValue
      return cookieValue !== undefined ? cookieValue : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error("Error getting cookie:", error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to cookies.
  const setValue = (value: T) => {
    try {
      if (value === "") {
        deleteCookie("authKey");
        return;
      }
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to cookie
      setCookie(key, valueToStore, { maxAge: 60 * 60 * 48 });
    } catch (error) {
      console.error("Error setting cookie", error);
    }
  };

  return [storedValue, setValue];
}
