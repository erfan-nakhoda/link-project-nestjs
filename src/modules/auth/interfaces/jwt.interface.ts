export interface IPayload {
    userId : number,
    roleId : number
}
export interface IAccessTokenPayload {
    secret : string,
    payload : IPayload
}
export interface IVerifyAccessTokenPayload {
    secret : string,
    token : string
}