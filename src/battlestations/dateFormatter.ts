export function timeAgo(newDate: string) {

    const date = new Date(newDate + "-07:00");

    const DAY_IN_MS = 86400000;
    const today = new Date();
    const yesterday = new Date(+today - DAY_IN_MS);
    const seconds = Math.round((+today - +date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const isYesterday = yesterday.toDateString() === date.toDateString();
  
    if (seconds < 60) {
        return 'Just now';
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (isYesterday) {
        return 'Yesterday';
    } 
    
    return `${days} ${days === 1 ? "day" : "days"} ago`;
}

export function formatDate(newDate: string) {
    const date = new Date(newDate + "-07:00");
    return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}.${date.getFullYear()}`
}