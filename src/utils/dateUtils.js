import dayjs from "dayjs";

export const formatDate = (dateString) => {
  return dateString ? dayjs(dateString).format("DD/MM/YYYY") : "";
};