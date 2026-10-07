import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable('application_status_histories', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    application_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'applications',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    from_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    to_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    changed_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  await queryInterface.addIndex('application_status_histories', ['application_id']);
  await queryInterface.addIndex('application_status_histories', ['changed_by']);
  await queryInterface.addIndex('application_status_histories', ['created_at']);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('application_status_histories');
};
