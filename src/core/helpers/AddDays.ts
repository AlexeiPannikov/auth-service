export function addDays(date: Date | number | string, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}