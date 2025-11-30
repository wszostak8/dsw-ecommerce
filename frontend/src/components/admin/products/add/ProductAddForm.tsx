"use client";

import { cn } from '@/lib/cn';
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React, { useState } from 'react';
import { useCreateProductMutation } from '@/api/mutations/productMutations';
import { Spinner } from '@/components/ui/spinner';
import { CreateProductRequest } from '@/generated/ecommerce/product';
import { Label } from "@/components/ui/label";
import { ImageUploader } from './ImageUploader';
import { FileWithPreview } from '@/hooks/use-file-upload';
import { useForm } from '@tanstack/react-form';

type ProductFormState = CreateProductRequest & {
    files: FileWithPreview[];
};

export function CreateProductForm({ className, ...props }: React.ComponentProps<"form">) {
    const [uploaderKey, setUploaderKey] = useState(0);

    const createProductMutation = useCreateProductMutation();

    const form = useForm({
        defaultValues: {
            productName: '',
            price: 0,
            stock: 0,
            description: '',
            code: '',
            ean: '',
            files: [],
        } as ProductFormState,
        onSubmit: async ({ value }) => {
            const { files, ...productData } = value;

            createProductMutation.mutate(
                {
                    productData: productData as CreateProductRequest,
                    files: files
                },
                {
                    onSuccess: (response) => {
                        if (response.success) {
                            form.reset();
                            setUploaderKey(prev => prev + 1);
                        }
                    }
                }
            );
        },
    });

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
                <h1 className="text-xl font-bold dark:text-white/90">Dodaj produkt</h1>
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
                                    // Używamy valueAsNumber dla bezpiecznej konwersji
                                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
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
                                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                                />
                            </Field>
                        )}
                    />
                </div>

                {/* KLUCZOWA ZMIANA PONIŻEJ:
                    Przekazujemy `field.handleChange` bezpośrednio.
                    To zapobiega tworzeniu nowej funkcji przy każdym renderze i pętli w useFileUpload.
                */}
                <form.Field
                    name="files"
                    children={(field) => (
                        <Field>
                            <ImageUploader
                                key={uploaderKey}
                                files={field.state.value}
                                onFilesChange={field.handleChange}
                            />
                        </Field>
                    )}
                />

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

                <div className="pt-2">
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([canSubmit, isSubmitting]) => (
                            <Button
                                variant="default"
                                className="w-full text-white font-medium"
                                type="submit"
                                disabled={createProductMutation.isPending || !canSubmit}
                            >
                                {createProductMutation.isPending
                                    ? <><Spinner /> Dodawanie produktu...</>
                                    : "Dodaj produkt"}
                            </Button>
                        )}
                    />
                </div>
            </FieldGroup>
        </form>
    );
}