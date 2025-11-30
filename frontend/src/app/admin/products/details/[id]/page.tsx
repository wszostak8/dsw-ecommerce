import { ProductDetails } from "@/components/admin/products/details/ProductDetails";

interface ProductDetailsPageProps {
    params: Promise<{ id: number }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
    const { id } = await params;

    return <ProductDetails productId={id} />
}