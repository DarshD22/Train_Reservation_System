
import {sequelize} from '../config/db.js';
import { DataTypes } from 'sequelize';

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
});

export default User;