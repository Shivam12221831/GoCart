import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { authSeller } from "@/middlewares/authSeller";
import prisma from "@/lib/prisma";

// Auth seller
export async function GET(request){
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
        
        if(!isSeller){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const storeInfo = await prisma.store.findUnique({
            where: { userId },
        });

        return NextResponse.json({ isSeller, storeInfo });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message || error.code }, { status: 400 });
    }
}