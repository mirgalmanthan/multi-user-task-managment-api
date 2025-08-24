import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db_connection";

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    refresh_token: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'refresh_token'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public created_at!: Date;
    public updated_at!: Date;
    public refresh_token!: string;
}

User.init({
    id: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'users',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})