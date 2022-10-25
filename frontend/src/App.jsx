import { Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from "react-router-dom"; 

import Loading from "@components/Loading";
import Header from '@components/Header';
import routes from "./routes";

import './App.css';
import "@assets/fonts/NotoSans-Light.ttf"

const App = () => {
  let location = useLocation();
  let activeHeaderRoute = ["/timetable", "/tasks", "/settings"].includes(location.pathname) ? location.pathname : null;

  const [ error, setError ] = useState(null);
  const [ user, setUser ] = useState({});

  useEffect(() => {
    if (!activeHeaderRoute) return;

    fetch("/api/users/@me")
    .then((resp) => resp.json())
    .then((data) => {
      if (data.error) {
        setError(data.message)
      }
      else {
        setUser(data.content)
      }
    })
    .catch((e) => {
      setError("An unexpected error occurred")
    });
  }, []);


  if (activeHeaderRoute && error === "Unauthorized") {
    return ( <Navigate to={`/login?prelogin=${encodeURIComponent(activeHeaderRoute)}`}/> )
  }
  return (
    <div className="App">
      <Header active={activeHeaderRoute} displayName={user.name}/>
      <div className="page-content">
        <Suspense fallback={<Loading />}>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={`path-${route.path}-${index}`}
                path={route.path}
                exact={route.exact}
                element={<route.element />}
              />
            ))}
          </Routes>   
        </Suspense>
      </div>
    </div>
  );
};


export default App;
