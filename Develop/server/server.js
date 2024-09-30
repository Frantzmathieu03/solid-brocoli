const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const context = require('./graphql/context');
const authMiddleware = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.PORT || 4000;


app.use(express.json());
app.use(authMiddleware);

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

// Apply middleware to the Apollo Server
server.applyMiddleware({ app });


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your_db_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}).catch(err => {
  console.error(err);
});
