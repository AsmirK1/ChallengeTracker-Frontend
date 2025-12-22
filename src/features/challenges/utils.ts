export const formatAmount = (amount: number, metric?: string): string => {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return metric ? `${formatted} ${metric}` : formatted;
};
