import React from 'react';
import FeaturedBattlestations from './FeaturedBattlestations';
import usePageTitle from '../usePageTitle';
import {ReactComponent as MainImage} from '../components/not-found.svg';

function BattlestationError() {

    usePageTitle("Error | BattlestationDB");

    return (

        <div className="flex-1 flex flex-col  items-center gap-5 justify-between">
            <div className="flex flex-col items-center px-5 pt-5">
                <MainImage className="h-64" />
                <div className="text-3xl pb-5 text-center">
                    We're sorry. This battlestation doesn't exist or couldn't be loaded.
                </div>
                <div className="text-xl text-center text-base-content/50">
                    Why not check out the <a className="link link-hover link-primary" href="/#featured">featured battlestations</a> instead?
                </div>
            </div>
            
            <FeaturedBattlestations />
        </div>
    )
}

export default BattlestationError;