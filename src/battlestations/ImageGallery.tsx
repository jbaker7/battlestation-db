import React, {useRef, useState} from 'react';
import ReactModal from 'react-modal';

interface Props {
   gallery: string[]
   battlestationName: string
}

function ImageGallery({gallery, battlestationName}: Props) {

    const galleryRef = useRef<HTMLDivElement>(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    function openImage(e: React.MouseEvent, image: number) {
        setCurrentImage(image);
        setPopupVisible(true);
    }

    function scrollPopupImages(direction: string) {
        if (direction === "left") {
            if (currentImage === 0) {
                setCurrentImage(gallery.length - 1)
            }
            else {
                setCurrentImage(currentImage - 1);
            }
        }
        if (direction === "right") {
            if (currentImage === gallery.length - 1) {
                setCurrentImage(0)
            }
            else {
                setCurrentImage(currentImage + 1);
            }
        }
    }

    function galleryScroll(direction: string) {

        if(galleryRef.current) {
            let galleryWidth: number = galleryRef.current.scrollWidth;

            if(direction === "left") {
                galleryRef.current.scrollBy({
                    top: 0,
                    left: -(galleryWidth / 5),
                    behavior: 'smooth'
                })
            }

            if(direction === "right") {
                galleryRef.current.scrollBy({
                    top: 0,
                    left: (galleryWidth / 5),
                    behavior: 'smooth'
                })
            }
        }
    }

    return (
        <>
            <button className="btn btn-ghost bg-base-content/10" onClick={() => galleryScroll("left")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="1 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <polyline points="15 6 9 12 15 18" />
                </svg>
            </button>
        
            <div ref={galleryRef} className="flex flex-row flex-1 justify-center items-center overflow-x-auto mx-5 custom-scrollbars">
                
                {gallery.map((image, index) => 
                    <img 
                        key={index + image}
                        className="max-h-60 m-3 rounded cursor-pointer hover:ring-2 hover:ring-primary-focus transition-all" 
                        onClick={e => openImage(e, index)} 
                        alt="battlestation image"
                        src={process.env.REACT_APP_S3_BATTLESTATION_IMAGES + 
                            image.slice(0, image.lastIndexOf(".")) + 
                            "_thumb" + image.slice(image.lastIndexOf("."))}
                        onError={(e) => {
                            e.currentTarget.onerror = null; 
                            e.currentTarget.src="../images/file-not-found.svg";
                            e.currentTarget.className="h-24 w-24";
                            e.currentTarget.onclick=null;
                        }}
                    />
                )}
            </div>

            <button className="btn btn-ghost bg-base-content/10" onClick={() => galleryScroll("right")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 23 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <polyline points="9 6 15 12 9 18" />
                </svg>
            </button>

           <ReactModal 
                isOpen={popupVisible}
                contentLabel="Battlestation Image Gallery"
                onRequestClose={() => setPopupVisible(false)}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)'
                    },
                    content: {
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                        right: '0px',
                        bottom: '0px',
                        borderRadius: '0px',
                        outline: 'none',
                        border: '0px',
                        padding: '0px'
                    }
                }}
            >

                <div className="absolute flex flex-col justify-between items-stretch bg-base-300/95 inset-0 z-50">
                    <div className="flex flex-row justify-between items-center p-1 m-3 rounded-lg bg-base-300">
                        <p className="text-3xl text-content pl-4">
                            {battlestationName}
                        </p>
                        <p className="text-xl text-content ">
                            {`${currentImage + 1} / ${gallery.length}`}
                        </p>
                        <button className="p-2 text-content hover:bg-base-100 rounded-md transition-all" onClick={() => setPopupVisible(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        </button>
                    </div>

                    <div className="flex flex-row justify-evenly items-center">
                        <button className="rounded-lg text-4xl p-2 bg-base-100 hover:bg-base-300 transition-all" 
                        onClick={() => scrollPopupImages("left")}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="1 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <polyline points="15 6 9 12 15 18" />
                            </svg>
                        </button>
                        <div className="w-[80vw]">
                            <img className="mx-auto max-h-[80vh] transition-all" 
                                alt="large battlestation image"
                                src={`https://battlestationdb.s3.amazonaws.com/battlestations/${gallery[currentImage]}`} 
                            />
                        </div>
                        <button className="rounded-lg text-4xl p-2 bg-base-100 hover:bg-base-300 transition-all"
                        onClick={() => scrollPopupImages("right")}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 23 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <polyline points="9 6 15 12 9 18" />
                            </svg>
                        </button>
                    </div>
                    <div></div>
                </div>
            </ReactModal>
        </>
	);
}

export default ImageGallery;