const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    async getSingleUser(_, { id, username }, { user }) {
      const foundUser = await User.findOne({
        $or: [{ _id: user ? user._id : id }, { username }],
      });

      if (!foundUser) {
        throw new Error('Cannot find a user with this id!');
      }

      return foundUser;
    },
    async savedBooks(_, __, { user }) {
      if (!user) {
        throw new Error('You need to be logged in!');
      }
      return user.savedBooks;
    },
  },
  Mutation: {
    async createUser(_, { input }) {
      const user = await User.create(input);
      if (!user) {
        throw new Error('Something is wrong!');
      }
      const token = signToken(user);
      return { token, user };
    },
    async login(_, { input }) {
      const user = await User.findOne({
        $or: [{ username: input.username }, { email: input.email }],
      });
      if (!user) {
        throw new Error("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(input.password);

      if (!correctPw) {
        throw new Error('Wrong password!');
      }
      const token = signToken(user);
      return { token, user };
    },
    async saveBook(_, { book }, { user }) {
      if (!user) {
        throw new Error('You need to be logged in!');
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },
    async deleteBook(_, { bookId }, { user }) {
      if (!user) {
        throw new Error('You need to be logged in!');
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error("Couldn't find user with this id!");
      }
      return updatedUser;
    },
  },
};

module.exports = resolvers;
