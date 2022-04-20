

const ft2m = (ft) => {return ft*0.3048}
const m2ft = (m) => {return m/0.3048}

const psi2bar = (psi) => {return psi*0.06894757}
const bar2psi = (bar) => {return bar/0.06894757}

const lbs2kg = (lbs) => {return lbs*0.4535924}
const kg2lbs = (kg) => {return kg/0.4535924}

const cuft2L = (cuft) => {return cuft*28.31685}
const L2cuft = (L) => {return L/28.31685}

export {ft2m, m2ft, psi2bar, bar2psi, lbs2kg, kg2lbs, cuft2L, L2cuft};