"use client"

import { SidebarTabLayout, TabItem } from '@/components/ui/sidebartab/layout';
import { RiGalleryFill, RiInformationFill } from "@remixicon/react";
import {ProductBaseInfoForm} from "@/components/admin/products/details/baseInfo/ProductBaseInfoForm";

interface ProductDetailsProps {
    productId: number;
}

export const ProductDetails = ( { productId }: ProductDetailsProps) => {
    const tabs: TabItem[] = [
        {
            id: 'productBaseInfo',
            label: 'Podstawowe informacje',
            icon: RiInformationFill,
            content: <ProductBaseInfoForm productId={productId} />
        },
        {
            id: 'gallery',
            label: 'Galeria zdjęć',
            icon: RiGalleryFill,
            content: <p>planowany feature</p>
        },
    ];

    return <SidebarTabLayout tabs={tabs} title={`Edytuj produkt (ID: ${productId})`} textColor="text-black" />;
}