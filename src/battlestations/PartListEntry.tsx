import React from 'react';
import {Link} from "react-router-dom";

interface Props {
    id: number,
    type: string, 
    name: string,
    //location: string
};

function PartListEntry({id, type, name}: Props) {

  return (
	
        <tr className="grid grid-cols-[auto_max-content] md:table-row">
            <td className="col-start-1 row-start-1 col-span-2 row-span-1 pb-1 px-0 border-b !rounded-bl-none border-neutral-content 
                md:table-cell md:border-0 md:w-1 md:px-4 md:py-0 font-semibold">{type}</td>
            <td className="col-start-1 row-start-2 col-span-1 row-span-1 py-1 px-0
                md:px-4 md:table-cell whitespace-normal">
                <Link to={`../parts/view/${id}`} className="link link-hover link-primary">{name}</Link>
                <br />
                {/* <span className="badge badge-sm">{location}</span> */}
            </td>
        </tr>

	);
}

export default PartListEntry;