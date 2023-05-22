import React, {useContext, useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useMutation} from '@tanstack/react-query';
import {saveFavoriteBattlestation} from './apiQueries';
import {authContext} from '../useAuth';
import {getIdToken} from "firebase/auth";

interface Props {
    id: string
    isFavorited: number
    favoriteCount: number
}

function FavoriteButton({id, isFavorited, favoriteCount}: Props) {

    const authState = useContext(authContext);
    let location = useLocation();

    const [favoriteAuthError, setFavoriteAuthError] = useState(false);
    const [localIsFavorited, setLocalIsFavorited] = useState((isFavorited === 1) ? true : false);
    const [displayError, setDisplayError] = useState(false);

    const {mutate: saveFavorite, 
        isLoading: isLoadingSaveFavorite, 
        isError: isErrorSaveFavorite, reset} = useMutation(saveFavoriteBattlestation, {
        onSuccess: () => {
            setLocalIsFavorited(!localIsFavorited);
        }
    })

    useEffect(() => {
        if (favoriteAuthError || isErrorSaveFavorite) {
            setDisplayError(true);
            setTimeout(() => {
                setDisplayError(false);
                setTimeout(() => {
                    setFavoriteAuthError(false);
                    if (isErrorSaveFavorite) reset();
                }, 300);
            }, 5000);
        }
    }, [favoriteAuthError, isErrorSaveFavorite])

    function handleSaveFavorite() {

        let action = "add";
        if (localIsFavorited) {
            action = "remove";
        }

        if(!favoriteAuthError && !isErrorSaveFavorite) {
            if(authState.user) {
                getIdToken(authState.user)
                    .then(token => {
                        saveFavorite({id: id!, action: action, token: token})
                    })
                    .catch(error => {
                        setFavoriteAuthError(true);
                    })
            }
            else {
                setFavoriteAuthError(true);
            }
        }
    }

    return (

        <div className="flex flex-row gap-2 mt-2">
            <button className="btn btn-sm !text-base-content w-fit" title="Add to favorites"
                onClick={() => handleSaveFavorite()} >
                <svg xmlns="http://www.w3.org/2000/svg" 
                className={`h-6 w-6 mr-2 
                ${localIsFavorited ? "like-button-heart-glow text-primary" : "like-heart-empty text-base-content/75"} 
                ${isLoadingSaveFavorite && "like-button-heart-loading"}`} 
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path pathLength="100" strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="">{favoriteCount}</span>
            </button>
                    
            <div className={`flex border border-error rounded-lg px-2 items-center bg-error/10 text-base-content/75 transition-all duration-300
            ${displayError ? "visible opacity-100" : "invisible opacity-0"}`}>
                {favoriteAuthError && <p>Please <Link to="/login" state={{from: location}} className="link">log in first</Link>.</p>}
                {isErrorSaveFavorite && <p>Sorry, unable to save this right now.</p>}
            </div>
            
        </div>

    )
}

export default FavoriteButton;