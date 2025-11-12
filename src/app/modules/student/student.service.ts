import { StudentModel } from './student.model';
import { IStudent } from './student.interface';
import { AppError } from '../../utils/AppError';
const httpStatus = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

const createStudentIntoDB = async (studentData: IStudent) => {
  const existingStudent = await StudentModel.isUserExists(studentData.id);
  if (existingStudent) {
    throw new AppError('Student already exists', httpStatus.BAD_REQUEST);
  }

  const result = await StudentModel.create(studentData);
  return result;
};

const getAllStudentsFromDB = async (query: Record<string, unknown> = {}) => {
  const queryObj = { ...query };

  // Filtering
  const excludeFields = ['page', 'limit', 'sortBy', 'sortOrder', 'fields'];
  excludeFields.forEach((el) => delete queryObj[el]);

  let searchTerm = '';
  if (query?.searchTerm) {
    searchTerm = query.searchTerm as string;
    delete queryObj.searchTerm;
  }

  const searchableFields = [
    'email',
    'name.firstName',
    'name.lastName',
    'presentAddress',
  ];
  const searchQuery = searchTerm
    ? {
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
      }
    : {};

  const filterQuery = { ...queryObj, ...searchQuery };

  // Sorting
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
  const sortOptions = { [sortBy as string]: sortOrder };

  // Pagination
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Field Limiting
  const fields = query.fields
    ? (query.fields as string).split(',').join(' ')
    : '';

  const result = await StudentModel.find(filterQuery)
    .sort(sortOptions as Record<string, import('mongoose').SortOrder>)
    .skip(skip)
    .limit(limit)
    .select(fields);

  const total = await StudentModel.countDocuments(filterQuery);

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findOne({ id, isDeleted: false });
  if (!result) {
    throw new AppError('Student not found', httpStatus.NOT_FOUND);
  }
  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<IStudent>) => {
  const result = await StudentModel.findOneAndUpdate(
    { id, isDeleted: false },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!result) {
    throw new AppError('Student not found', httpStatus.NOT_FOUND);
  }

  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const result = await StudentModel.findOneAndUpdate(
    { id, isDeleted: false },
    { isDeleted: true },
    { new: true },
  );

  if (!result) {
    throw new AppError('Student not found', httpStatus.NOT_FOUND);
  }

  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};
