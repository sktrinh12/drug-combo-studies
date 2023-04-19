const transpose = (arr) => {
  return Array.from({ length: arr[0].length }, (_, i) => {
    return Array.from({ length: arr.length }, (_, j) => arr[j][i])
  })
}

export { transpose }
