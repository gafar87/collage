# PLAN.md — Пошаговый план разработки коллаж-сервиса

## Правила выполнения
- Каждый шаг — отдельный коммит
- После каждого шага приложение должно запускаться без ошибок
- Не переходить к следующему шагу, пока текущий не проверен в браузере

---

## ШАГ 1 — Инициализация проекта ✅ ВЫПОЛНЕН

```bash
npm create vite@latest collage-app -- --template react-ts
cd collage-app
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install zustand react-dropzone
```

Настроить `tailwind.config.js`, подключить директивы в `index.css`.  
Создать структуру папок согласно ТЗ (раздел 9).  
Убедиться что `npm run dev` работает и открывается пустая страница.

---

## ШАГ 2 — Базовый layout интерфейса ✅ ВЫПОЛНЕН

Создать статичную HTML-разметку без логики:

- `App.tsx` — flex-контейнер: Header + (Sidebar | Canvas) + Dropzone
- `Header.tsx` — логотип слева, кнопка «Скачать» справа (неактивная)
- `Sidebar.tsx` — левая панель 280px, заглушки секций
- `CanvasArea.tsx` — серый прямоугольник-заглушка по центру
- `Dropzone.tsx` — полоса снизу высотой 140px с текстом-заглушкой

Все компоненты стилизовать через Tailwind. Цветовая схема: тёмный сайдбар (#1e1e2e), светло-серый фон рабочей области (#f0f0f5), белый Header.  
Проверить что layout корректно отображается на 1280px и 1920px.

---

## ШАГ 3 — Zustand store ✅ ВЫПОЛНЕН

Создать `src/store/useCollageStore.ts` с полным стейтом из ТЗ (раздел 7):

```typescript
interface AppState {
  canvasWidth: number        // default: 1200
  canvasHeight: number       // default: 1200
  selectedLayoutId: string
  cells: Record<number, CellState>
  images: Record<string, ImageData>
  borderWidth: number        // default: 3
  borderColor: string        // default: '#ffffff'
  backgroundColor: string    // default: '#ffffff'
  transparentBackground: boolean  // default: false
  borderRadius: number       // default: 20
}
```

Добавить все actions: `setLayout`, `setCellImage`, `addImage`, `removeImage`, `setBorderWidth`, `setBorderColor`, `setBackgroundColor`, `setTransparentBackground`, `setBorderRadius`, `setCanvasSize`, `clearCell`, `swapCells`.

Убедиться что стейт инициализируется без ошибок (добавить `console.log` и проверить в DevTools).

---

## ШАГ 4 — Конфигурация макетов ✅ ВЫПОЛНЕН

Создать `src/layouts/layouts.ts`.

Каждый макет:
```typescript
interface LayoutConfig {
  id: string
  name: string
  icon: string          // SVG-строка или название иконки
  cellCount: number
  cells: LayoutCell[]   // координаты в единицах 0..1
}

interface LayoutCell {
  id: number
  x: number
  y: number
  width: number
  height: number
}
```

Реализовать 16 макетов (координаты в долях от 0 до 1, без учёта gap — gap добавляется при рендере):

| ID | Описание |
|----|----------|
| `1x1` | 1 ячейка на весь холст |
| `2h` | 2 ячейки горизонтально |
| `2v` | 2 ячейки вертикально |
| `3r` | 1 большая слева + 2 маленьких справа |
| `3b` | 1 большая сверху + 2 маленьких снизу |
| `3h` | 3 равных горизонтально |
| `3v` | 3 равных вертикально |
| `4g` | сетка 2×2 |
| `4l` | 1 большая + 3 маленьких справа |
| `4h` | 4 в ряд |
| `4v` | 4 в столбец |
| `5a` | 1 большая + 4 маленьких (2×2) |
| `5b` | 2 сверху + 3 снизу |
| `5c` | 3 сверху + 2 снизу |
| `6a` | сетка 2×3 |
| `6b` | сетка 3×2 |

Экспортировать `LAYOUTS: LayoutConfig[]` и `getLayout(id: string): LayoutConfig`.

---

## ШАГ 5 — Canvas рендер (базовый)

Создать `src/utils/canvasRenderer.ts` с функцией:

```typescript
function renderCollage(canvas: HTMLCanvasElement, state: AppState): void
```

Алгоритм:
1. `ctx.clearRect(0, 0, w, h)`
2. Если `!transparentBackground` → залить фон `backgroundColor`
3. Для каждой ячейки макета:
   a. Вычислить абсолютные координаты: `px = cell.x * (w - 2*pad - gap*(cols-1)) + pad + col*gap`
   b. `ctx.save()` → `ctx.beginPath()` → `ctx.roundRect(x, y, cw, ch, radius)` → `ctx.clip()`
   c. Если есть фото → нарисовать с object-fit cover (см. ШАГ 6)
   d. Если нет фото → серый прямоугольник + иконка «+»
   e. `ctx.restore()`

Создать `src/components/Canvas/CollageCanvas.tsx`:
- `useRef<HTMLCanvasElement>`
- `useEffect` → вызов `renderCollage` при изменении стейта
- Canvas отображается с CSS масштабированием под размер контейнера

Проверить: на экране должен появиться коллаж с серыми ячейками по выбранному макету.

---

## ШАГ 6 — Object-fit cover для фото

Создать `src/utils/imageCrop.ts`:

```typescript
function getCoverParams(
  imgW: number, imgH: number,
  cellW: number, cellH: number,
  offsetX: number, offsetY: number,
  scale: number
): { sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number }
```

Алгоритм cover:
```
ratio = max(cellW/imgW, cellH/imgH)
drawW = imgW * ratio * scale
drawH = imgH * ratio * scale
dx = cell.x + (cellW - drawW) / 2 + offsetX
dy = cell.y + (cellH - drawH) / 2 + offsetY
```

Интегрировать в `renderCollage` — вызывать `ctx.drawImage` с вычисленными параметрами внутри clip-зоны.

Проверить: загруженное фото заполняет ячейку без искажений.

---

## ШАГ 7 — Dropzone и загрузка фото

Создать `src/components/Dropzone/PhotoDropzone.tsx` с `react-dropzone`:

- Принимает JPG, PNG, WEBP
- При drop/выборе файлов → `FileReader.readAsDataURL` → добавить в store через `addImage`
- Показывать горизонтальный скролл с миниатюрами загруженных фото
- На каждой миниатюре кнопка «×» → `removeImage`

Создать `src/components/Dropzone/PhotoThumbnail.tsx`:
- 64×64px, `object-fit: cover`, скруглённые углы
- `draggable={true}` + `onDragStart` → сохранять `imageId` в `dataTransfer`

Проверить: фото загружаются, отображаются миниатюры.

---

## ШАГ 8 — Drag & Drop фото в ячейки ✅ ВЫПОЛНЕН

В `CollageCanvas.tsx` добавить интерактивный оверлей поверх Canvas (`src/components/Canvas/CellOverlay.tsx`):
- `position: absolute` поверх `<canvas>`, `pointer-events: none` для canvas, `all` для оверлея
- Для каждой ячейки рендерить прозрачный `<div>` с точными координатами (CSS, вычисленными как в ШАГ 5)
- `onDragOver={e => e.preventDefault()}` + `onDrop` → взять `imageId` из `dataTransfer` → `setCellImage(cellId, imageId)`

При `drop` вызвать `renderCollage` → Canvas обновится с новым фото.

Проверить: перетаскивание миниатюры в ячейку помещает фото на коллаж.

---

## ШАГ 9 — Перемещение фото внутри ячейки ✅ ВЫПОЛНЕН

В `CellOverlay.tsx` для занятых ячеек добавить:
- `onMouseDown` → начало drag внутри ячейки (запомнить начальные `offsetX, offsetY`)
- `onMouseMove` (на window) → обновлять `offsetX, offsetY` в store
- `onMouseUp` → завершить drag
- `onWheel` → изменять `scale` ячейки (min 0.5, max 5)

Каждое обновление → `renderCollage`.

Проверить: фото можно двигать и масштабировать колёсиком внутри ячейки.

---

## ШАГ 10 — Перестановка фото между ячейками

Расширить drag & drop оверлея:
- Ячейка с фото тоже `draggable`
- `onDragStart` от ячейки → `dataTransfer.setData('cellId', id)`
- `onDrop` на другую ячейку → если источник ячейка → вызвать `swapCells(fromId, toId)`

Проверить: фото в ячейках меняются местами при перетаскивании.

---

## ШАГ 11 — Панель настроек: рамка и скругление

Создать `src/components/Sidebar/BorderSettings.tsx`:
- Слайдер ширины рамки (0–50) + числовое поле → `setBorderWidth`
- Color picker цвета рамки → `setBorderColor`
- Чекбокс «Использовать цвет фона» → если включён, `borderColor = backgroundColor`

Создать `src/components/Sidebar/RadiusSettings.tsx`:
- Слайдер радиуса (0–100) + числовое поле → `setBorderRadius`

Все изменения → реактивный ре-рендер Canvas через `useEffect`.

Проверить: слайдеры обновляют коллаж в реальном времени без задержек.

---

## ШАГ 12 — Панель настроек: фон и размер холста

Создать `src/components/Sidebar/BackgroundSettings.tsx`:
- Color picker + HEX-поле → `setBackgroundColor`
- Чекбокс «Прозрачный фон» → `setTransparentBackground`
- Если прозрачность включена — показывать шахматный паттерн на Canvas (нарисовать через pattern в `renderCollage` до clip)

Создать `src/components/Sidebar/SizeSettings.tsx`:
- Поля Ширина × Высота
- Кнопки пресетов: 1:1, 4:3, 9:16, 16:9
- Чекбокс «Сохранять пропорции»
- `setCanvasSize(w, h)` → Canvas перерисовывается

Проверить: смена фона и размера холста работает корректно.

---

## ШАГ 13 — Выбор макета (LayoutPicker)

Создать `src/components/Sidebar/LayoutPicker.tsx`:
- Горизонтальный скролл с SVG-иконками всех 16 макетов
- Активный макет подсвечен акцентным цветом
- Клик → `setLayout(id)` → ячейки пересчитываются
- При смене макета фото в ячейках сохраняются (по индексу ячейки)

Создать SVG-иконки для каждого макета программно (простые прямоугольники в миниатюре 40×40px).

Проверить: все 16 макетов переключаются, фото остаются в ячейках.

---

## ШАГ 14 — Экспорт

Создать `src/utils/export.ts`:

```typescript
async function exportCollage(canvas: HTMLCanvasElement, format: 'png' | 'jpg', quality: number, scale: number): Promise<void>
```

- Если `scale > 1` → создать offscreen canvas нужного размера, отрендерить в него, затем скачать
- PNG: `canvas.toBlob('image/png')` → `URL.createObjectURL` → клик по `<a download>`
- JPG: `canvas.toBlob('image/jpeg', quality)` → аналогично
- Имя файла: `collage_YYYYMMDD_HHmmss.png`

Создать `src/components/Header/ExportModal.tsx`:
- Модальное окно при клике «Скачать»
- Выбор формата: PNG / JPG
- Для JPG: слайдер качества (60–100%)
- Выбор множителя: ×1 / ×2 / ×3
- Кнопка «Скачать» → вызов `exportCollage`

Проверить: PNG скачивается с прозрачным фоном (если включено), JPG — с фоном.

---



## ШАГ 15 — Финальная полировка ✅ ВЫПОЛНЕН

- Добавить loading-спиннер при загрузке файлов > 5MB
- Обработка ошибок: неподдерживаемый формат файла → toast-уведомление
- Горячие клавиши: `Delete` → очистить активную ячейку, `Ctrl+S` → открыть экспорт
- Адаптивность: Canvas масштабируется через `transform: scale()` под ширину контейнера
- Пустые ячейки: текст «Перетащите фото» + иконка «+» нарисованные на Canvas
- Клик по пустой ячейке → открывать `<input type="file">` для быстрой загрузки
- Проверить производительность: слайдеры должны работать без видимых лагов (debounce не нужен — Canvas быстрый)

---

## Порядок проверки перед сдачей

1. Загрузить 6 фото через drag & drop
2. Выбрать макет 6b (3×2)
3. Перетащить фото по одному в каждую ячейку
4. Установить: рамка 5px белая, скругление 20px, фон белый
5. Скачать PNG — убедиться что фото не обрезаны, скругления есть
6. Включить прозрачный фон → скачать PNG → открыть в браузере → должна быть прозрачность
7. Нажать Ctrl+Z несколько раз → убедиться что состояние откатывается
8. Поменять макет на 2h → убедиться что фото остаются

---

## Итого шагов: 16
## Примерное время: 3–5 дней для одного разработчика