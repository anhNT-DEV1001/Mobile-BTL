import { api } from "@/src/common/apis";
import { BaseResponse } from "@/src/common/types";

export const getBmi = async(): Promise<BaseResponse<any>> => {
    const res = await api.get('/user/bmi');
    return res.data;
}