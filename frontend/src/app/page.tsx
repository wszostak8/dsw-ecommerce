import StorefrontLayout from "@/components/storefront/layout";
import { ProductList } from "@/components/storefront/product/list/ProductList";

export default function Home() {
  return (
    <StorefrontLayout>
      <ProductList />
    </StorefrontLayout>
  );
}
