import React from 'react';
import usePageTitle from '../usePageTitle';
import {ReactComponent as MainImage} from '../components/not-found.svg';

function PartError() {

    usePageTitle("Error | BattlestationDB");

    return (

        <div className="flex-1 flex flex-col  items-center gap-5 justify-between">
            <div className="flex flex-col items-center px-5 pt-5">
                <MainImage className="h-64" />
                <div className="text-3xl pb-5 text-center">
                    We're sorry. This part doesn't exist or couldn't be loaded.
                </div>
            </div>
        </div>
    )
}

export default PartError;