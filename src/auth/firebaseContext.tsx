import React from "react";
import firebase from "firebase/app";
import { User } from "firebase/auth";

export const AuthContext = React.createContext<User | null>(null);