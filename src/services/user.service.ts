import User, { IUser } from '../models/user.model';
import bcrypt from 'bcrypt';

export const createUser = async (data: { name: string; email: string; password: string }) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(data.password, salt);
  const user = new User({ name: data.name, email: data.email, password: hash });
  return user.save();
};

export const findUserByEmail = async (email: string) => {
  return User.findOne({ email }).select('+password');
};
