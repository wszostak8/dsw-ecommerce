import { ShoppingCart } from "lucide-react";

interface LogoProps {
    className?: string;
}

export const Logo = ( { className }: LogoProps) => {
    return (
        <div className={`flex gap-1.5 items-center ${className}`}>
            <div className="border-1 p-2 rounded-full shadow-xs">
                <ShoppingCart size={22} />
            </div>
            <strong className="text-[16px] hidden md:block">dsw-ecommerce</strong>
        </div>
    )
}