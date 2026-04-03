'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {prisma} from '../lib/prisma';
import { FeedbackType } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { AuthOptions } from 'next-auth';



export async function createNewFeedback(formData: FormData){
    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
        return {success:false, error: "You must be logged in to send feedback"}
    }
    const content = formData.get("content") as string;
    const rawType = formData.get("type") as FeedbackType;
    const feedbackType = Object.values(FeedbackType).includes(rawType as FeedbackType)
    ?(rawType as FeedbackType)
    : FeedbackType.OTHER;

    try {
        const newEntry = await prisma.feedback.create({
            data: {
                content: content,
                type: feedbackType,
                read:false,
                userId: session.user.id,
            },
        });
        return {success: true, id: newEntry.id};
    }catch(error){
        return{success:false, error: "Failed to save feedback"};
    }


}