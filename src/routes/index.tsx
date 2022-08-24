import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Loaging } from "../components/Loading";

import { SignIn } from "../screens/SignIn";
import { AppRoutes } from "./app.routes";

export function Routes() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User>();

    useEffect(() => {
        const subscribe = auth().onAuthStateChanged(response => {
            setUser(response);
            setLoading(false)
        })

        return subscribe;
    }, []);

    if(loading) {
        return <Loaging />
    }

    return(
        <NavigationContainer>
            {user ? <AppRoutes /> : <SignIn />}
        </NavigationContainer>
    )
}