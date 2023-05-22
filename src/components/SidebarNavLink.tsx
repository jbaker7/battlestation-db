import React from 'react';
import {NavLink} from "react-router-dom";

interface Props {
    destination: string
    children: React.ReactNode
}

function SidebarNavLink({destination, children}: Props) {

    return (
        <li className="hover:bg-neutral-content/5 transition-all rounded-md " >
            <NavLink
            className={({isActive}) => isActive ? "block flex flex-row outline outline-primary/25 py-3 px-3 rounded-md font-semibold bg-neutral-content/5" : "block py-3 px-3 rounded-md"}
                to={destination}>{children}</NavLink>
        </li>
    )
}

export default SidebarNavLink;