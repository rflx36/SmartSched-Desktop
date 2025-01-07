import { TimeType } from "../../types/types";

export function ConvertTimeToValue(time: TimeType) {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60) + minutes;
}
export function ConvertValueToTime(value: number) {
    const hours = Math.floor(value / 60);
    const mins = value % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}` as TimeType;
}

export function ConvertHourToValue(hours: number) {
    return hours * 60;
}


export function RevertTime(time: string) {

    if (time == ""){
        return "00:00"
    }
    // Remove "AM" or "PM" and split time into hours and minutes
    const [hour, minute] = time.slice(0, -3).split(":");

    const period = time.slice(-2); // Get "AM" or "PM"
    let hours = parseInt(hour, 10);

    if (period === "PM" && hours !== 12) {
        hours += 12;
    } else if (period === "AM" && hours === 12) {
        hours = 0;
    }

    // Ensure minutes always have two digits
    const formattedMinutes = minute.padStart(2, "0");

    return `${hours}:${formattedMinutes}` as TimeType;
}

