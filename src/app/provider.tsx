"use client";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import AuthProvider from "@/contexts/AuthProvider";
import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex justify-center items-center">
          <LoadingSpinner />
        </div>
      }
    >
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </Suspense>
  );
}
