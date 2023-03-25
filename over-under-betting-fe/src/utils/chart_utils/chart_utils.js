export function map_chart_record_data(data) {
    const arrays = data;
    const chart_price = [];
    const chart_time = [];

    arrays.forEach(value => {
        const timestamp = Math.ceil(value.timestamp);
        chart_price.push(value.price);
        chart_time.push(timestamp)
    });

    return { price: chart_price, time: chart_time };
}