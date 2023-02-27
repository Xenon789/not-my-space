const { User, Thought } = require('../models');

// function to get all users
const getUsers = (req, res) => {
    User.find()
        .select('-__v')
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

// function to get one user
const getOneUser = (req, res) => {
    let userID = req.params.userId;
    User.findOne({ _id: userID })
        .select('-__v')
        .populate('friends')
        .populate('thoughts')
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'Cannot find user with this ID!' });
            }
            res.json(user);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

// function to create a user
const createUser = (req, res) => {
    let body = req.body;
    User.create(body)
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

// function to update a user
const updateUser = (req, res) => {
    let userID = req.params.userId;
    let body = req.body;
    User.findOneAndUpdate(
        { _id: userID },
        { $set: body },
        { runValidators: true, new: true }
    )
    .then((user) => {
        if (!user) {
                res.status(404).json({ message: 'Cannot find user with this ID!' });
            }
            res.json(user);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

const deleteUser = (req, res) => {
    let userID = req.params.userId;
    User.findOneAndDelete({ _id: userID })
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'Cannot find user with this ID!' });
            }

            Thought.deleteMany({ _id: { $in: user.thoughts }});
        })
        .then(() => {
            res.json({ message: 'User and thoughts deleted!' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

const addFriend = (req, res) => {
    let userID = req.params.userId;
    let friendID = req.params.friendId;
    User.findOneAndUpdate({ _id: userID }, { $addToSet: { friends: friendID }}, { new: true })
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'Cannot find User with this ID!' });
            }

            res.json(user);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
};

const removeFriend = (req, res) => {
    let userID = req.params.userId;
    let friendID = req.params.friendId;
    User.findOneAndUpdate({ _id: userID }, { $pull: { friends: friendID }}, { new: true })
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'Cannot find User with this ID!' });
            }

            res.json(user);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
}

module.exports = {
    getUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend
}