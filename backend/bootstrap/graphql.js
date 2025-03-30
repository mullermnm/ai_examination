import { graphqlHTTP } from 'express-graphql';
import schema from '../src/graphql/schemas/index.schema';
import resolvers from '../src/graphql/resolvers/index.resolver';

export default (app) => {
    app.use('/graphql', graphqlHTTP({
        schema,
        rootValue: resolvers,
        graphiql: true
    }));
}