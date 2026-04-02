'use server';
import {put} from '@vercel/blob';

export async function uploadToCloud ( formData: FormData){
    const file = formData.get('file') as File;
    const blob = await put(file.name, file, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
    })
    return blob.url;
}
