const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Company {
    companyName: String!
    projectsCount: Int!
    id: ID!
  }

  type Query {
    companyCount: Int!
    allCompanies: [Company!]!
    findCompany(companyName: String!): Company
  }
  # The schema for a mutation
  type Mutation {
    addCompany(companyName: String!, projectsCount: Int!): Company
    editCompany(companyName: String!, projectsCount: Int!): Company
  }

  #to filter the query
  #The type YesNo is GraphQL enum, or an enumerable, with two possible values YES or NO.
  # enum YesNo {
  # YES
  #NO
  #}
`;

let allCompanies = [
  {
    companyName: "SPS",
    projectsCount: 22,
  },
  {
    companyName: "Stockman",
    projectsCount: 25,
  },
  {
    companyName: "WWT",
    projectsCount: 3,
  },
  {
    companyName: "WWT",
    projectsCount: 3,
  },
  {
    companyName: "WWT",
    projectsCount: 3,
  },
  {
    companyName: "WWT",
    projectsCount: 3,
  },
  {
    companyName: "WWT",
    projectsCount: 3,
  },
  {
    companyName: "Pandora",
    projectsCount: 3,
  },
  {
    companyName: "WESTS",
    projectsCount: 16,
  },
  {
    companyName: "Bestseller",
    projectsCount: 10,
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves companys from the "allCompanys" array above.
//parameter root is company object

const { v1: uuid } = require("uuid");
const resolvers = {
  Query: {
    companyCount: () => allCompanies.length,
    allCompanies: () => allCompanies,
    findCompany: (root, args) =>
      allCompanies.find((c) => c.companyName === args.companyName),
  },

  Mutation: {
    addCompany: (root, args) => {
      if (allCompanies.find((c) => c.companyName === args.companyName)) {
        throw new UserInputError("Sorry, Name must be unique", {
          invalidArgs: args.companyName,
        });
      }
      const company = {
        ...args,
        id: uuid(),
      };
      allCompanies = allCompanies.concat(company);
      return company;
    },
    editCompany: (root, args) => {
      const company = allCompanies.find(
        (p) => p.companyName === args.companyName
      );
      if (!company) {
        return null;
      }

      const updatedCompany = { ...company, projectsCount: args.projectsCount };
      allCompanies = allCompanies.map((p) =>
        p.companyName === args.companyName ? updatedCompany : p
      );
      return updatedCompany;
    },
  },
};
//resolver returns the value of the corresponding field of the object
// The ApolloServer constructor requires two parameters: shema
// definition and set of resolvers.

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// The `listen` method launches a web server.s
server.listen().then(({ url }) => {
  console.log(` Server ready at ${url}`);
});
