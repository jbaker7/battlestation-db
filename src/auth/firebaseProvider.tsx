// import React, { useEffect, useState, FC } from "react";
// import { AuthContext } from "../auth/firebaseContext";
// import firebase from "firebase/app";
// //import { auth } from "../firebase";
// import { getAuth, User } from "firebase/auth";

// type Props = {
//     children?: React.ReactNode
//   };

// export function AuthProvider({ children }: Props) {

//     const auth = getAuth();
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
//       setUser(firebaseUser);
//     });

//     return unsubscribe;
//   }, []);

//   return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
// };