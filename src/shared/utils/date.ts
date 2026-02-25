export const formatedDate = (date: string) => {
  const formatedDate = new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return formatedDate;
};
