import { useState, useEffect } from "react";

import { auth } from "../../firebase.config";
import { onAuthStateChanged } from "firebase/auth";

import React from "react";

const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      }
      setCheckingStatus(false);
    });
  }, []);

  return { loggedIn, checkingStatus };
};

export default useAuthStatus;
