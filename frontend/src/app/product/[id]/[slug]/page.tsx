import { redirect } from "next/navigation";
import { fetchProductById } from "@/api/queries/productQueries";
import { slugify } from "@/utils/slugify";
import { ProductCard } from "@/components/storefront/product/card/ProductCard";

export const revalidate = 0;

interface ProductPageProps {
    params: Promise<{ id: string; slug: string; }>;
}

export default async function ProductPage(props: ProductPageProps) {
    const params = await props.params;
    const { id, slug } = params;
    const data = await fetchProductById(Number(id));
    const product = data?.product;

    if (!product) {
        return <div>Produkt nie istnieje.</div>;
    }

    const expectedSlug = slugify(product.productName);

    if (slug !== expectedSlug) {
        redirect(`/product/${id}/${expectedSlug}`);
    }

    return <ProductCard product={product} />;
}