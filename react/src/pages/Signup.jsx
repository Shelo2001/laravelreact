import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axiosclient";
import { useStateContext } from "../contexts/ContextProvider";

const Signup = () => {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();

    const [errors, setErrors] = useState(null);

    const { setToken, setUser } = useStateContext();

    const onSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
        };
        axiosClient
            .post("/signup", payload)
            .then(({ data }) => {
                setToken(data.token);
                setUser(data.user);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Sign Up</h1>
                    {errors && (
                        <div className="alert">
                            {Object.keys(errors).map((key) => (
                                <p key={key}>{errors[key][0]}</p>
                            ))}
                        </div>
                    )}
                    <input ref={nameRef} placeholder="Full Name" type="text" />
                    <input ref={emailRef} placeholder="Email" type="email" />
                    <input
                        ref={passwordRef}
                        placeholder="Password"
                        type="password"
                    />
                    <input
                        ref={passwordConfirmationRef}
                        placeholder="Confirm Password"
                        type="password"
                    />
                    <button className="btn btn-block">Signup</button>
                    <p className="message">
                        Already Registered?{" "}
                        <Link to="/login">Login Into Your Account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
