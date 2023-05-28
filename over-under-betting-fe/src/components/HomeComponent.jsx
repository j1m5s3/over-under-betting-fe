import dynamic from 'next/dynamic';
import React from 'react';

import PriceChart from '@/components/PriceChart';
import Error from '@/components/Error';

import { ETHProvider} from '@/utils/eth/ethereum_provider';

const BettingEvent = dynamic(() => import('@/components/BettingEvent'), {
    loading: () => <p>Loading...</p>,
    ssr: false
  });

const HomeComponent = ({ server_data, eth_provider }) => {
    const btc_data = server_data['btc']['data'];
    const btc_data_error = server_data['btc']['error'];

    const eth_data = server_data['eth']['data'];
    const eth_data_error = server_data['eth']['error'];

    const contract_data = server_data['events']['data'];
    const contract_data_error = server_data['events']['error'];

    const provider_url = server_data['provider_url'];

    //const eth_provider = new ETHProvider(provider_url);

    return (
        <div>
            <div className="home-text-container">CHARTS</div>
            <div className="row justify-content-between">
                <div className="col col-md-auto m-auto market-graph-btc">
                    {!btc_data_error  && <PriceChart data={btc_data} assetSymbol={"BTC"} />}
                    {btc_data_error && <Error />}
                </div>
                <div className="col col-md-auto m-auto market-graph-eth">
                    {!eth_data_error && <PriceChart data={eth_data} assetSymbol={"ETH"} />}
                    {eth_data_error && <Error />}
                </div>

            </div>
            <div className="home-text-container">ACTIVE EVENTS</div>
            <div className="row justify-content-between">
                <div className="col col-md-auto m-auto event-card-btc">
                    {!contract_data_error && 
                    <BettingEvent contract_details={contract_data['BTC']} eth_provider={eth_provider} show_withdraw={false}/>}
                    {contract_data_error && <Error />}
                </div>
                <div className="col col-md-auto m-auto event-card-eth">
                    {!contract_data_error && 
                    <BettingEvent contract_details={contract_data['ETH']} eth_provider={eth_provider} show_withdraw={false}/>}
                    {contract_data_error && <Error />}
                </div>
            </div>
        </div>
    )
}

export default HomeComponent