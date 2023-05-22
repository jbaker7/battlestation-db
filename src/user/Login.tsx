import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import {Link} from "react-router-dom";
import {useForm} from "react-hook-form";
import usePageTitle from '../usePageTitle';
import {ReactComponent as LoadingCircle} from '../components/loading-circles.svg';
import {authContext} from '../useAuth';
import {signInWithEmailAndPassword } from "firebase/auth";
import FormErrorTag from '../components/FormErrorTag';

function Login() {
    usePageTitle("Login | BattlestationDB");

    const authState = useContext(authContext);

    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [loginSuccessful, setLoginSuccessful] = useState(false);

    let navigate = useNavigate();
    let location = useLocation();

    interface LocationState {
        referrer: string | null;
    }

    let locationState = location.state as LocationState;

    useEffect(() => {
        if(authState.user) {
            if((locationState && locationState.referrer === "register") || (locationState && locationState.referrer === "passwordReset")) {
                navigate("/", {replace: true});
            }
            else {
                navigate(-1);
            }
        }
    }, [authState, navigate, locationState])

    function getErrorMessage(code: string) {
        switch (code) {
            case 'auth/wrong-password':
                return "Incorrect password.";
            case 'auth/user-not-found':
                return "User not found.";
            case 'auth/too-many-requests':
                return "Too many login attempts."
            default:
                return "Username or password incorrect."
        }
    }

    type FormInputs = {
        email: string;
        password: string;
    };

    const {register, handleSubmit, formState: {errors}} = useForm<FormInputs>({
        mode: 'onSubmit',
        reValidateMode: 'onBlur'
    });

    function handleLogin(data: FormInputs) {

        setIsLoading(true);

        signInWithEmailAndPassword(authState.firebaseAuth, data.email, data.password)
            .then((userCredential) => {
                setIsLoading(false);
                setLoginSuccessful(true);
            })
            .catch((error) => {
                console.log(error);
                setLoginError(getErrorMessage(error.code));
                setIsLoading(false);
            });
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
                {!loginSuccessful ? 
                    <div className="bg-base-200 border border-base-300 px-10 py-5 shadow-lg rounded-lg lg:w-1/3 md:w-1/2 w-[calc(100%-2rem)]">
                        <p tabIndex={0} className="focus:outline-none text-2xl text-center font-bold leading-6">
                            Login to Your Account
                        </p>
                        <p tabIndex={0} className="focus:outline-none text-center text-md mt-4 font-regular leading-none">
                            Don't have account? <Link to="/register" className="link link-primary">Sign up here</Link>
                        </p>
                        
                        <div className="form-control w-full">
                            <form onSubmit={handleSubmit(handleLogin)}>
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
                                    </div>}
                                </div>
                                <label htmlFor="password" className="label mt-2  pb-1">
                                        <span className="label-text">Password</span>
                                        {errors.password && <FormErrorTag>{errors.password.message}</FormErrorTag>}
                                    </label>
                                <div className="relative flex items-center justify-center mb-4">
                                    <input {...register("password", {required: "Field is required."})} 
                                        id="password" type="password" 
                                        className={`input input-bordered bg-base-100 w-full ${errors.password && "pr-9"}`} />
                                    {errors.password && 
                                    <div className="absolute right-0 mt-0 mr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-error" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <circle cx="12" cy="12" r="9" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                    </div>}
                                </div>
                                <div className={`flex flex-row flex-1 text-sm items-center border border-error text-base-content/90 bg-error/10 rounded-lg 
                            transition-all duration-300 ${loginError ? "max-h-40 opacity-100 px-3 py-2 mt-5" : "max-h-0 p-0 opacity-0 overflow-hidden  "}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-4 stroke-error flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{loginError}</span>
                            </div>
                                <div className="mt-5">
                                    <button type="submit" className={`btn btn-primary w-full ${isLoading ?? "pointer-events-none"}`}>
                                        {isLoading ? <LoadingCircle className="h-4/5" /> : "Login"}
                                        </button>
                                </div>
                                <p tabIndex={0} className="focus:outline-none text-center text-sm mt-4 font-regular leading-none">
                                    Forgot Password? <Link to="/login/password-reset" className="link link-primary">Click here</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                :
                    <div className="flex flex-col items-center bg-base-200 border border-base-300 p-10 shadow-lg rounded-lg lg:w-1/3 md:w-1/2 w-[calc(100%-2rem)]">
                        <p className="text-2xl mb-5">
                            Login Successful!
                        </p>
                        <Link to="/" className="btn btn-primary btn-outline btn-md">Continue</Link>
                    </div>
                }
            </div>
        </div>
        
	);
}

export default Login;