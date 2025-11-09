const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

class User extends Model {
  // Instance method to compare passwords
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Remove sensitive data from JSON output
  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Please enter a valid email'
      }
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase().trim());
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [6, 255],
        msg: 'Password must be at least 6 characters long'
      }
    }
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: {
        args: [1, 50],
        msg: 'First name cannot exceed 50 characters'
      }
    },
    set(value) {
      this.setDataValue('firstName', value.trim());
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: {
        args: [1, 50],
        msg: 'Last name cannot exceed 50 characters'
      }
    },
    set(value) {
      this.setDataValue('lastName', value.trim());
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'accountant'),
    defaultValue: 'user'
  },
  panNumber: {
    type: DataTypes.STRING(10),
    unique: true,
    allowNull: true,
    validate: {
      is: {
        args: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        msg: 'Please enter a valid PAN number'
      }
    },
    set(value) {
      if (value) {
        this.setDataValue('panNumber', value.toUpperCase().trim());
      }
    }
  },
  aadharNumber: {
    type: DataTypes.STRING(14),
    allowNull: true,
    validate: {
      is: {
        args: /^\d{4}-\d{4}-\d{4}$/,
        msg: 'Please enter a valid Aadhaar number (XXXX-XXXX-XXXX)'
      }
    },
    set(value) {
      if (value) {
        this.setDataValue('aadharNumber', value.trim());
      }
    }
  },
  phone: {
    type: DataTypes.STRING(10),
    allowNull: true,
    validate: {
      is: {
        args: /^[6-9]\d{9}$/,
        msg: 'Please enter a valid Indian mobile number'
      }
    },
    set(value) {
      if (value) {
        this.setDataValue('phone', value.trim());
      }
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  addressStreet: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  addressCity: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  addressState: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  addressPincode: {
    type: DataTypes.STRING(6),
    allowNull: true,
    validate: {
      is: {
        args: /^\d{6}$/,
        msg: 'Please enter a valid 6-digit pincode'
      }
    }
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['email'] },
    { unique: true, fields: ['panNumber'], where: { panNumber: { [sequelize.Sequelize.Op.ne]: null } } }
  ],
  hooks: {
    // Hash password before creating user
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    // Hash password before updating if it was changed
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = User;