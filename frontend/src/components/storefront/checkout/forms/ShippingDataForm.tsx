import React from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import {Label} from "@/components/ui/label";

interface ShippingDataFormProps {
    onNext: (data: ShippingDataFormData) => void;
    onBack: () => void;
    initialData: ShippingDataFormData;
}

export interface ShippingDataFormData {
    street: string;
    houseNumber: string;
    flatNumber: string;
    zipCode: string;
    city: string;
    country: string;
}

export const ShippingDataForm = ({ onNext, onBack, initialData }: ShippingDataFormProps) => {
    const form = useForm({
        defaultValues: initialData,
        onSubmit: async ({ value }) => {
            if (!value.street || !value.houseNumber || !value.zipCode || !value.city || !value.country) {
                return;
            }
            onNext(value);
        },
    });

    return (
        <div className="bg-card border p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Adres dostawy</h2>
            <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <div className="grid grid-cols-8 gap-4">
                    <form.Field name="street">
                        {(field) => (
                            <Field className="col-span-4">
                                <Label>Ulica</Label>
                                <Input
                                    placeholder="Ulica"
                                    value={field.state.value ?? ""}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    required={true}
                                />
                            </Field>
                        )}
                    </form.Field>

                    <form.Field name="houseNumber">
                        {(field) => (
                            <Field className="col-span-2">
                                <Label>Numer domu</Label>
                                <Input
                                    placeholder="Numer domu"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    required={true}
                                />
                            </Field>
                        )}
                    </form.Field>

                    <form.Field name="flatNumber">
                        {(field) => (
                            <Field className="col-span-2">
                                <Label>Numer mieszkania</Label>
                                <Input
                                    placeholder="Numer mieszkania"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            </Field>
                        )}
                    </form.Field>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <form.Field name="zipCode">
                        {(field) => (
                            <Field>
                                <Label>Kod pocztowy</Label>
                                <Input
                                    placeholder="Kod pocztowy"
                                    value={field.state.value ?? ""}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    required
                                />
                            </Field>
                        )}
                    </form.Field>

                    <form.Field name="city">
                        {(field) => (
                            <Field>
                                <Label>Miasto</Label>
                                <Input
                                    placeholder="Miasto"
                                    value={field.state.value ?? ""}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    required
                                />
                            </Field>
                        )}
                    </form.Field>

                    <form.Field name="country">
                        {(field) => (
                            <Field>
                                <Label>Kraj</Label>
                                <Input
                                    placeholder="Kraj"
                                    value={field.state.value ?? ""}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    required
                                />
                            </Field>
                        )}
                    </form.Field>
                </div>

                <div className="flex justify-between mt-6 gap-4">
                    <Button type="button" variant="outline" onClick={onBack} className="w-full">
                        Wstecz
                    </Button>
                    <Button type="submit" className="w-full">
                        Dalej
                    </Button>
                </div>
            </form>
        </div>
    );
};
