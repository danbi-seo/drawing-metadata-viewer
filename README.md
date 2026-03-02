# 도면 메타데이터 뷰어 (Drawing Metadata Viewer)

> 건설 프로젝트의 도면 데이터를 계층적으로 탐색하고, 공종별 리비전 이력을 시각적으로 관리하는 웹 기반 뷰어입니다.

---

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

> 기본 포트 : `http://localhost:5173`

---

## 구현된 기능

### 1. 도면 계층 탐색 (Site → Building → Discipline → Revision)

- **전체 배치도(Site Overview)** : 프로젝트 전체 배치도를 기본 화면으로 표시하며, 각 건물 위치에 클릭 가능한 폴리곤 영역이 오버레이됩니다.
- **건물 진입** : 폴리곤 클릭 또는 사이드바 건물 목록에서 해당 건물로 진입합니다. 뷰(줌/패닝)는 진입 시 자동 리셋됩니다.
- **공종(Discipline) 선택** : 건물 진입 후 사이드바에서 건축·구조·공조설비 등 공종을 선택할 수 있습니다.
- **리비전(Revision) 선택** : 공종 선택 후 리비전 타임라인에서 특정 이력으로 이동합니다.

### 2. 도면 이미지 렌더링 및 인터랙션

| 동작 | 방법 |
|------|------|
| 줌 인/아웃 | 마우스 휠 스크롤 |
| 이동(Pan) | 클릭 후 드래그 |
| 줌 리셋 | 우측 하단 배율 버튼 클릭 |

- CSS transform(`translate` + `scale`)을 활용한 네이티브 렌더링으로 빠른 반응 속도를 제공합니다.
- `crisp-edges` 렌더링 옵션으로 도면 선명도를 유지합니다.

### 3. 폴리곤 오버레이

- **전체 배치도** : 각 건물의 위치 영역을 폴리곤으로 표시 → 클릭 시 해당 건물로 이동
- **건물 뷰** : 공종별 영역을 공종 고유 색상으로 구분하여 표시
- **공종 선택 후** : 리전(A/B 구역) 또는 리비전 폴리곤을 표시
- 툴바의 **영역 표시 버튼**으로 폴리곤 ON/OFF 토글 가능
- 폴리곤 호버 시 레이블 툴팁 표시

### 4. 다중 공종 겹쳐보기 (Overlay)

- 현재 선택된 공종 외에 다른 공종을 반투명하게 겹쳐서 비교 가능
- 사이드바 공종 항목의 **레이어 아이콘** 클릭으로 추가/해제
- 하단 **OverlayPanel**에서 활성 오버레이 목록 확인 및 투명도(0~100%) 실시간 조절
- 전체 해제 버튼으로 모든 오버레이 한번에 제거

### 5. 리비전 비교 모드

- 리비전 이력에서 **비교 버튼** 활성화 시 현재 도면 위에 다른 리비전이 오버레이됩니다.
- 선택된 비교 대상은 노란색 테두리와 `비교: REV_X` 배지로 시각적으로 구분됩니다.
- 툴바의 **비교 모드** 배지 또는 **종료** 버튼으로 비교 상태를 해제합니다.

### 6. 브레드크럼 내비게이션

- 헤더 상단에 `전체 배치도 > 건물명 > 공종 > 리비전` 형태의 경로가 표시됩니다.
- 각 단계 클릭 시 해당 계층으로 이동 가능하며, 현재 위치는 보라색으로 강조됩니다.
- 선택된 리비전이 최신본인 경우 헤더 우측에 **LATEST** 배지와 날짜가 표시됩니다.

### 7. 사이드바 토글

- 좌측 사이드바는 접기/펼치기 토글 버튼으로 제어됩니다.
- 사이드바 닫힘 상태에서도 내부 컨텐츠 너비를 고정(`264px`)하여 컨텐츠 찌그러짐을 방지합니다.

---

## 프로젝트 구조

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # 브레드크럼 + 리비전 상태 표시
│   │   ├── Sidebar.tsx         # 사이드바 컨테이너 + 토글 버튼
│   │   └── Viewer.tsx          # 툴바 + 캔버스 영역
│   ├── navigation/
│   │   ├── BuildingList.tsx    # 건물 목록 (공종 요약 포함)
│   │   ├── DisciplineTab.tsx   # 공종 선택 탭
│   │   ├── RevisionCard.tsx    # 리비전 카드 (타임라인 노드)
│   │   ├── RevisionList.tsx    # 리비전 타임라인 컨테이너
│   │   └── SidebarOverviewButton.tsx
│   ├── ui/
│   │   ├── ToolbarButton.tsx   # 공통 툴바 버튼
│   │   └── Tooltip.tsx         # 호버 툴팁
│   └── viewer/
│       ├── CanvasEmptyState.tsx
│       ├── DrawingCanvas.tsx   # 메인 캔버스 (Pan/Zoom/Overlay)
│       ├── DrawingInfo.tsx     # 좌측 하단 도면 정보 배지
│       ├── OverlayPanel.tsx    # 겹쳐보기 제어 패널
│       ├── PolygonOverlay.tsx  # SVG 폴리곤 레이어
│       └── ZoomControls.tsx    # 줌 컨트롤바
├── data/
│   ├── metadata.json           # 도면 원본 데이터
│   ├── parser.ts               # 데이터 정규화 (markLatest 등)
│   └── selectors.ts            # 데이터 조회 함수 (캐싱 포함)
├── hooks/
│   ├── useDrawingNavigation.ts # 탐색 통합 인터페이스
│   └── usePolygonLayers.ts     # 폴리곤 레이어 계산 훅
├── store/
│   ├── drawingStore.ts         # 도면 선택 상태 (Zustand)
│   └── viewStore.ts            # 뷰 상태 (줌/패닝/UI 토글)
└── types/
    ├── drawing.ts              # 도면 도메인 타입 정의
    └── metadata.ts             # 메타데이터 타입 정의
```

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 19 + TypeScript |
| 빌드 도구 | Vite |
| 상태 관리 | Zustand |
| 스타일링 | Tailwind CSS + Inline Styles |
| 도면 렌더링 | HTML `<img>` + SVG Overlay |

---

## 데이터 구조 요약

```
metadata.json
└── drawings
    ├── "00" (전체 배치도)
    │   └── position.vertices (건물 폴리곤 좌표)
    └── "01", "02", ... (각 건물)
        └── disciplines
            └── "건축", "구조", ...
                ├── polygon (공종 영역)
                ├── revisions[] (리비전 이력)
                └── regions (A/B 구역, 선택적)
                    └── revisions[]
```

---

## 미완성 된 기능

**리비전 순차 이동 버튼 UI 누락:** 
- `useDrawingNavigation` 훅에 `navigateToPrevRevision`, `navigateToNextRevision`, `canGoPrev`, `canGoNext`가 모두 구현되어 있으나, 이를 호출하는 UI 컴포넌트가 없습니다.

**imageTransform 미적용:**
- `DrawingCanvas.tsx`에서 이미지를 단순 `<img>` 태그로 렌더링하며, `imageTransform` 값을 CSS transform으로 변환하는 코드가 없습니다.