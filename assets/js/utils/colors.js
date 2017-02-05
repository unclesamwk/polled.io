export const colors = [
  '#4BA4F5',
  '#5A9BEC',
  '#6892E3',
  '#7789DA',
  '#8680D1',
  '#9477C8',
  '#A36EBE',
  '#C05CAC',
  '#DD4A9A',
  '#EC4191',
]

/**
  * Dynamically creates an array of colours depending
  * on the number of choices passed in. For example:
  * 2 choices will return: [colors[0], colors[9]], to give
  * the largest contrast. 3 choices will return:
  * [colors[0], colors[4], colors[9]] and so on.
  */
export function calculateColors (colors, choices) {
  const colorsLength = colors.length - 1
  const choicesLength = choices.length - 1

  const increment = Math.ceil(colorsLength / choicesLength)

  return choices.reduce((a, v, i) => {
    if (a.length === 0) {
      a.push(0)
      return a
    }

    const calculatedIndex = parseInt(a[i - 1] + increment)

    a.push((calculatedIndex >= (colorsLength)) ?  (colorsLength) : calculatedIndex)

    return a
  }, [])
}
