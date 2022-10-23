export const convertMongoObj = <T extends { _id?: string }>(obj: T) => {
    const id = obj._id;
    delete obj._id;
    return { id, ...obj } as Omit<T, "_id"> & { id: string };
};
