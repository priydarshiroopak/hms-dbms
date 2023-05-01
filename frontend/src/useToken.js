import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token || false;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
    console.log('saving token :', userToken.token);
  };

  return {
    setToken: saveToken,
    token
  }
}

export function checkAuth(){
    console.log("checking authentication on loading!");
}

// export function requireAuth(nextState, replace, next, token) {
    // const { token, setToken } = useToken();
    // console.log("checking authentication on loading!");
    // const authenticated = token;
    // if (authenticated==1) {
    //   replace({
    //     pathname: "/",
    //     state: {nextPathname: nextState.location.pathname}
    //   });
    // }
    // next();
// }