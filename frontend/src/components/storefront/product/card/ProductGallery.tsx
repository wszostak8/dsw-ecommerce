"use client"

import { useState } from "react";

interface ProductGalleryProps {
    images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col gap-1 w-full">
                <div
                    className="relative w-full max-w-[500px] max-h-[500px] aspect-square overflow-hidden cursor-zoom-in p-2"
                    onClick={() => setLightboxOpen(true)}
                >
                    <img
                        src={images[selectedImage]}
                        alt={`Produkt ${selectedImage + 1}`}
                        className="object-cover w-full h-full rounded-[3rem]"
                        title="Kliknij, aby powiększyć"
                    />
                </div>

                {images.length > 1 ? (
                    <div className="flex gap-2 justify-center overflow-x-auto p-2">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className={`relative w-20 aspect-square rounded-lg overflow-hidden border-2 cursor-pointer flex-shrink-0 transition-transform duration-200 hover:scale-105 ${index === selectedImage ? 'border-primary' : 'border-transparent'}`}
                                onClick={() => setSelectedImage(index)}
                                title={`Zobacz obraz ${index + 1}`}
                            >
                                <img src={img} alt={`Produkt ${index + 1}`} className="object-cover w-full h-full" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-5"></div>
                )}
            </div>

            {/* LIGHTBOX */}
            {lightboxOpen && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50" onClick={() => setLightboxOpen(false)}>
                    <img src={images[selectedImage]} alt={`Produkt ${selectedImage + 1}`} className="max-w-[90%] max-h-[90%] object-contain" />
                </div>
            )}
        </>
    );
}