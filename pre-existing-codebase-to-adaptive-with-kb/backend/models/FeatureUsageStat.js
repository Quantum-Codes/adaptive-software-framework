"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FeatureUsageStat extends Model {}

  FeatureUsageStat.init(
    {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      featureId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      timeBucket: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.DATEONLY,
      },
      usageCount: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },
    },
    {
      modelName: "FeatureUsageStat",
      sequelize,
      tableName: "feature_usage_stats",
      timestamps: false,
    },
  );

  return FeatureUsageStat;
};

