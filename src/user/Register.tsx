import React, {useRef, useState} from 'react';
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import {useMutation} from '@tanstack/react-query';
import usePageTitle from '../usePageTitle';
import {AxiosError} from 'axios';
import {registerNewUser} from './apiQueries';
import {ReactComponent as LoadingCircle} from '../components/loading-circles.svg';
import FormErrorTag from '../components/FormErrorTag';

function Register() {
    usePageTitle("Register | BattlestationDB");

    const [submitError, setSubmitError] = useState("");

    const registerForm = useRef<HTMLFormElement>(null);

    type FormInputs = {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    };

    const {register, handleSubmit, watch, formState: {errors}} = useForm<FormInputs>({
        mode: 'onSubmit',
        reValidateMode: 'onBlur'
    });

    const {mutate: postNewUser, 
        isLoading: isLoadingNewUser, 
        isSuccess: isSuccessNewUser} = useMutation(registerNewUser, {
        onError: error => {
            console.log(error);
            if (error instanceof AxiosError) {
                setSubmitError(error?.response?.data ? error.response.data : error.message);
            }
        }
    })

    function handleRegistration(data: FormInputs) {
        postNewUser({data: JSON.stringify(data)});
    }

    return (
        
        <div className="flex flex-col flex-1 mb-4">
            <div className="flex flex-col items-center justify-center">
                <Link to="/" className="hover:text-primary">
                    <h1 className="my-8 text-4xl">
                        <span className="uppercase font-thin">Battlestation</span>
                        <span className="uppercase font-semibold">DB</span>
                    </h1>
                </Link>
                {!isSuccessNewUser ? 
                    <div className="bg-base-200 border border-base-300 p-8 shadow-lg rounded-lg lg:w-1/3 md:w-1/2 w-[calc(100%-2rem)]">
                        <h2 className="mb-4 focus:outline-none text-2xl text-center font-semibold leading-none">
                            Create an Account
                        </h2>
                        
                        <div className="form-control w-full">
                            <form ref={registerForm} onSubmit={handleSubmit(handleRegistration)}>
                                <label htmlFor="username" className="label mt-2 pb-1">
                                    <span className="label-text">Username</span>
                                    {errors.username && <FormErrorTag>{errors.username.message}</FormErrorTag>}
                                </label>
                                <div className="relative flex items-center justify-center">
                                    <input {...register("username", {required: "Field is required.",
                                        minLength: {value: 6, message: "Must be at least 6 characters."}, 
                                        maxLength: {value: 64, message: "Must be less than 64 characters."}})} 
                                        id="username" type="text" 
                                        className={`input input-bordered bg-base-100 w-full ${errors.username && "pr-9"}`} />
                                    {errors.username && 
                                        <div className="absolute right-0 mt-0 mr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="text-error" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <circle cx="12" cy="12" r="9" />
                                                <line x1="12" y1="8" x2="12" y2="12" />
                                                <line x1="12" y1="16" x2="12.01" y2="16" />
                                            </svg>
                                        </div>
                                    }
                                </div>

                                <label htmlFor="email" className="label mt-2 pb-1">
                                    <span className="label-text">Email Address</span>
                                    {errors.email && <FormErrorTag>{errors.email.message}</FormErrorTag>}
                                </label>
                                <div className="relative flex items-center justify-center">
                                    <input {...register("email", {required: "Field is required."})} 
                                    id="email" type="email" 
                                    className={`input input-bordered bg-base-100 w-full ${errors.email && "pr-9"}`} />
                                    {errors.email &&
                                        <div className="absolute right-0 mt-0 mr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="text-error" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <circle cx="12" cy="12" r="9" />
                                                <line x1="12" y1="8" x2="12" y2="12" />
                                                <line x1="12" y1="16" x2="12.01" y2="16" />
                                            </svg>
                                        </div>
                                    }
                                </div>
                        
                                <label htmlFor="password" className="label mt-2  pb-1">
                                    <span className="label-text">Password</span>
                                    {errors.password && <FormErrorTag>{errors.password.message}</FormErrorTag>}
                                </label>
                                <div className="relative flex items-center justify-center">
                                    <input {...register("password", {required: "Field is required.", 
                                    minLength: {value: 6, message: "Must be at least 6 characters."}})} 
                                    id="password" type="password" 
                                    className={`input input-bordered bg-base-100 w-full ${errors.password && "pr-9"}`} />
                                    {errors.password && 
                                    <div className="absolute right-0 mt-0 mr-2" data-tip={errors.password.message}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-error" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <circle cx="12" cy="12" r="9" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                    </div>}
                                </div>

                                <label htmlFor="confirm-password" className="label mt-2  pb-1">
                                    <span className="label-text">Confirm Password</span>
                                    {errors.confirmPassword && <FormErrorTag>{errors.confirmPassword.message}</FormErrorTag>}
                                </label>
                                <div className="relative flex items-center justify-center">
                                    <input {...register("confirmPassword", {required: "Field is required.", 
                                    minLength: {value: 6, message: "Must be at least 6 characters."},
                                        validate: (val: string) => {
                                            if (val.length < 1) {
                                                return "Field is required."
                                            }
                                            else if (watch('password') !== val) {
                                            return "Passwords do not match.";
                                            }
                                        }    
                                    })} 
                                    id="confirm-password" type="password" 
                                    className={`input input-bordered bg-base-100 w-full ${errors.confirmPassword && "pr-9"}`} />
                                    {errors.confirmPassword && 
                                        <div className="absolute right-0 mt-0 mr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="text-error" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                <circle cx="12" cy="12" r="9" />
                                                <line x1="12" y1="8" x2="12" y2="12" />
                                                <line x1="12" y1="16" x2="12.01" y2="16" />
                                            </svg>
                                        </div>
                                    }
                                </div>

                                <div className={`flex flex-row flex-1 text-sm items-center border border-error text-base-content/90 bg-error/10 rounded-lg 
                                transition-all duration-300 ${submitError ? "max-h-40 opacity-100 px-3 py-2 mt-5" : "max-h-0 p-0 opacity-0 overflow-hidden  "}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 stroke-error flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{submitError}</span>
                                </div>

                                <div className="mt-5">
                                    <button type="submit" className={`btn btn-primary w-full ${isLoadingNewUser ?? "pointer-events-none"}`}>
                                        {isLoadingNewUser ? <LoadingCircle className="h-4/5" /> : "Register"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                :
                    <div className="flex flex-col items-center bg-base-200 border border-base-300 p-5 shadow-lg rounded-lg lg:w-1/3 md:w-1/2 w-[calc(100%-2rem)]">
                        <p className="text-2xl text-center mb-6">
                            Account successfully created!
                        </p>
                        <Link to="/login" state={{referrer: "register"}} className="btn btn-primary btn-outline btn-md">Continue to Login</Link>
                    </div>
                }
            </div>
        </div>
	);
}

export default Register;