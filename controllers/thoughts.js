const { Thought, User } = require('../models');

// function to find all thoughts
const getThoughts = (req, res) => {
    Thought.find()
        .sort({ createdAt: -1 })
        .then((thoughts) => {
            res.json(thoughts);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

// function to find one thought
const getOneThought = (req, res) => {
    Thought.find({ _id: req.params.thoughtId })
        .then((thought) => {
            if (!thought) {
                res.status(500).json({ message: 'Cannot find thought with this ID!' });
            }

            res.json(thought);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

