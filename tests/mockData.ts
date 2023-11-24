import { ContentNodeQueryResult } from '../src/components/NodeList'

export function getNodesMockData(from: number, to: number, hasNextPage: boolean): { data: ContentNodeQueryResult } {
    const mockResponse: ContentNodeQueryResult = {
        Admin: {
            Tree: {
                GetContentNodes: {
                    edges: [],
                    pageInfo: {
                        hasNextPage: hasNextPage,
                        endCursor: ''
                    }
                }
            }
        }
    }

    for (let i = from; i <= to; i++) {
        mockResponse.Admin.Tree.GetContentNodes.edges.push({
            node: {
                id: `id-${i}`,
                structureDefinition: {
                    title: `Title ${i}`
                }
            },
            cursor: `cursor-${i}`
        })
    }
    return { data: mockResponse }
}
