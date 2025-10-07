import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { authSeller } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Toggle product stock status
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json({ error: "Missing details: productId" }, { status: 400 });
        }

        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if product exists
        const product = await prisma.product.findFirst({
            where: { id: productId, storeId },
        });
        
        if (!product) {
            return NextResponse.json({ error: "No product found" }, { status: 404 });
        }

        await prisma.product.update({
            where: { id: productId },
            data: { inStock: !product.inStock },
        });

        return NextResponse.json({ message: "Product stock updated successfully" });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message || error.code }, { status: 400 });
    }
}