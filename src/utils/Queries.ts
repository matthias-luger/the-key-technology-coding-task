import { gql } from '@apollo/client'

export const LOGIN_MUTATION = gql`
    mutation Mutation($input: LoginJwtInput!) {
        Auth {
            loginJwt(input: $input) {
                jwtTokens {
                    accessToken
                }
            }
        }
    }
`

export const GET_CONTENT_NODES_QUERY = gql`
    query Query($first: Int, $after: String) {
        Admin {
            Tree {
                GetContentNodes(first: $first, after: $after) {
                    edges {
                        node {
                            id
                            structureDefinition {
                                title
                            }
                        }
                        cursor
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        }
    }
`
