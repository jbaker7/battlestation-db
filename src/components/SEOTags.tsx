import React from 'react';
import {Helmet} from "react-helmet-async";

interface Props {
    title?: string
    description: string
    url: string
}

function SEOTags({title, description, url}: Props) {

    return (
        <Helmet>
            <title>{`${title ? title + " | " : ""}BattlestationDB`}</title>

            <meta
                name="description" content={description}
            />
            <meta property="og:title" content={`${title ? title + " | " : ""}BattlestationDB`} />
            <meta property="og:url" content={url} />
            <meta property="og:description" content={description} />

            <meta name="twitter:title" content={`${title ? title + " | " : ""}BattlestationDB`} />
            <meta name="twitter:description" content={description} />

            <link rel="canonical" href={url} />
        </Helmet>
    )
}

export default SEOTags;