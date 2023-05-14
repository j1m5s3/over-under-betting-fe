import React from 'react'
import { convert_timestamp, create_counter_elements } from '@/utils/time_utils/time_utils';

const BettingEventTimerDisplay = ({ bettingClose, eventClose }) => {
    const [bettingTimeRemaining, setBettingTimeRemaining] = useState(null);
    const [eventTimeRemaining, setEventTimeRemaining] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => {
            const timeLeft = convert_timestamp(betting_close);
            if (timeLeft > 0) {
                const counter_elements = create_counter_elements(timeLeft);
                setBettingTimeRemaining(`${counter_elements.days}d:${counter_elements.hours}hrs:${counter_elements.minutes}mins:${counter_elements.seconds}s`);
            } else {
                clearInterval(timer);
                setBettingTimeRemaining("BETTING COMPLETE");
                setBetDisabled(true);
            }
        }, 1000);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            const timeLeft = convert_timestamp(event_close);
            if (timeLeft > 0) {
                const counter_elements = create_counter_elements(timeLeft);
                setEventTimeRemaining(`${counter_elements.days}d:${counter_elements.hours}hrs:${counter_elements.minutes}mins:${counter_elements.seconds}s`);
            } else {
                clearInterval(timer);
                setEventTimeRemaining("EVENT COMPLETE");
            }
        }, 1000);
    }, []);
    return (
        <div>BettingEventTimerDisplay</div>
    )
}

export default BettingEventTimerDisplay