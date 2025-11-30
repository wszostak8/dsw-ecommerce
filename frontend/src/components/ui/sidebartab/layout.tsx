"use client"

import React, { useState, ReactNode, ComponentType } from 'react';
import { Button } from '@/components/ui/button';

export interface TabItem {
    id: string;
    label: string;
    icon: ComponentType<any>;
    content: ReactNode;
}

interface SidebarTabLayoutProps {
    title?: string;
    tabs: TabItem[];
    defaultTab?: string;
    sidebarWidth?: string;
    textColor?: 'text-white/90' | 'text-black';
}

export const SidebarTabLayout = ({ title, tabs, defaultTab, sidebarWidth = "w-64", textColor }: SidebarTabLayoutProps) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

    return (
        <div className={`w-full mx-auto`}>
            <h1 className={`text-xl font-bold mb-6 ${textColor}`}>{title}</h1>

            <div className="flex gap-6">
                <div className={`${sidebarWidth} flex-shrink-0`}>
                    <nav className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <Button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    variant={activeTab === tab.id ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    {tab.label}
                                </Button>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex-1 min-w-0">
                    {activeTabContent}
                </div>
            </div>
        </div>
    );
};
