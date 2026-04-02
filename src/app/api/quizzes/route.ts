import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const quizzes = await prisma.quiz.findMany({
            include: {block: true},
            take:10,
        });
        return NextResponse.json(quizzes);
    }catch(error){
        return NextResponse.json(
            {error: "Failed to fetch",
             message: error.message,
             code: error.code
            },
            {status:500}
        );
    }
}