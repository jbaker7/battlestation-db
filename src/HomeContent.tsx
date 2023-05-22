import React from 'react';

function HomeContent() {
    return (
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-2">
                <div className="flex flex-col justify-center md:pr-8 xl:pr-0 lg:max-w-lg">
                    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-teal-accent-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 stroke-secondary/75" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <circle cx="12" cy="12" r="3" />
                            <line x1="12" y1="21" x2="12" y2="21.01" />
                            <line x1="3" y1="9" x2="3" y2="9.01" />
                            <line x1="21" y1="9" x2="21" y2="9.01" />
                            <path d="M8 20.1a9 9 0 0 1 -5 -7.1" />
                            <path d="M16 20.1a9 9 0 0 0 5 -7.1" />
                            <path d="M6.2 5a9 9 0 0 1 11.4 0" />
                        </svg>
                    </div>
                    <div className="max-w-xl mb-6">
                        <h2 className="max-w-lg mb-6 text-3xl font-bold tracking-tight text-secondary sm:text-4xl sm:leading-none">
                            Extensive Part Library
                        </h2>
                        <p className="text-base text-base-content md:text-lg">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                            quae. explicabo.
                        </p>
                    </div>
                    <div>
                        <a href="/parts" aria-label="" 
                        className="inline-flex items-center justify-center font-semibold link link-secondary link-hover" >
                            <span className="leading-none">Browse Parts</span>
                            <svg className="inline-block h-3 ml-2" fill="currentColor" viewBox="0 0 12 12" >
                                <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="flex items-center justify-center -mx-4 lg:pl-8">
                    <div className="flex flex-col items-end px-3">
                        <img
                            className="object-cover mb-6 rounded shadow-lg h-28 sm:h-48 xl:h-56 w-28 sm:w-48 xl:w-56"
                            src="./images/hero-parts.svg"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </div>
    )

  }

  export default HomeContent;