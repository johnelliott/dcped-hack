module.exports = function (state, action) {
  if (typeof state === 'undefined') state = {peds: [], count: 0}

  console.log(state)
  console.log(action)

  switch (action.type) {
    case 'INCREMENT':
      return Object.assign(state, {count: state.count + JSON.parse(action.peds).length})
    case 'ADD':
      return Object.assign(state, {peds: state.peds.concat(action.peds) })

    default:
      return state
  }
}
