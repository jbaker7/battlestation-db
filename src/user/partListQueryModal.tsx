import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {getBattlestationParts} from '../battlestations/apiQueries';
import PartListCopy from '../components/PartListCopy';

interface Props {
    battlestationId: number | null | undefined,
    closeFunction: Function
}

function PartListQueryModal({battlestationId, closeFunction}: Props) {
    const {data: dataBattlestationParts, isError: isErrorBattlestationParts, isLoading: isLoadingBattlestationParts} = 
    useQuery<{part_id: number, name: string, type_id: number, type_name: string, image: string}[]>(['battlestationsParts', battlestationId], () => getBattlestationParts(battlestationId),
    {enabled: battlestationId !== null});
  
    return (
        <>
            {isLoadingBattlestationParts ? <div>Loading</div> 
            : isErrorBattlestationParts ? <div>Error</div>
            : dataBattlestationParts && 
                <PartListCopy 
                    parts={dataBattlestationParts} 
                    battlestationId={battlestationId} 
                    closeFunction={closeFunction}
                />
            }
        </>
    )
}

export default PartListQueryModal;