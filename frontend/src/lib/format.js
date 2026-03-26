export function formatCurrency(value = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium"
  }).format(new Date(value));
}

export function formatDateTime(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatStatusLabel(value = "") {
  return String(value).replace(/-/g, " ");
}

export function formatDeliveryWindow(start, end) {
  if (!start && !end) {
    return "ETA updating";
  }

  const startDate = start ? new Date(start) : new Date(end);
  const endDate = end ? new Date(end) : startDate;
  const sameDay = startDate.toDateString() === endDate.toDateString();

  if (sameDay) {
    return `${formatDate(startDate)} • ${new Intl.DateTimeFormat("en-IN", { timeStyle: "short" }).format(startDate)} - ${new Intl.DateTimeFormat(
      "en-IN",
      { timeStyle: "short" }
    ).format(endDate)}`;
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}
