import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class Book extends Model {
  public id!: number;
  public title!: string;
  public author!: string;
  public year!: number;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'books',
  }
);
