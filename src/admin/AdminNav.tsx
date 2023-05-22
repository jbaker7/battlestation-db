import React from 'react';
import {Link, NavLink, Outlet} from 'react-router-dom';
import './admin.css';

function AdminNav() {



    return (
        <div className="flex flex-row min-h-screen">
           <div className="w-min p-0">
            <Link to="/" className="flex flex-row hover:text-primary normal-case text-xl transition-all p-3">
                <span className="uppercase font-thin">Battlestation</span>
                <span className="uppercase font-semibold">DB</span>
            </Link>

                <ul className="m-4 text-lg font-light flex flex-col gap-3">
                    <li className="">
                        <NavLink to="." end
                        className={({ isActive }) => isActive ? "admin-btn-active" : "admin-btn"}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="./battlestations" 
                        className={({ isActive }) => isActive ? "admin-btn-active" : "admin-btn"}>
                            Battlestations
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="./parts" 
                        className={({ isActive }) => isActive ? "admin-btn-active" : "admin-btn"}>
                            Parts
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="./pending_parts" 
                        className={({ isActive }) => isActive ? "admin-btn-active" : "admin-btn"}>
                            Pending Parts
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="./stores" 
                        className={({ isActive }) => isActive ? "admin-btn-active" : "admin-btn"}>
                            Stores
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="./users" 
                        className={({ isActive }) => isActive ? "admin-btn-active" : "admin-btn"}>
                            Users
                        </NavLink>
                    </li>
                </ul>
            </div>

            <div className="flex-1 flex flex-col p-5 bg-base-300 ">
                <Outlet />
       

            </div>
        </div>



    )
}

export default AdminNav;