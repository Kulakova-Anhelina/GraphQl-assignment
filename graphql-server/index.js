const { ApolloServer, gql } = require("apollo-server");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against your data.
const typeDefs = gql`
  type Company {
    companyName: String!
    projectsCount: Int!
    
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "companies" query returns an array of zero or more companies (defined above).
  type Query {
    companyCount: Int!
    allCompanies: [Company!]!
    findCompany(companyName: String!): Company
  }
  # The schema for a mutation for adding a new company
  type Mutation {
    addCompany(companyName:String!, projectsCount: Int!): Company
    editCompany(companyName: String!, projectsCount: Int! ): Company
  },
  

#to filter the query 
#The type YesNo is GraphQL enum, or an enumerable, with two possible values YES or NO.
  enum YesNo {
    YES
    NO
  }
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

  //The mutation adds the object given to it as a parameter args to the array persons,
  // and returns the object it added to the array
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
