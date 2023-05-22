import React from 'react';
import FeaturedBattlestations from './battlestations/FeaturedBattlestations';
import SEOTags from "./components/SEOTags";

function Home() {


  return (
    <div className="flex-1">

			<SEOTags
          description={`BattlestationDB - Explore the most beautiful and inspiring setups for gaming, work-from-home, and productivity.`}
          url={`https://www.battlestationdb.com`}
      />

      <div className="hero min-h-[50vh]" style={{backgroundImage: 'url(./images/hero.webp)'}}>
        <div className="hero-overlay bg-opacity-40"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl"><span className="uppercase font-thin">Battlestation</span><span className="uppercase font-semibold">DB</span></h1>
            <p className="mb-5">Share and explore amazing spaces for work, gaming, and life.</p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <FeaturedBattlestations />
      </div>
    </div>
  );
}

export default Home;