type WithId<T extends { id: string }> = Omit<T, "id"> & { _id: string };

export const withMongoLikeId = <T extends { id: string }>(value: T): WithId<T> => {
  const { id, ...rest } = value;
  return { ...rest, _id: id };
};
