/*
 * Representation of a logged in user
 */
export class User {
    constructor(
        private email: string,
        private userId: string,
        private _token: string,
        private _tokenExpirationDate: Date,
    ) {};

    /*
     * TS getter (accessed by user.token)
     * executed to ensure the validity of the token, return null if no longer valid
     */
    get token(): string {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }
}