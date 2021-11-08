import _ from 'lodash'
import { read, write, getWeight } from './utils'
import dijkstra from 'graphology-shortest-path/dijkstra'
import csv from 'csvtojson'
import Graph from 'graphology'
import betweennessCentrality from 'graphology-metrics/centrality/betweenness'

export async function mockReputation() {
  const init = true
  const SeedReputation = 1000
  const MinTrust = 5

  console.log('init...')

  const nodes = init ? await csv().fromFile(`./src/testing-utils/data/nodes.csv`) : read('nodes')
  const edges = await csv().fromFile(`./src/testing-utils/data/edges.csv`)

  write('edges', edges)
  console.log(`Success: write edges.json`)

  const edgesSet = edges.reduce((p, c) => {
    if (p[c.source]) {
      p[c.source].push(c.target)
    } else {
      p[c.source] = [c.target]
    }
    return p
  }, {})

  write('edges_set', edgesSet)
  console.log(`Success: write edges_set.json`)

  const graph = new Graph()

  nodes.forEach(node => {
    graph.addNode(node.id)
  })

  console.log(`Success: addNodes - ${nodes.length}`)

  edges.forEach(edge => {
    // Trust
    graph.addEdge(edge.source, edge.target)
  })

  console.log(`Success: addEdges - ${edges.length}`)

  // graph.forEachNode(node => {
  //   graph.forEachNeighbor(node, neighbor => console.log(node, neighbor));
  // });

  const centrality = betweennessCentrality(graph, {
    weighted: true,
    attributes: { weight: 'weight' },
    normalized: false
  })

  const betweenness = _.orderBy(
    Object.keys(centrality).map(function(i) {
      return {
        id: i,
        value: centrality[i]
      }
    }),
    'value',
    'desc'
  )
  write('betweenness', betweenness)
  console.log(`Success: write betweenness`)

  const seeds = betweenness.slice(0, 10)
  write('seeds', seeds)
  console.log(`Success: write seeds`)

  const shortestPaths = []
  seeds.forEach(seed => {
    const paths = dijkstra.singleSource(graph, seed.id, 'weight')
    write(`paths/${seed.id}`, paths)
    shortestPaths.push({
      seed: seed,
      paths: paths
    })
  })

  console.log(`Success: write seeds paths`)

  let reputations = []
  nodes.forEach(node => {
    let reputation = 0
    shortestPaths.forEach(seedPaths => {
      const path = seedPaths.paths[node.id]
      if (!!path && path.length > 1 && path.length < 6) {
        let score = SeedReputation
        path.forEach(function(n, index) {
          if (index + 1 == path.length) {
            reputation += score
            return
          }
          const trustCount = graph.outDegree(n)
          const sourceReputation = graph.getNodeAttribute(n, 'reputation') || 0
          const targetReputation = graph.getNodeAttribute(path[index + 1], 'reputation') || 0
          const relCount = MinTrust > trustCount ? MinTrust : trustCount
          score = score / relCount / getWeight(sourceReputation, targetReputation)
        })
      }
    })
    reputations.push({
      id: node.id,
      label: node.label,
      reputation: reputation
    })
  })

  reputations = _.orderBy(reputations, 'reputation', 'desc')

  write('nodes', reputations)
  console.log(`Success: write reputations to nodes`)
}
