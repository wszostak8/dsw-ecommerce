"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

interface TanstackQueryProviderProps {
    children: ReactNode;
}

export default function TanstackQueryProvider({ children }: TanstackQueryProviderProps) {
    const [client] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 1,
                        refetchOnWindowFocus: false,
                        staleTime: 30_000,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    )
}
