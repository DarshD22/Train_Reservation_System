
import {sequelize} from '../config/db.js';
import { DataTypes } from 'sequelize';
const Seat = sequelize.define('Seat', {
  row: DataTypes.INTEGER,
  seat_number: DataTypes.INTEGER,
  is_reserved: DataTypes.BOOLEAN,
  reserved_by: DataTypes.INTEGER,
});

export default Seat;