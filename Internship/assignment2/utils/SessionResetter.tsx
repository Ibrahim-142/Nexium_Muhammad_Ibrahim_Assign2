"use client";
import { useEffect } from "react";
export default function SessionResetter() {
  useEffect(() => {
    sessionStorage.clear(); 
  }, []);
  return null;
}
