"use client"

import { Checkout } from "@/components/storefront/checkout/Checkout";
import StorefrontLayout from "@/components/storefront/layout";

export default function CheckoutPage() {
  return (
    <StorefrontLayout>
      <Checkout />
    </StorefrontLayout>
  );
}
