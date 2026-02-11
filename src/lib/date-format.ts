export const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString();
};

export const formatDateTime = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    const pad = (n: number, len = 2) => n.toString().padStart(len, "0");

    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ` +
           `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.` +
           `${pad(d.getMilliseconds(), 3)}`;
};

export const formatDateTimeShort = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    const pad = (n: number, len = 2) => n.toString().padStart(len, "0");

    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ` +
           `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};