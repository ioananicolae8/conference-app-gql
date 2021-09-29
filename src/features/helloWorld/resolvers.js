const helloWorldResolvers = {

    Query: {
        myFirstEndpoint: async (_parent, _arguments, _context, _info) => {
            return "Hello World!✨ This is coming from GraphQL"
        }
      }
      
}

module.exports = helloWorldResolvers;