import { useState,useEffect } from "react";
import { validateToken, decodeToken, removeToken } from "../../services/auth";

interface userToken{
    id: number | null;
    type: string | null;
}

export const useAuth = () =>{
    const [user, setUser] = useState<userToken>({id: null, type: null});

    useEffect(() => {
        const checkAuth = () => {
            if (validateToken()) {
                const newToken = decodeToken();
                setUser({id: newToken?.id||null, type: newToken?.type||null});
            } else {
                setUser({id:null, type:null});
                removeToken();
            }
        }

        checkAuth();
    }, [user]);

   return user;
}