// app/api/graphql/route.ts
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { typeDefs } from '@/backend/graphql/schema';
import { resolvers } from '@/backend/graphql/resolvers';
import { createClient } from '@supabase/supabase-js';
import { ENV } from '@/backend/config/env';

// Create a new Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create a handler function that integrates with Next.js
const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    // Get the user token from the headers
    const token = req.headers.get('authorization')?.split(' ')[1] || '';
    
    // Try to retrieve a user with the token
    const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
    
    if (token) {
      const { data, error } = await supabase.auth.getUser(token);
      
      // Add the user to the context
      return { user: error ? null : data.user };
    }
    
    return { user: null };
  },
});

// Export the handler functions for GET and POST requests
export { handler as GET, handler as POST };