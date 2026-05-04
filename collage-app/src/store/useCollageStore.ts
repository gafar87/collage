import { create } from 'zustand'

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

export interface CellState {
  imageId: string | null
  offsetX: number
  offsetY: number
  scale: number
}

export interface ImageData {
  src: string
  width: number
  height: number
}

export interface AppState {
  canvasWidth: number
  canvasHeight: number
  selectedLayoutId: string
  cells: Record<number, CellState>
  images: Record<string, ImageData>
  borderWidth: number
  borderColor: string
  backgroundColor: string
  transparentBackground: boolean
  borderRadius: number
  selectedCellId: number | null
  exportModalOpen: boolean

  // Actions
  setCanvasSize: (width: number, height: number) => void
  setLayout: (layoutId: string, cellCount: number) => void
  setCellImage: (cellId: number, imageId: string | null) => void
  updateCellTransform: (cellId: number, offsetX: number, offsetY: number, scale: number) => void
  addImage: (id: string, data: ImageData) => void
  removeImage: (id: string) => void
  setBorderWidth: (value: number) => void
  setBorderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  setTransparentBackground: (value: boolean) => void
  setBorderRadius: (value: number) => void
  clearCell: (cellId: number) => void
  swapCells: (fromId: number, toId: number) => void
  setSelectedCell: (cellId: number | null) => void
  setExportModalOpen: (open: boolean) => void
}

function createDefaultCells(count: number): Record<number, CellState> {
  const cells: Record<number, CellState> = {}
  for (let i = 0; i < count; i++) {
    cells[i] = { imageId: null, offsetX: 0, offsetY: 0, scale: 1 }
  }
  return cells
}

export const useCollageStore = create<AppState>((set) => ({
  canvasWidth: 1200,
  canvasHeight: 1200,
  selectedLayoutId: '1x1',
  cells: createDefaultCells(1),
  images: {},
  borderWidth: 0,
  borderColor: '#ffffff',
  backgroundColor: '#ffffff',
  transparentBackground: false,
  borderRadius: 0,
  selectedCellId: null,
  exportModalOpen: false,

  setCanvasSize: (width, height) => set({ canvasWidth: width, canvasHeight: height }),

  setLayout: (layoutId, cellCount) =>
    set((state) => {
      const newCells = createDefaultCells(cellCount)
      // Сохраняем фото из старых ячеек по индексу
      Object.entries(state.cells).forEach(([id, cell]) => {
        const numId = Number(id)
        if (numId < cellCount && cell.imageId) {
          newCells[numId] = { ...cell }
        }
      })
      return { selectedLayoutId: layoutId, cells: newCells }
    }),

  setCellImage: (cellId, imageId) =>
    set((state) => ({
      cells: {
        ...state.cells,
        [cellId]: { ...state.cells[cellId], imageId, offsetX: 0, offsetY: 0, scale: 1 },
      },
    })),

  updateCellTransform: (cellId, offsetX, offsetY, scale) =>
    set((state) => ({
      cells: {
        ...state.cells,
        [cellId]: { ...state.cells[cellId], offsetX, offsetY, scale },
      },
    })),

  addImage: (id, data) =>
    set((state) => ({ images: { ...state.images, [id]: data } })),

  removeImage: (id) =>
    set((state) => {
      const images = { ...state.images }
      delete images[id]
      // Убрать это фото из всех ячеек
      const cells = { ...state.cells }
      Object.keys(cells).forEach((cellId) => {
        if (cells[Number(cellId)].imageId === id) {
          cells[Number(cellId)] = { ...cells[Number(cellId)], imageId: null }
        }
      })
      return { images, cells }
    }),

  setBorderWidth: (value) => set({ borderWidth: value }),
  setBorderColor: (color) => set({ borderColor: color }),
  setBackgroundColor: (color) =>
    set((state) => ({
      backgroundColor: color,
      // auto-sync borderColor when they were previously equal ("use background color" mode)
      borderColor: state.borderColor === state.backgroundColor ? color : state.borderColor,
    })),
  setTransparentBackground: (value) => set({ transparentBackground: value }),
  setBorderRadius: (value) => set({ borderRadius: value }),

  clearCell: (cellId) =>
    set((state) => ({
      cells: {
        ...state.cells,
        [cellId]: { imageId: null, offsetX: 0, offsetY: 0, scale: 1 },
      },
    })),

  swapCells: (fromId, toId) =>
    set((state) => {
      const cells = { ...state.cells }
      const temp = cells[fromId]
      cells[fromId] = cells[toId]
      cells[toId] = temp
      return { cells }
    }),

  setSelectedCell: (cellId) => set({ selectedCellId: cellId }),
  setExportModalOpen: (open) => set({ exportModalOpen: open }),
}))
