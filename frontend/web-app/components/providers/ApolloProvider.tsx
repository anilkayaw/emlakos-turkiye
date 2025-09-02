'use client'

import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from '@/lib/graphql'

interface ClientApolloProviderProps {
  children: React.ReactNode
}

export function ClientApolloProvider({ children }: ClientApolloProviderProps) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  )
}
