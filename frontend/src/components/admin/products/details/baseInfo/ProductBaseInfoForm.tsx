"use client";

import { cn } from '@/lib/cn';
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { useGetProductByIdQuery } from '@/api/queries/productQueries';
import { useUpdateProductMutation } from '@/api/mutations/productMutations';
import { UpdateProductRequest } from '@/generated/ecommerce/product';
import { Spinner } from '@/components/ui/spinner';

type ProductBaseInfoState = Omit<UpdateProductRequest, 'id'>;

interface ProductBaseInfoFormProps extends React.ComponentProps<"form"> {
    productId: number;
    onSuccess?: () => void;
}

export function ProductBaseInfoForm({ productId, onSuccess, className, ...props }: ProductBaseInfoFormProps) {
    const { data: productResponse } = useGetProductByIdQuery(productId);
    const product = productResponse

    const updateProductMutation = useUpdateProductMutation();

    const form = useForm({
        defaultValues: {
            productName: '',
            price: 0,
            stock: 0,
            description: '',
            code: '',
            ean: '',
        } as ProductBaseInfoState,

        onSubmit: async ({ value }) => {
            const updatePayload: UpdateProductRequest = {
                id: productId,
                ...value,
            };

            updateProductMutation.mutate(updatePayload)
        },
    });

    useEffect(() => {
        if (product) {
            form.reset({
                productName: product.productName || '',
                price: product.price || 0,
                stock: product.stock || 0,
                description: product.description || '',
                code: product.code || '',
                ean: product.ean || '',
            });
        }
    }, [product, form]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className={cn("flex flex-col", className)}
            {...props}
        >
            <div className="mb-5">
                <h1 className="text-xl font-bold dark:text-white/90">Podstawowe informacje</h1>
            </div>

            <FieldGroup className="space-y-1 gap-3">
                <form.Field
                    name="productName"
                    validators={{
                        onChange: ({ value }) => !value ? 'Nazwa jest wymagana' : undefined,
                    }}
                    children={(field) => (
                        <Field>
                            <Label htmlFor={field.name}>Nazwa produktu</Label>
                            <Input
                                className="bg-white"
                                id={field.name}
                                placeholder="Np. Klawiatura mechaniczna"
                                required
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors ? (
                                <span className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</span>
                            ) : null}
                        </Field>
                    )}
                />

                <div className="grid grid-cols-2 gap-3">
                    <form.Field
                        name="code"
                        children={(field) => (
                            <Field>
                                <Label htmlFor={field.name}>Kod produktu</Label>
                                <Input
                                    className="bg-white"
                                    id={field.name}
                                    placeholder="Kod produktu"
                                    required
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            </Field>
                        )}
                    />
                    <form.Field
                        name="ean"
                        children={(field) => (
                            <Field>
                                <Label htmlFor={field.name}>EAN</Label>
                                <Input
                                    className="bg-white"
                                    id={field.name}
                                    placeholder="Kod EAN"
                                    required
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            </Field>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <form.Field
                        name="price"
                        children={(field) => (
                            <Field>
                                <Label htmlFor={field.name}>Cena</Label>
                                <Input
                                    className="bg-white"
                                    id={field.name}
                                    type="number"
                                    placeholder="Cena"
                                    required
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(Number(e.target.value))}
                                />
                            </Field>
                        )}
                    />
                    <form.Field
                        name="stock"
                        children={(field) => (
                            <Field>
                                <Label htmlFor={field.name}>Stan magazynowy</Label>
                                <Input
                                    className="bg-white"
                                    id={field.name}
                                    type="number"
                                    placeholder="Liczba sztuk"
                                    required
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(Number(e.target.value))}
                                />
                            </Field>
                        )}
                    />
                </div>

                <form.Field
                    name="description"
                    children={(field) => (
                        <Field>
                            <Label htmlFor={field.name}>Opis</Label>
                            <textarea
                                id={field.name}
                                placeholder="Krótki opis produktu..."
                                required
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="flex h-24 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                            />
                        </Field>
                    )}
                />

                <div className="pt-4">
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
                        children={([canSubmit, isSubmitting, isDirty]) => (
                            <Button
                                variant="default"
                                className="w-full text-white font-medium"
                                type="submit"
                                // Przycisk jest disabled tylko jeśli trwa wysyłanie, są błędy walidacji
                                // lub formularz nie został dotknięty (opcjonalnie, można usunąć !isDirty jeśli chcesz pozwolić zapisać od razu)
                                disabled={updateProductMutation.isPending || !canSubmit || !isDirty}
                            >
                                {updateProductMutation.isPending ? (
                                    <>
                                        <Spinner className="mr-2" /> Zapisywanie...
                                    </>
                                ) : (
                                    "Zapisz zmiany"
                                )}
                            </Button>
                        )}
                    />
                </div>
            </FieldGroup>
        </form>
    );
}