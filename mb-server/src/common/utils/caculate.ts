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