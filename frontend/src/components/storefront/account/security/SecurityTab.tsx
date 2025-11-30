"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TabHeader } from '@/components/ui/sidebartab/tabheader';

export const SecurityTab = () => {
    return (
        <div className="space-y-4">
            <TabHeader
                title="Ustawienia logowania"
                description="Zarządzaj hasłem i zabezpieczeniami konta"
            />

            <Card>
                <CardHeader>
                    <CardTitle>Zmiana hasła</CardTitle>
                    <CardDescription>Aktualizuj hasło, aby zachować bezpieczeństwo konta</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Aktualne hasło</Label>
                            <Input id="currentPassword" type="password" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nowe hasło</Label>
                            <Input id="newPassword" type="password" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Potwierdź nowe hasło</Label>
                            <Input id="confirmPassword" type="password" />
                        </div>

                        <Button>Zmień hasło</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};