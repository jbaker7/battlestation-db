import React, {useContext, useState, useRef} from 'react';
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import {ReactComponent as LoadingBars } from '../components/loading-bars.svg'
import {authContext} from '../useAuth';
import {sendPasswordResetEmail } from "firebase/auth";


function PasswordReset() {

    const authState = useContext(authContext);

    const [isLoading, setIsLoading] = useState(false);
    const [resetError, setResetError] = useState("");
    
    const [resetSuccessful, setResetSuccessful] = useState(false);


    const resetForm = useRef<HTMLFormElement>(null);

    type FormInputs = {
        email: string;
        password: string;
      };


    const {register, handleSubmit, getValues, formState: {errors}} = useForm<FormInputs>({
        mode: 'onSubmit',
        reValidateMode: 'onBlur'
    });

    function handleLogin(data: FormInputs) {
        if(resetForm.current) {

            setIsLoading(true);
            sendPasswordResetEmail(authState.firebaseAuth, data.email)

                .then(() => {
                    setIsLoading(false);
                    setResetSuccessful(true);
                })
                .catch((error) => {
                    if(error.code === "auth/user-not-found") {
                        setResetError("User not found.");
                    }
                    else {
                        setResetError("Unable to reset password at this time. Please try again later.");
                    }
                    setIsLoading(false);
                });

        }
    }

    return (
        
        <div className="flex flex-col flex-1 mb-4">
            <div className="flex flex-col items-center justify-center">
                <Link to="/" className="hover:text-primary">
                    <h1 className="my-8 text-4xl">
                        <span className="uppercase font-thin">Battlestation</span>
                        <span className="uppercase font-semibold">Builds</span>
                    </h1>
                </Link>
                {!resetSuccessful ? 
                <div className="bg-base-200 border border-base-300 px-10 py-5 shadow-lg rounded-lg lg:w-1/3 md:w-1/2 w-[calc(100%-2rem)]">
                    <p tabIndex={0} className="focus:outline-none text-2xl text-center font-bold leading-6">
                        Forgot Password?
                    </p>
                    <p tabIndex={0} className="focus:outline-none my-8 text-md text-center leading-6">
                        Enter your email to be sent instructions to reset your password.
                    </p>
                    
                    <div className="form-control w-full">
                        <form ref={resetForm} onSubmit={handleSubmit(handleLogin)}>
                            <label htmlFor="email" className="label">Email</label>
                            <div className="relative flex items-center justify-center">
                                <input {...register("email", {required: true})} 
                                    id="email" type="email" 
                                    className={`input input-bordered bg-base-100 w-full ${errors.email && "input-error pr-9"}`} />
                                {errors.email && 
                                <div className="absolute right-0 mt-0 mr-2 cursor-pointer tooltip tooltip-error" data-tip="Field is required.">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-error" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <circle cx="12" cy="12" r="9" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                </div>}
                            </div>
                            
                            {resetError &&
                                <div className="flex flex-row items-center px-4 py-2 border flex-1 border-error rounded-lg shadow-lg mt-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 stroke-error flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{resetError}</span>
                                </div>
                            }
                            <div className="mt-5">
                                <button type="submit" className={`btn btn-primary w-full ${isLoading ?? "pointer-events-none"}`}>{isLoading ? <LoadingBars className="h-4/5" /> : "Reset Password"}</button>
                            </div>
                        </form>
                    </div>
                </div>
                :
                <div className="flex flex-col items-center bg-base-200 border border-base-300 p-10 shadow-lg rounded-lg lg:w-1/3 md:w-1/2 w-[calc(100%-2rem)]">
                    <p className="text-lg mb-5 text-center">
                       Instruction to reset your password have been sent to:
                    </p>
                    <p className="text-xl font-semibold mb-8">
                        {getValues("email")}
                    </p>
                    <Link to="/login" state={{referrer: "passwordReset"}} className="btn btn-primary btn-outline btn-md">Back to Login</Link>
                </div>
                }
            </div>
        </div>
        
	);
}

export default PasswordReset;