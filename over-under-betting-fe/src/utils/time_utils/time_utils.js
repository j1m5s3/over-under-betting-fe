
export const convert_timestamp = (time_stamp) => {
    const now = new Date();
    const endDate = new Date(time_stamp * 1000); // convert to ms for Date obj
    const timeLeft = endDate.getTime() - now.getTime();

    return timeLeft;
}

export const create_counter_elements = (time_left) => {
    const days = Math.floor(time_left / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time_left % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time_left % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time_left % (1000 * 60)) / 1000);

    const elements = {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    }

    return elements;
}