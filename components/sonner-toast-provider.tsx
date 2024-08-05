"use client";

import { Toaster } from "sonner";

export const SonnerToastProiver = () => {
    return <Toaster
        position="top-right"
        visibleToasts={1}
        theme="dark"
        style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
    />;
}