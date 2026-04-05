'use server';

import {prisma} from '../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateUsername(userId: string, newName: string){
    try{
        await prisma.user.update({
            where: {id:userId},
            data:{name: newName},
        });

        revalidatePath("/");
        return {success: true};
    } catch(error){
        return{error: "Failed"}
    }
}

export async function updatePhoto(userId:string, newPhoto:string){

    try{
        await prisma.user.update({
            where: { id:userId},
            data:{image: newPhoto}
        });
        revalidatePath("/");
        return {success:true};
    }catch(error){
        return{error: "Failed"}
    }
}

export async function deleteUserAccount(userId: string){
    try {
        await prisma.user.delete({
            where: { id: userId }
        });
        return { success: true }; 
    } catch (error) {
        console.error(error);
        return { success: false, error: "Could not delete account" };
    }
}