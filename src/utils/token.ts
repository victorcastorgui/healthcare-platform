import Cookies from "js-cookie";

export const setToken = (token: string) => {
    return Cookies.set('token', token)
}

export const getToken = (): string | undefined  => {
    return Cookies.get('token')
}

export const removeToken = () => {
    return Cookies.remove('token')
}

export const setRoleId = (roleId: string) => {
    return Cookies.set('roleId', roleId)
}

export const getRoleId = (): string | undefined => {
    return Cookies.get('roleId')
}

export const removeRoleId = () => {
    return Cookies.remove('roleId')
}