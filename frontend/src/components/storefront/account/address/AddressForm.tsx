"use client"

import React, { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import { useAddressQuery } from '@/api/queries/addressQueries';
import { useCreateAddressMutation, useUpdateAddressMutation } from '@/api/mutations/addressMutations';
import { Label } from "@/components/ui/label";

export const AddressForm = () => {
    const { data: addressData } = useAddressQuery();
    const createMutation = useCreateAddressMutation();
    const updateMutation = useUpdateAddressMutation();
    const existingAddress = (addressData?.success && addressData?.address) ? addressData.address : null;

    const form = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            street: '',
            houseNumber: '',
            flatNumber: '',
            zipCode: '',
            city: '',
            country: '',
        },
        onSubmit: async ({ value }) => {
            if (!value.street || !value.houseNumber || !value.zipCode || !value.city || !value.country || !value.phoneNumber) {
                return;
            }

            if (existingAddress?.id) {
                await updateMutation.mutateAsync({
                    id: existingAddress.id,
                    addressData: value
                });
            } else {
                await createMutation.mutateAsync(value);
            }
        },
    });

    useEffect(() => {
        if (existingAddress) {
            form.reset({
                firstName: existingAddress.firstName ?? '',
                lastName: existingAddress.lastName ?? '',
                email: existingAddress.email ?? '',
                phoneNumber: existingAddress.phoneNumber ?? '',
                street: existingAddress.street ?? '',
                houseNumber: existingAddress.houseNumber ?? '',
                flatNumber: existingAddress.flatNumber ?? '',
                zipCode: existingAddress.zipCode ?? '',
                city: existingAddress.city ?? '',
                country: existingAddress.country ?? '',
            });
        }
    }, [existingAddress, form]);

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <form onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-4 p-1"
        >
            <div className="grid grid-cols-2 gap-4">
                <form.Field name="firstName">
                    {(field) => (
                        <Field>
                            <Label>Imię</Label>
                            <Input
                                placeholder="Imię"
                                required={true}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        </Field>
                    )}
                </form.Field>

                <form.Field name="lastName">
                    {(field) => (
                        <Field>
                            <Label>Nazwisko</Label>
                            <Input
                                placeholder="Nazwisko"
                                required={true}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        </Field>
                    )}
                </form.Field>
            </div>

            <div className="grid grid-cols-6 gap-4">
                <form.Field name="street">
                    {(field) => (
                        <Field className="col-span-4">
                            <Label>Ulica</Label>
                            <Input
                                placeholder="Ulica"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                required={true}
                            />
                        </Field>
                    )}
                </form.Field>

                <form.Field name="houseNumber">
                    {(field) => (
                        <Field className="col-span-1">
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
                        <Field className="col-span-1">
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
                                value={field.state.value}
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
                                value={field.state.value}
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
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                required
                            />
                        </Field>
                    )}
                </form.Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <form.Field name="email">
                    {(field) => (
                        <Field>
                            <Label>Adres e-mail</Label>
                            <Input
                                type="email"
                                placeholder="Adres e-mail"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                required
                            />
                        </Field>
                    )}
                </form.Field>

                <form.Field name="phoneNumber">
                    {(field) => (
                        <Field>
                            <Label>Numer telefonu</Label>
                            <Input
                                type="tel"
                                placeholder="Numer telefonu"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                required
                            />
                        </Field>
                    )}
                </form.Field>
            </div>

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={isSubmitting}
                >
                    Cofnij zmiany
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                        ? 'Zapisywanie...'
                        : (existingAddress ? 'Zaktualizuj adres' : 'Zapisz adres')
                    }
                </Button>
            </div>
        </form>
    );
};