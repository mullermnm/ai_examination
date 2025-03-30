import { buildSchema } from 'graphql';
import { org_schema, org_queries } from './organization.schema';
export default buildSchema(`
    ${org_schema}
    type Query {
        ${org_queries}
    }
`)