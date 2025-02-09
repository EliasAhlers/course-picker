/* eslint-disable @typescript-eslint/no-explicit-any */
import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://backend.ahlers.click');

export const syncData = async (id: string, data: any) => {
  try {
    const existingRecord = await pb.collection('course_selections').getOne(id);
    return await pb.collection('course_selections').update(existingRecord.id, { ...data, id });
  } catch {
    return await pb.collection('course_selections').create({ ...data, id});
  }
};

export const getData = async (id: string) => {
  return await pb.collection('course_selections').getOne(id);
};