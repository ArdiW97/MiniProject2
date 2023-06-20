import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../Style/Navbar.css";
import Movie from "./Card";

const API_KEY = process.env.REACT_APP_APIKEY;
const Signup = () => {
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
                                    if (session_id) {
                                        localStorage.setItem("SID", session_id);
                                        window.location.href = "/"
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

    const handleLogout = () => {
        window.localStorage.removeItem("SID");
        window.alert("You have successfully logged out.");
        window.location.href = "/"
    };

    const [username, setUsername] = useState("");
  useEffect(() => {
    const sessionID = localStorage.getItem("SID");
    if (sessionID) {
      axios({
        method: "get",
        url: `https://api.themoviedb.org/3/account?api_key=${API_KEY}&session_id=${sessionID}`
      })
      .then((response) => {
        setUsername(response.data.username);
      })
      .catch((error) => {
      })
    }
  }, []);

    return (
        <>
            <nav className="navbar bg-dark fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand">T-Movies</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="offcanvas offcanvas-end bg-dark" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">T-Movies</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <li className="nav-item">
                                    <a className="nav-link" aria-current="page" href="#">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">About Me</a>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Genre
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-dark">
                                        <li><a className="dropdown-item" href="#">Action</a></li>
                                        <li><a className="dropdown-item" href="#">War</a></li>
                                        <li><a className="dropdown-item" href="#">Horror</a></li>
                                        <li><a className="dropdown-item" href="#">Anime</a></li>
                                    </ul>
                                </li>
                                <li className="nav-item">
                                    {localStorage.getItem("SID") ? (
                                        <a className="dropdown-item">{username}</a>
                                    ) : (
                                        <a className="login-trigger" href="#" data-bs-target="#login" data-bs-toggle="modal">Login</a>
                                    )}
                                </li>
                                <li className="nav-item">
                                    {localStorage.getItem("SID") ? (
                                        <a className="prof" onClick={handleLogout}>logout</a>
                                    ) : (
                                        <a className="dropdown-item">login to see more movies</a>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <Movie />

            {/* Modal Login */}
            <div id="login" className="modal fade" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <h4>Login</h4>
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
                                <br/>
                                <label htmlFor="password"></label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Input Password"
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                />
                                <br/>
                                <button type="submit" disabled={!formik.isValid || isLoading}>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup
