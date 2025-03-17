export const formatDate = (date) => {
  const d = new Date(date);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const hours = d.getHours() % 12;
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const ampm = d.getHours() >= 12 ? "PM" : "AM";
  return `${
    months[d.getMonth()]
  } ${d.getDate()}, ${d.getFullYear()} ${hours}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`;
};

export const onlyDate = (dateString) => {
  if (!dateString) return "N/A"; // Handle empty/null dates

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};