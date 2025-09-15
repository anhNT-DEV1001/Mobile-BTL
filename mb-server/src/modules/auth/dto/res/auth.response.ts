import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "src/modules/user/dto/res/user.response";

export class TokensResponse {
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    refreshToken: string;
}

export class LoginResponse {
    @ApiProperty()
    user: UserResponse;
    @ApiProperty()
    tokens: TokensResponse
}