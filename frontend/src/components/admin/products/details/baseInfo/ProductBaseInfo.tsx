"use client"

import { useEffect } from "react";
import {fetchProductById} from "@/api/queries/productQueries";

export const ProductBaseInfo = () => {

    useEffect(() => {
        fetchProductById(2)
    }, []);

    return (
        <>

        </>
    )
}