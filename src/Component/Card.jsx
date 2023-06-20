import React from "react";
import "../Style/Card.css"
import { getMovieList, searchMovie } from '../Api';
import { useEffect, useState } from 'react';

const Movie = () => {
    const [popularMovies, setPopularMovies] = useState([])

    useEffect(() => {
        getMovieList().then((result) => {
            setPopularMovies(result)
        })
    }, [])

    const search = async (q) => {
        if (q.length > 2) {
            const query = await searchMovie(q)
            setPopularMovies(query.results)
        }
    }

    const PopularMoviesList = () => {
        return popularMovies.map((movie, i) => {
          return (
            <React.Fragment key={movie.id}>
              <div className="card" style={{ width: "18rem" }}>
                <img
                  src={`${process.env.REACT_APP_BASEIMGURL}/${movie.poster_path}`}
                  className="card-img-top"
                  alt="..."
                  data-bs-target={`#movie-card${movie.id}`}
                  data-bs-toggle="modal"
                />
              </div>
      
              <div id={`movie-card${movie.id}`} className="modal" role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-body">
                      <h5 className="modal-title">{movie.title}</h5>
                      <p className="modal-text">{movie.overview}</p>
                      <ul className="list-group list-group-flush">
                        <li className="movie-date">Release: {movie.release_date}</li>
                        <li className="movie-vote">Rate: {movie.vote_average}</li>
                        <li className="movie-id">Id: {movie.id}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        });
      };
      
    return (
        <>
            <div className="App">
                <header className="App-header">
                    <div className="search-box">
                        <div className="search-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search"
                                viewBox="0 0 16 16">
                                <path
                                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                            </svg>
                        </div>
                        <div className="search-input">
                            <input
                                placeholder='Search your Movie'
                                className='Movie-Search'
                                onChange={({ target }) => search(target.value)}
                            />
                        </div>
                    </div>
                    <div className="movie-countiner">
                        <PopularMoviesList />
                    </div>
                </header>
            </div>
        </>
    );

}

export default Movie;