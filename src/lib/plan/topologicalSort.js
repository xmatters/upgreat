const topologicalSort = list => {
  // map of dependencies
  const D = list.reduce((map, val) => {
    map.set(val.name, val.peers)
    return map
  }, new Map())

  // above map rotated so that it represents a DAG
  const G = [...D.keys()].reduce(
    (p, c) => p.set(c, [...D.keys()].filter(e => D.get(e).includes(c))),
    new Map(),
  )

  // array of leaf nodes
  const Q = [...D.keys()].filter(e => D.get(e).length == 0)
  const S = []
  while (Q.length) {
    const u = Q.shift()
    S.push(u)
    G.get(u).forEach(v => {
      D.set(v, D.get(v).filter(e => e !== u))
      if (D.get(v).length == 0) {
        Q.push(v)
      }
    })
  }

  return S.map(name => list.find(d => d.name === name))
}

module.exports = topologicalSort
