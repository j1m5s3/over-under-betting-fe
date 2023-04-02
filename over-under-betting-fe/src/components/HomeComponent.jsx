import React from 'react'

import PriceChart from '@/components/PriceChart'
import BettingEvent from '@/components/BettingEvent'

const HomeComponent = ({ server_data }) => {
    const btc_data = server_data['btc'];
    const eth_data = server_data['eth'];
    const contract_data = server_data['events'];
    const provider_url = server_data['provider_url'];

    return (
        <div>
            <div className="markets-text">MARKETS</div>
            <div className="row justify-content-between">
                <div className="col col-md-auto m-auto market-graph-btc">
                    <PriceChart data={btc_data} assetSymbol={"BTC"} />
                </div>
                <div className="col col-md-auto m-auto market-graph-eth">
                    <PriceChart data={eth_data} assetSymbol={"ETH"} />
                </div>

            </div>
            <div className="events-text">EVENTS</div>
            <div className="row justify-content-between">
                <div className="col col-md-auto m-auto event-card-btc">
                    <BettingEvent contract_details={contract_data['BTC']} provider_url={provider_url} />
                </div>
                <div className="col col-md-auto m-auto event-card-eth">
                    <BettingEvent contract_details={contract_data['ETH']} provider_url={provider_url} />
                </div>
            </div>
        </div>
    )
}

export default HomeComponent