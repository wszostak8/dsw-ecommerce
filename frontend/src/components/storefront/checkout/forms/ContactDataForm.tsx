import React from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

interface ContactDataFormProps {
    onNext: (data: ContactDataFormData) => void;
    initialData: ContactDataFormData;
}

export interface ContactDataFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export const ContactDataForm = ({ onNext, initialData }: ContactDataFormProps) => {
    const form = useForm({
        defaultValues: initialData,
        onSubmit: async ({ value }) => {
            if (!value.firstName || !value.lastName || !value.email || !value.phone) {
                return;
            }
            onNext(value);
        },
    });

    return (
        <div className="bg-card border p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Dane kontaktowe</h2>
            <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <div className="grid sm:grid-cols-2 gap-4">
                    <form.Field name="firstName">
                        {(field) => (
                            <Field>
                                <Label>Imię</Label>
                                <Input
                                    id="firstName"
                                    placeholder="Imię"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    required
                                />
                            </Field>
                        )}
                    </form.Field>

                    <form.Field name="lastName">
                        {(field) => (
                            <Field>
                                <Label>Nazwisko</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Nazwisko"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    required
                                />
                            </Field>
                        )}
                    </form.Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <form.Field name="email">
                        {(field) => (
                            <Field className="col-span-1">
                                <Label>Adres e-mail</Label>
                                <Input
                                    placeholder="Adres e-mail"
                                    id="email"
                                    type="email"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    required
                                />
                            </Field>
                        )}
                    </form.Field>

                    <form.Field name="phone">
                        {(field) => (
                            <Field className="col-span-1">
                                <Label>Numer telefonu</Label>
                                <Input
                                    placeholder="Numer telefonu"
                                    id="phone"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    required
                                />
                            </Field>
                        )}
                    </form.Field>
                </div>

                <div className="mt-6">
                    <Button type="submit" className="w-full">
                        Dalej
                    </Button>
                </div>
        </form>
    </div>
    );
};