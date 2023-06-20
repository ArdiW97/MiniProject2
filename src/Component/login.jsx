import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const API_KEY = process.env.REACT_APP_APIKEY;
const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Required"),
            password: Yup.string().required("Required"),
        }),
        onSubmit: (values) => {
            setIsLoading(true);
            axios({
                method: "get",
                url: `https://api.themoviedb.org/3/authentication/token/new?api_key=${API_KEY}`,
            })
                .then(function (response) {
                    const request_token = response.data.request_token;
                    console.log(request_token);
                    axios({
                        method: "post",
                        url: 'https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=6ca3514b6e475806d3af24a6e29240ef',
                        data: {
                            username: values.username,
                            password: values.password,
                            request_token: request_token,
                        },
                    })
                        .then(function (response) {
                            console.log(response.data);
                            axios({
                                method: "post",
                                url: `https://api.themoviedb.org/3/authentication/session/new?api_key=${API_KEY}`,
                                data: {
                                    request_token: request_token,
                                },
                            })
                                .then(function (response) {
                                    const session_id = response.data.session_id;
                                    console.log(session_id);
                                    if (session_id) {
                                        localStorage.setItem("SID", session_id);
                                        // navigate("/Home");
                                        alert(
                                            `Berhasil login sebagai: ${values.username} dengan session id: ${session_id}`
                                        );
                                    }
                                    setIsLoading(false);
                                })
                                .catch(function (error) {
                                    alert(error.message);
                                    setIsLoading(false);
                                });
                        })
                        .catch(function (error) {
                            alert(error.message);
                            setIsLoading(false);
                        });
                })
                .catch(function (error) {
                    alert(error.message);
                    setIsLoading(false);
                });
        },
    });

    console.log(formik);
    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="username"></label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Input Name"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                />
                <label htmlFor="password"></label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Input Password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                />
                <button type="submit" disabled={!formik.isValid || isLoading}>Submit</button>
            </form>
        </>
    );
};

export default LoginForm;
