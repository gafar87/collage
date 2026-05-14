export interface LayoutCell {
  id: number
  x: number
  y: number
  width: number
  height: number
}

export interface LayoutConfig {
  id: string
  name: string
  cellCount: number
  cells: LayoutCell[]
}

export const LAYOUTS: LayoutConfig[] = [
  // 1 фото
  {
    id: '1x1',
    name: '1 фото',
    cellCount: 1,
    cells: [{ id: 0, x: 0, y: 0, width: 1, height: 1 }],
  },

  // 2 фото горизонтально (рядом)
  {
    id: '2h',
    name: '2 горизонтально',
    cellCount: 2,
    cells: [
      { id: 0, x: 0,   y: 0, width: 0.5, height: 1 },
      { id: 1, x: 0.5, y: 0, width: 0.5, height: 1 },
    ],
  },

  // 2 фото вертикально (стопкой)
  {
    id: '2v',
    name: '2 вертикально',
    cellCount: 2,
    cells: [
      { id: 0, x: 0, y: 0,   width: 1, height: 0.5 },
      { id: 1, x: 0, y: 0.5, width: 1, height: 0.5 },
    ],
  },

  // 3 фото: 1 большое слева + 2 маленьких справа
  {
    id: '3r',
    name: '1 + 2 справа',
    cellCount: 3,
    cells: [
      { id: 0, x: 0,   y: 0,   width: 0.5,  height: 1 },
      { id: 1, x: 0.5, y: 0,   width: 0.5,  height: 0.5 },
      { id: 2, x: 0.5, y: 0.5, width: 0.5,  height: 0.5 },
    ],
  },

  // 3 фото: 2 маленьких слева + 1 большое справа
  {
    id: '3l',
    name: '2 слева + 1',
    cellCount: 3,
    cells: [
      { id: 0, x: 0,   y: 0,   width: 0.5, height: 0.5 },
      { id: 1, x: 0,   y: 0.5, width: 0.5, height: 0.5 },
      { id: 2, x: 0.5, y: 0,   width: 0.5, height: 1   },
    ],
  },

  // 3 фото: 1 большое сверху + 2 маленьких снизу
  {
    id: '3b',
    name: '1 + 2 снизу',
    cellCount: 3,
    cells: [
      { id: 0, x: 0,   y: 0,   width: 1,   height: 0.5 },
      { id: 1, x: 0,   y: 0.5, width: 0.5, height: 0.5 },
      { id: 2, x: 0.5, y: 0.5, width: 0.5, height: 0.5 },
    ],
  },

  // 3 равных горизонтально (в ряд)
  {
    id: '3h',
    name: '3 в ряд',
    cellCount: 3,
    cells: [
      { id: 0, x: 0,           y: 0, width: 1 / 3, height: 1 },
      { id: 1, x: 1 / 3,       y: 0, width: 1 / 3, height: 1 },
      { id: 2, x: 2 / 3,       y: 0, width: 1 / 3, height: 1 },
    ],
  },

  // 3 равных вертикально (в столбец)
  {
    id: '3v',
    name: '3 в столбец',
    cellCount: 3,
    cells: [
      { id: 0, x: 0, y: 0,       width: 1, height: 1 / 3 },
      { id: 1, x: 0, y: 1 / 3,   width: 1, height: 1 / 3 },
      { id: 2, x: 0, y: 2 / 3,   width: 1, height: 1 / 3 },
    ],
  },

  // 4 фото: сетка 2×2
  {
    id: '4g',
    name: 'Сетка 2×2',
    cellCount: 4,
    cells: [
      { id: 0, x: 0,   y: 0,   width: 0.5, height: 0.5 },
      { id: 1, x: 0.5, y: 0,   width: 0.5, height: 0.5 },
      { id: 2, x: 0,   y: 0.5, width: 0.5, height: 0.5 },
      { id: 3, x: 0.5, y: 0.5, width: 0.5, height: 0.5 },
    ],
  },

  // 4 фото: 1 большое слева + 3 маленьких справа
  {
    id: '4l',
    name: '1 + 3 справа',
    cellCount: 4,
    cells: [
      { id: 0, x: 0,   y: 0,           width: 0.5, height: 1 },
      { id: 1, x: 0.5, y: 0,           width: 0.5, height: 1 / 3 },
      { id: 2, x: 0.5, y: 1 / 3,       width: 0.5, height: 1 / 3 },
      { id: 3, x: 0.5, y: 2 / 3,       width: 0.5, height: 1 / 3 },
    ],
  },

  // 4 фото в ряд
  {
    id: '4h',
    name: '4 в ряд',
    cellCount: 4,
    cells: [
      { id: 0, x: 0,     y: 0, width: 0.25, height: 1 },
      { id: 1, x: 0.25,  y: 0, width: 0.25, height: 1 },
      { id: 2, x: 0.5,   y: 0, width: 0.25, height: 1 },
      { id: 3, x: 0.75,  y: 0, width: 0.25, height: 1 },
    ],
  },

  // 4 фото в столбец
  {
    id: '4v',
    name: '4 в столбец',
    cellCount: 4,
    cells: [
      { id: 0, x: 0, y: 0,    width: 1, height: 0.25 },
      { id: 1, x: 0, y: 0.25, width: 1, height: 0.25 },
      { id: 2, x: 0, y: 0.5,  width: 1, height: 0.25 },
      { id: 3, x: 0, y: 0.75, width: 1, height: 0.25 },
    ],
  },

  // 5 фото: 1 большое слева + 4 маленьких (2×2) справа
  {
    id: '5a',
    name: '1 + 4 (2×2)',
    cellCount: 5,
    cells: [
      { id: 0, x: 0,    y: 0,   width: 0.5,  height: 1   },
      { id: 1, x: 0.5,  y: 0,   width: 0.25, height: 0.5 },
      { id: 2, x: 0.75, y: 0,   width: 0.25, height: 0.5 },
      { id: 3, x: 0.5,  y: 0.5, width: 0.25, height: 0.5 },
      { id: 4, x: 0.75, y: 0.5, width: 0.25, height: 0.5 },
    ],
  },

  // 5 фото: 2 сверху + 3 снизу
  {
    id: '5b',
    name: '2 + 3',
    cellCount: 5,
    cells: [
      { id: 0, x: 0,   y: 0,   width: 0.5,       height: 0.5 },
      { id: 1, x: 0.5, y: 0,   width: 0.5,       height: 0.5 },
      { id: 2, x: 0,   y: 0.5, width: 1 / 3,     height: 0.5 },
      { id: 3, x: 1/3, y: 0.5, width: 1 / 3,     height: 0.5 },
      { id: 4, x: 2/3, y: 0.5, width: 1 / 3,     height: 0.5 },
    ],
  },

  // 5 фото: 3 сверху + 2 снизу
  {
    id: '5c',
    name: '3 + 2',
    cellCount: 5,
    cells: [
      { id: 0, x: 0,   y: 0,   width: 1 / 3,  height: 0.5 },
      { id: 1, x: 1/3, y: 0,   width: 1 / 3,  height: 0.5 },
      { id: 2, x: 2/3, y: 0,   width: 1 / 3,  height: 0.5 },
      { id: 3, x: 0,   y: 0.5, width: 0.5,    height: 0.5 },
      { id: 4, x: 0.5, y: 0.5, width: 0.5,    height: 0.5 },
    ],
  },

  // 6 фото: сетка 2×3 (2 столбца, 3 строки)
  {
    id: '6a',
    name: 'Сетка 2×3',
    cellCount: 6,
    cells: [
      { id: 0, x: 0,   y: 0,       width: 0.5, height: 1 / 3 },
      { id: 1, x: 0.5, y: 0,       width: 0.5, height: 1 / 3 },
      { id: 2, x: 0,   y: 1 / 3,   width: 0.5, height: 1 / 3 },
      { id: 3, x: 0.5, y: 1 / 3,   width: 0.5, height: 1 / 3 },
      { id: 4, x: 0,   y: 2 / 3,   width: 0.5, height: 1 / 3 },
      { id: 5, x: 0.5, y: 2 / 3,   width: 0.5, height: 1 / 3 },
    ],
  },

  // 6 фото: сетка 3×2 (3 столбца, 2 строки)
  {
    id: '6b',
    name: 'Сетка 3×2',
    cellCount: 6,
    cells: [
      { id: 0, x: 0,       y: 0,   width: 1 / 3, height: 0.5 },
      { id: 1, x: 1 / 3,   y: 0,   width: 1 / 3, height: 0.5 },
      { id: 2, x: 2 / 3,   y: 0,   width: 1 / 3, height: 0.5 },
      { id: 3, x: 0,       y: 0.5, width: 1 / 3, height: 0.5 },
      { id: 4, x: 1 / 3,   y: 0.5, width: 1 / 3, height: 0.5 },
      { id: 5, x: 2 / 3,   y: 0.5, width: 1 / 3, height: 0.5 },
    ],
  },
]

export function getLayout(id: string): LayoutConfig {
  const layout = LAYOUTS.find((l) => l.id === id)
  if (!layout) throw new Error(`Layout "${id}" not found`)
  return layout
}
