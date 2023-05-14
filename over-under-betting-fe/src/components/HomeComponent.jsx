import dynamic from 'next/dynamic'
import React from 'react'

import PriceChart from '@/components/PriceChart'

import { ETHProvider} from '@/utils/eth/ethereum_provider';

const BettingEvent = dynamic(() => import('@/components/BettingEvent'), {
    loading: () => <p>Loading...</p>,
    ssr: false
  });

const HomeComponent = ({ server_data }) => {
    const btc_data = server_data['btc'];
    const eth_data = server_data['eth'];
    const contract_data = server_data['events'];
    const provider_url = server_data['provider_url'];

    const eth_provider = new ETHProvider(provider_url);

    return (
        <div>
            <div className="home-text-container">CHARTS</div>
            <div className="row justify-content-between">
                <div className="col col-md-auto m-auto market-graph-btc">
                    <PriceChart data={btc_data} assetSymbol={"BTC"} />
                </div>
                <div className="col col-md-auto m-auto market-graph-eth">
                    <PriceChart data={eth_data} assetSymbol={"ETH"} />
                </div>

            </div>
            <div className="home-text-container">ACTIVE EVENTS</div>
            <div className="row justify-content-between">
                <div className="col col-md-auto m-auto event-card-btc">
                    <BettingEvent contract_details={contract_data['BTC']} eth_provider={eth_provider} />
                </div>
                <div className="col col-md-auto m-auto event-card-eth">
                    <BettingEvent contract_details={contract_data['ETH']} eth_provider={eth_provider} />
                </div>
            </div>
        </div>
    )
}

export default HomeComponent