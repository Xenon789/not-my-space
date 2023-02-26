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
    Thought.find({ _id: thoughtID })
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

const createThought = (req, res) => {
    let body = req.body;
    Thought.create(body)
        .then((thought) => {
            User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: thought._id }},
                { new: true }
            );
        })
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'There is no user with this ID!'});
            }

            res.json({ message: 'Thought was created!'});
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

// function to update a thought
const updateThought = (req, res) => {
    let body = req.body;
    let thoughtID = req.params.thoughtId;
    Thought.findOneAndUpdate(
        { _id: thoughtID }, 
        { $set: body }, 
        { runValidators: true, new: true}
        )
        .then((thought) => {
            if (!thought) {
                res.status(404).json({ message: 'There is no thought with this ID!'});
            }

            res.json(thought);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

// function to delete a thought
const deleteThought = (req, res) => {
    let thoughtID = req.params.thoughtId;
    Thought.findOneAndRemove({ _id: thoughtID })
        .then((thought) => {
            if (!thought) {
            return res.status(404).json({ message: 'No thought with this id!' });
            }

            User.findOneAndUpdate(
            { thoughts: thoughtID },
            { $pull: { thoughts: thoughtID } },
            { new: true }
            );
        })
        .then((user) => {
            if (!user) {
            res.status(404).json({ message: 'Thought created but no user with this id!' });
            }
            res.json({ message: 'Thought successfully deleted!' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

// function to add a reaction to a thought
const addReaction = (req, res) => {
    let thoughtID = req.params.thoughtId;
    Thought.findOneAndUpdate(
        { _id: thoughtID },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
        )
        .then((thought) => {
            if (!thought) {
                res.status(404).json({ message: 'Cannot find thought with this ID!' });
            }
            res.json(thought);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

// funciton to remove reaction from a thought
const removeReaction = (req, res) => {
    let thoughtID = req.params.thoughtId;
    let reactionID = req.params.reactionId;
    Thought.findOneAndUpdate(
        { _id: thoughtID },
        { $pull: { reactions: { reactionId: reactionID } } },
        { runValidators: true, new: true }
        )
        .then((thought) => {
            if (!thought) {
                res.status(404).json({ message: 'Cannot find thought with this ID!' });
            }
            res.json(thought);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

module.exports = {
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction,
  };
  