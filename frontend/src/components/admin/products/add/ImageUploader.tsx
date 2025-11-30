import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { useFileUpload, FileWithPreview } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ImageUploaderProps {
    files: FileWithPreview[];
    onFilesChange: (files: FileWithPreview[]) => void;
}

export function ImageUploader({ files, onFilesChange }: ImageUploaderProps) {
    const maxSizeMB = 5;
    const maxSize = maxSizeMB * 1024 * 1024;
    const maxFiles = 6;

    const [
        { isDragging, errors },
        {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
            getInputProps,
        },
    ] = useFileUpload({
        accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
        maxSize,
        multiple: true,
        maxFiles,
        onFilesChange,
    });

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <Label>
                    {files.length > 0
                        ? `Zdjęcia produktu (załadowane ${files.length})`
                        : "Zdjęcia produktu"}
                </Label>
                {files.length > 0 && (
                    <Button type="button" variant="ghost" className="border-1" size="sm" onClick={openFileDialog} disabled={files.length >= maxFiles}>
                        <UploadIcon className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                        Dodaj więcej
                    </Button>
                )}
            </div>
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                data-files={files.length > 0 || undefined}
                className="relative flex min-h-32 flex-col items-center overflow-hidden rounded-xl border border-dashed border-input transition-colors not-data-[files]:justify-center has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
            >
                <input {...getInputProps()} className="sr-only" aria-label="Upload image file" />
                {files.length > 0 ? (
                    <div className="w-full">
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8">
                            {files.map((file) => (
                                <div key={file.id} className="relative aspect-square rounded-md bg-accent">
                                    <img src={file.preview} alt={(file.file as File).name} className="size-full rounded-[inherit] object-cover" />
                                    <div className="bg-red-800 w-full">
                                        <Button
                                            type="button"
                                            onClick={() => removeFile(file.id)}
                                            size="icon"
                                            className="absolute top-0 z-10 -right-2 size-6 rounded-full shadow-none !h-6"
                                            aria-label="Remove image"
                                        >
                                            <XIcon className="size-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                        <div className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background" aria-hidden="true">
                            <ImageIcon className="size-4 opacity-60" />
                        </div>
                        <p className="mb-1.5 text-sm font-medium">Upuść zdjęcia tutaj</p>
                        <p className="text-xs text-muted-foreground">Do {maxFiles} zdjęć, max. {maxSizeMB}MB każde</p>
                        <Button type="button" variant="ghost" className="mt-4 border-1" onClick={openFileDialog}>
                            <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" /> Wybierz zdjęcia
                        </Button>
                    </div>
                )}
            </div>
            {errors.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-destructive" role="alert">
                    <AlertCircleIcon className="size-3 shrink-0" />
                    <span>{errors[0]}</span>
                </div>
            )}
        </div>
    );
}