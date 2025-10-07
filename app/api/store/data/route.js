import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get store info and store products
export async function GET(request) {
    try {
        // Get store username from query params
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username").toLowerCase();
        
        if (!username) {
            return NextResponse.json({ error: "Missing details: username" }, { status: 400 });
        }
        
        // Get store info and inStock products with ratings
        const store = await prisma.store.findUnique({
            where: { username, isActive: true },
            include: { Product: {include: { ratings: true }} },
        });

        if (!store) {
            return NextResponse.json({ error: "store not found" }, { status: 404 });
        }

        return NextResponse.json({ store });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message || error.code }, { status: 400 });
    }
}