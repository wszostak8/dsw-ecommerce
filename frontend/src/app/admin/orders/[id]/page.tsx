import { OrderDetails } from "@/components/admin/orders/details/OrderDetails";

interface OrderDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
    const { id } = await params;

    const decodedId = decodeURIComponent(id);

    return <OrderDetails orderId={decodedId} />;
}