import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import sequelize from "../db_connection";
import { User } from "./users";

interface TaskAttributes {
    id: number;
    user_id: number;
    title: string;
    description: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'id'> {}

export class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
    public id!: number;
    public user_id!: number;
    public title!: string;
    public description!: string;
    public status!: string;
    public created_at!: Date;
    public updated_at!: Date;
}

Task.init({
    id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.NUMBER,
        references: {
            model: User,
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM,
        values: ['pending', 'in_progress', 'done'],
        defaultValue: 'pending'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},
    {
        sequelize,
        tableName: 'tasks',
        createdAt: 'created_at',
        underscored: true,
        updatedAt: 'updated_at'
    }
)
