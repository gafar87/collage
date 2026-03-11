Структура проекта
src/
├── components/
│   ├── Canvas/
│   │   ├── CollageCanvas.tsx      # основной Canvas-компонент
│   │   ├── useCanvasRenderer.ts   # хук рендера
│   │   └── CellOverlay.tsx        # интерактивный оверлей поверх Canvas
│   ├── Sidebar/
│   │   ├── LayoutPicker.tsx
│   │   ├── BackgroundSettings.tsx
│   │   ├── BorderSettings.tsx
│   │   ├── RadiusSettings.tsx
│   │   └── SizeSettings.tsx
│   ├── Dropzone/
│   │   ├── PhotoDropzone.tsx
│   │   └── PhotoThumbnail.tsx
│   └── Header/
│       ├── Header.tsx
│       └── ExportModal.tsx
├── layouts/
│   └── layouts.ts                 # конфигурация всех макетов
├── store/
│   └── useCollageStore.ts         # Zustand store
├── utils/
│   ├── canvasRenderer.ts          # логика рендера Canvas
│   ├── imageCrop.ts               # object-fit cover вычисления
│   └── export.ts                  # экспорт PNG/JPG
└── App.tsx