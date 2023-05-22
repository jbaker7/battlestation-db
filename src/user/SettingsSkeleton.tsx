import React from 'react';
import Skeleton from '../components/Skeleton';

function SettingsSkeleton() {

    return (
        <div className="">
            <Skeleton className=" mt-2" width="24" height="10" />
            <Skeleton className="mt-2" height="12" />

            <Skeleton className=" mt-2" width="24" height="10" />
            <Skeleton className="mt-2" height="12" />

            <Skeleton className=" mt-2" width="24" height="10" />
            <Skeleton className="mt-2" height="12" />

            <Skeleton className=" mt-2" width="24" height="10" />
            <Skeleton className="mt-2" height="12" />

            <Skeleton className="mt-6" height="12"/>

		</div>
	);
}

export default SettingsSkeleton;