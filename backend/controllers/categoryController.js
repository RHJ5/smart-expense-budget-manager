const { Op } = require('sequelize');
const Category = require('../models/Category');

async function getCategories(req, res) {
  try {
    const categories = await Category.findAll({
      where: {
        [Op.or]: [
          { isDefault: true },
          { userId: req.userId },
        ],
      },
      order: [['name', 'ASC']],
    });

    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function createCategory(req, res) {
  try {
    const { name, type } = req.body;

    const newCategory = await Category.create({
      name,
      type,
      isDefault: false,
      userId: req.userId,
    });

    res.status(201).json({
      message: 'Category ban gayi',
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = { getCategories, createCategory };