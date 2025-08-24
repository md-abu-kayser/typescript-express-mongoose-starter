import mongoose from 'mongoose';

export type UserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type Guardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type LocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';
export type Gender = 'male' | 'female' | 'other';
export type Status = 'active' | 'blocked';

export interface IStudent {
  id: string;
  name: UserName;
  gender: Gender;
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: BloodGroup;
  presentAddress: string;
  permanentAddress: string;
  guardian: Guardian;
  localGuardian: LocalGuardian;
  profileImg?: string;
  isActive: Status;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Methods interface for instance methods
export interface IStudentMethods {
  isUserExists(id: string): Promise<IStudent | null>;
}

// Static methods interface
export interface StudentModel
  extends mongoose.Model<IStudent, object, IStudentMethods> {
  isUserExists(id: string): Promise<IStudent | null>;
}
