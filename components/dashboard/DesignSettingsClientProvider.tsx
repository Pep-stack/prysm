"use client";
import { DesignSettingsProvider } from "./DesignSettingsContext";

export default function DesignSettingsClientProvider({ initial, children }) {
  return (
    <DesignSettingsProvider initial={initial}>
      {children}
    </DesignSettingsProvider>
  );
} 