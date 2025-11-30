import React from 'react';
import { Separator } from '@/components/ui/separator';

interface TabHeaderProps {
    title: string;
    description?: string;
}

export const TabHeader = ({ title, description }: TabHeaderProps) => {
    return (
        <>
            <div>
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-muted-foreground text-sm">{description}</p>
            </div>
            <Separator />
        </>
    );
};