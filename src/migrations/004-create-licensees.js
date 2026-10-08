import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable('licensees', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    application_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'applications',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    national_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    nationality: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Cambodian',
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  await queryInterface.addIndex('licensees', ['application_id'], { unique: true });
  await queryInterface.addIndex('licensees', ['national_id']);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('licensees');
};
