import { useQuery } from "@tanstack/react-query";
import { getBmi, getBmrAndTdee } from "../services/measurement.service";

export function useMeasurement() {
    const userBmi = useQuery({
        queryKey: ['user-bmi'],
        queryFn: getBmi
    })
    
    const userEnergyNeeds = useQuery({
        queryKey: ['user-energy-needs'],
        queryFn: getBmrAndTdee
    })
    return {
        userBmi,
        userEnergyNeeds
    };
}