export const formatedDate = (date: string) => {
  const formatedDate = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));

  return formatedDate;
};
