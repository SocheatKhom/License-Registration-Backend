import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable('audit_logs', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    entity_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    entity_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    old_values: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    new_values: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  await queryInterface.addIndex('audit_logs', ['user_id']);
  await queryInterface.addIndex('audit_logs', ['entity_type']);
  await queryInterface.addIndex('audit_logs', ['entity_id']);
  await queryInterface.addIndex('audit_logs', ['created_at']);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('audit_logs');
};
