import { UserGender, WorkOutGenderFactor, WorkOutLevel } from "../enums";
import { BmiLevel } from "../enums/bmi.enum";

/**
 * Meno : Thuật toán đánh giá độ khó của bài tập dựa trên mức cân , bmi , giới tính
 * CreatedBy : Nguyễn Tuấn Anh
 * UpdatedBy : 
 * @param weight 
 * @param height 
 * @param workWeight 
 * @param gender 
 * @returns WorkOutLevel
 */
export function caculateStrengthLevel(weight: number, height: number, workWeight: number, gender: UserGender): WorkOutLevel {
    // Tính BMI
    const heightM = height / 100; // cm -> met
    const userBmi = weight / (heightM * heightM);
    // Chỉ số sức mạnh
    const SI = workWeight / weight;

    // Tính hệ số cân cân nặng
    let index = 1;
    if (userBmi < BmiLevel.UNDERWEIGHT) index = 1;
    else if (userBmi > BmiLevel.NORMALWEIGHT && userBmi < BmiLevel.OVERWEIGHT) index = 0.95
    else if (userBmi > BmiLevel.OVERWEIGHT) index = 0.85

    //hệ số giới tính nam / nữ -> sức mạnh khác nhau
    const genderFactor = gender === UserGender.MALE ? 1 : WorkOutGenderFactor
    const difficult = SI * index * genderFactor;

    if (difficult < 0.4) return WorkOutLevel.BEGINNER;
    if (difficult < 0.8) return WorkOutLevel.INTERMEDIATE;
    if (difficult < 1.2) return WorkOutLevel.ADVANCED;
    return WorkOutLevel.GYMLORD;
}

export function caculateAge(dob: Date): Number {
    const year = dob.getFullYear();
    const nowYear = new Date().getFullYear();
    return nowYear - year;
}

export function caculateBmi(height : number , weight: number) {
    const bmi = weight / (height/100 * height/100);
    return Math.round(bmi * 10) / 10;
}

export enum LifestyleMultiplier {
    SEDENTARY = 1.2,
    LIGHTLY_ACTIVE = 1.375,
    MODERATELY_ACTIVE = 1.55,
    VERY_ACTIVE = 1.725,
    EXTRA_ACTIVE = 1.9
}

export function caculateBmrAndTdee(height: number, weight: number, dob: Date, gender: UserGender) {
    const age = caculateAge(dob);

    let bmr: number;

    // Tính BMR theo công thức Mifflin-St Jeor
    if (gender === UserGender.MALE) {
        bmr = (9.99 * weight) + (6.25 * height) - (4.92 * Number(age)) + 5;
    } else { // UserGender.FEMALE
        bmr = (9.99 * weight) + (6.25 * height) - (4.92 * Number(age)) - 161;
    }

    const roundedBmr = Math.round(bmr);

    // Tính toán TDEE cho các mức lối sống
    const energyNeeds = {
        sedentary: Math.round(roundedBmr * LifestyleMultiplier.SEDENTARY),
        lightlyActive: Math.round(roundedBmr * LifestyleMultiplier.LIGHTLY_ACTIVE),
        moderatelyActive: Math.round(roundedBmr * LifestyleMultiplier.MODERATELY_ACTIVE),
        veryActive: Math.round(roundedBmr * LifestyleMultiplier.VERY_ACTIVE),
        extraActive: Math.round(roundedBmr * LifestyleMultiplier.EXTRA_ACTIVE)
    };

    return {
        bmr: roundedBmr,
        energyNeeds: energyNeeds
    };
}

// export function caculateWorkoutLevel(data : any) {
    
// }