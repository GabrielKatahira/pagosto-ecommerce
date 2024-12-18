import { useState,useEffect } from "react";
import { validateToken, decodeToken, removeToken} from "../../services/auth";

interface userToken{
    id: number | null;
    type: string | null;
    name: string | null;
}

export const useAuth = () =>{
    const [user, setUser] = useState<userToken>({id: null, type: null, name: null});

    useEffect(() => {
        const checkAuth = () => {
            if (validateToken()) {
                const newToken = decodeToken();
                setUser({id: newToken?.id||null, type: newToken?.type||null, name: newToken?.name||null});
            } else {
                setUser({id:null, type:null, name:null});
                removeToken();
            }
        }

        checkAuth();
        const interval = setInterval(checkAuth, 1000);
        return () => clearInterval(interval);

    }, []);

   return user;
}