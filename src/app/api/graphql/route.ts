// app/api/graphql/route.ts
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest, NextResponse } from "next/server";
import { typeDefs } from "@/backend/graphql/schema";
import { resolvers } from "@/backend/graphql/resolvers";
import { createClient } from "@supabase/supabase-js";
import { ENV } from "@/backend/config/env";

// Create a new Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create a Next.js API handler
const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    const token = req.headers.get("authorization")?.split(" ")[1] || "";
    const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

    if (token) {
      const { data, error } = await supabase.auth.getUser(token);
      return { user: error ? null : data.user };
    }

    return { user: null };
  },
});

// ✅ Wrap in Next.js handler functions
export async function GET(req: NextRequest, context: any) {
  return handler(req, context);
}

export async function POST(req: NextRequest, context: any) {
  return handler(req, context);
}
