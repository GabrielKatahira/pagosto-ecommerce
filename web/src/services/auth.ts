import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
    id: number;
    type:string;
    name:string;
}


export const setToken = (token: string):void => {
    localStorage.setItem("token", token);

}

export const getToken = (): string | null => {
    return localStorage.getItem("token");
}

export const removeToken = ():void => {
    localStorage.removeItem("token");
}

export const decodeToken = ():CustomJwtPayload | null => {
    const token = getToken();
    if (!token) return null;
    try {
        return jwtDecode<CustomJwtPayload>(token);
    } catch(err) {
        console.error("Falha no token:", err);
        return null;
    }
}

export const validateToken = ():boolean => {
    const token = decodeToken();
    if (!token || !token.exp) return false;
    const currDate = Math.floor(Date.now()/ 1000)
    return token.exp > currDate;
}

