import { useQuery } from "@tanstack/react-query";
import { getBmi } from "../services/measurement.service";

export function useMeasurement() {
    const userBmi = useQuery({
        queryKey: ['user-bmi'],
        queryFn: getBmi
    })
    return {
        userBmi
    };
}