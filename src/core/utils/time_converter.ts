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