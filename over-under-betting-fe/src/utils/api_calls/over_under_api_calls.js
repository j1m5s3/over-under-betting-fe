

export const get_all_hourly_price_data = async (hours) => {
  const base_url = process.env.NEXT_PUBLIC_BE_URL;

  const btc_24h_route = "/data/btc/price/" + hours + "/hour";
  const btc_url = base_url + btc_24h_route;

  const eth_24h_route = "/data/eth/price/" + hours + "/hour";
  const eth_url = base_url + eth_24h_route;


  const btc_res = await fetch(btc_url).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  });
  const btc_data = btc_res.data;

  const eth_res = await fetch(eth_url).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  });
  const eth_data = eth_res.data;

  const price_data = {
    btc: btc_data,
    eth: eth_data,
  }

  return price_data;
}

export const get_hourly_asset_price_data = async (assetSymbol, hours) => {
  const base_url = process.env.NEXT_PUBLIC_BE_URL;
  const hourly_asset_route = "/data/" + assetSymbol + "/price/" + hours + "/hour";
  const hourly_url = base_url + hourly_asset_route;

  const hourly_data = await fetch(hourly_url).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  });
  const price_data  = hourly_data.data;
  
  return price_data;
}


export const get_live_price_data = async (assetSymbol) => {
  const base_url = process.env.NEXT_PUBLIC_BE_URL;
  const live_route = '/data/' + assetSymbol + '/price/latest';
  const live_url = base_url + live_route;

  const live_price_data = await fetch(live_url).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  });

  const price_data = live_price_data.data;

  return price_data;
}


export const get_current_six_hour_event_data = async() => {
  const base_url = process.env.NEXT_PUBLIC_BE_URL;
  const six_hour_event_route = '/events/current/6hr_events';
  const live_url = base_url + six_hour_event_route;

  const events_data = await fetch(live_url).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  });
  const contract_data = events_data.data;


  let contract_data_formatted = {}
  contract_data.forEach(value => {
      contract_data_formatted[value.asset_symbol] = value;
  });

  return contract_data_formatted;
}

export const get_current_test_event_data = async() => {
  const base_url = process.env.NEXT_PUBLIC_BE_URL;
  const test_event_route = '/events/current/test_events';
  const live_url = base_url + test_event_route;

  const events_data = await fetch(live_url).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  });
  const contract_data = events_data.data;


  let contract_data_formatted = {}
  contract_data.forEach(value => {
      contract_data_formatted[value.asset_symbol] = value;
  });

  return contract_data_formatted;
}
