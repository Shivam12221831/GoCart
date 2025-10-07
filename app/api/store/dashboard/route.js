import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { authSeller } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Get Dashboard data for seller (total order, total products, total earnings)
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get all orders for seller
        const orders = await prisma.order.findMany({ where: { storeId } });
        
        // Get all products with ratings for seller
        const products = await prisma.product.findMany({ where: { storeId } });
        
        const ratings = await prisma.rating.findMany({
            where: { productId: {in: products.map((product) => product.id)}},
            include: { user: true, product: true },
        });

        const dashboardData = {
            ratings,
            totalOrders: orders.length,
            totalProducts: products.length,
            totalEarnings: Math.round(orders.reduce((acc, order) => acc + order.total, 0)),
        }

        return NextResponse.json({ dashboardData });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message || error.code }, { status: 400 });
    }
}