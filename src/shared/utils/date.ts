export const formatedDate = (date: string) => {
  // const formatedDate = new Intl.DateTimeFormat("id-ID", {
  //   day: "2-digit",
  //   month: "2-digit",
  //   year: "numeric",
  // }).format(new Date(date));
  const formatedDate = new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return formatedDate;
};
