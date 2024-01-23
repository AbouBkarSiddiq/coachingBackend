const Program = require('../models/programModel');

exports.createProgram = async (req, res) => {
  try {
    const newProgram = new Program({
      ...req.body,
      trainerId: req.userId
    });

    await newProgram.save();
    res.status(201).json({ message: "Program created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find();
    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const updatedProgram = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProgram) return res.status(404).json({ message: 'Program not found' });
    res.status(200).json(updatedProgram);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
