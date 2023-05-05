import jwt, { TokenExpiredError } from "jsonwebtoken";
import TokenModel from "../DB/models/Token";

/**
 * @IMPORTANT Right now user can login in system only from 1 device
 */
class TokenService {
    public generateTokens(payload: string | object | Buffer) {
        // TODO change expiration time
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET_KEY!, { expiresIn: "10s" });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET_KEY!, { expiresIn: "14d" });

        return { refreshToken, accessToken };
    }

    public async saveRefreshTokenToDB(userId: string, refreshToken: string) {
        const existingToken = await TokenModel.findOne({ user: userId });

        if (existingToken) {
            existingToken.refreshToken = refreshToken;
            return await existingToken.save();
        }

        return await TokenModel.create({ user: userId, refreshToken });
    }

    public async removeToken(refreshToken: string) {
        const tokenData = await TokenModel.deleteOne({ refreshToken });

        return tokenData;
    }

    public async findToken(refreshToken: string) {
        const tokenData = await TokenModel.findOne({ refreshToken });

        return tokenData;
    }

    public validateAccessToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET_KEY!) as jwt.JwtPayload;

            return userData;
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                throw err;
            }

            return null;
        }
    }

    public validateRefreshToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET_KEY!) as jwt.JwtPayload;

            return userData;
        } catch (err) {
            return null;
        }
    }
}

export default new TokenService();
