// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//     try {
//         const { userId } = getAuth(request);
//         // Get the data from the form
//         const formData = await request.formData();
//         const name = formData.get("name");
//         const username = formData.get("username");
//         const email = formData.get("email");
//         const contact = formData.get("contact");
//         const address = formData.get("address");
//         const image = formData.get("image");

//         if(!name || !username || !email || !contact || !address || !image) {
//             return NextResponse.json({error: "Missing store info"}, {status: 400});
//         }

//         // Check if the user already has a store
//         const store = await prisma.store.findFirst({
//             where: { userId: userId }
//         });

//         // if store is already registeredd then send status of store
//         if(store) {
//             return NextResponse.json({ status: store.status });
//         }

//         // check if username is already taken
//         const isUsernameTaken = await prisma.store.findFirst({
//             where: { username: username.toLowerCase() }
//         });

//         if(isUsernameTaken) {
//             return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
//         }

//     } catch (error) {
//         console.log(error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }