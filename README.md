# board_react

React + shadcn/ui 기반 게시판 프론트엔드 프로젝트입니다.  
`board_spring-boot` (Spring Boot + JWT + RBAC) 백엔드와 연동합니다.

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | React 19 |
| 빌드 도구 | Vite 8 |
| UI 컴포넌트 | shadcn/ui (Radix UI 기반) |
| CSS | Tailwind CSS v4 + tw-animate-css |
| 상태 관리 | Zustand 5 (persist 미들웨어) |
| 라우터 | React Router DOM 7 |
| HTTP 클라이언트 | Axios |
| 폼 검증 | React Hook Form + @hookform/resolvers + Zod |
| 테이블 | @tanstack/react-table |
| 차트 | Recharts |
| 알림 | Sonner |
| 아이콘 | lucide-react |
| 유틸리티 | date-fns, vaul, cmdk |

---

## 사전 요구사항

- Node.js 18 이상
- `board_spring-boot` 서버 실행 중 (`http://localhost:8080`)
- Redis 실행 중 (토큰 갱신용)

---

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```

---

## 프로젝트 구조

```
src/
├── App.jsx                      # 루트 컴포넌트 (Toaster 포함)
├── main.jsx                     # 앱 초기화 (Router, CSS)
│
├── auth/
│   └── allowUrl.jsx             # 메뉴 권한 없이 접근 가능한 URL 목록
│
├── components/
│   ├── DataTable.jsx            # @tanstack/react-table 기반 범용 테이블
│   ├── BasicDataTable.jsx       # 단순 테이블 (페이징/정렬 없음)
│   ├── PageHeader.jsx           # 브레드크럼 + 페이지 제목
│   ├── Pagination.jsx           # 페이지네이션 UI
│   ├── LucideIcon.jsx           # 아이콘 이름으로 동적 렌더링
│   ├── DataPickerWithRange.jsx  # 날짜 범위 선택기
│   ├── form/                    # 재사용 폼 컴포넌트
│   │   ├── PostForm.jsx
│   │   ├── UserForm.jsx
│   │   ├── CommentForm.jsx
│   │   ├── MenuForm.jsx
│   │   ├── RoleForm.jsx
│   │   └── SignInForm.jsx
│   ├── formSchema/              # Zod 유효성 검사 스키마
│   │   ├── PostFormSchema.js
│   │   ├── UserFormSchema.js
│   │   ├── CommentFormSchema.js
│   │   ├── MenuFormSchema.js
│   │   ├── RoleFormSchema.js
│   │   └── SignInFormSchema.js
│   ├── layouts/
│   │   ├── Nav.jsx              # 상단 네비게이션 (동적 메뉴 + 프로필)
│   │   ├── PrivateLayout.jsx    # 인증 필요 레이아웃 (메뉴 접근 권한 검증)
│   │   └── PublicLayout.jsx     # 비인증 레이아웃 (로그인/회원가입)
│   └── ui/                      # shadcn/ui 컴포넌트 (자동 생성)
│
├── hooks/
│   ├── useAxios.jsx             # Axios 인스턴스 + 토큰 갱신 인터셉터
│   ├── usePagination.jsx        # 페이지/사이즈 상태 관리
│   ├── useSorting.jsx           # 정렬 컬럼/방향 상태 관리
│   └── useSelection.jsx         # 행 선택 상태 관리
│
├── pages/
│   ├── auth/
│   │   ├── SignIn.jsx           # 로그인
│   │   ├── SignUp.jsx           # 회원가입
│   │   └── ForgotPassword.jsx   # 비밀번호 찾기
│   ├── dashboard/
│   │   └── Dashboard.jsx        # 대시보드 (Bar, Line, Pie, Radar 차트)
│   ├── post/
│   │   ├── PostList.jsx         # 게시글 목록 (검색, 페이징, 정렬)
│   │   ├── PostCreate.jsx       # 게시글 작성
│   │   ├── PostDetail.jsx       # 게시글 상세 + 댓글
│   │   ├── PostEdit.jsx         # 게시글 수정
│   │   ├── CommentCreate.jsx    # 댓글/대댓글 작성
│   │   ├── CommentList.jsx      # 댓글 목록
│   │   └── CommentItem.jsx      # 댓글 항목 (대댓글 포함)
│   ├── admin/
│   │   ├── user/
│   │   │   ├── UserList.jsx     # 사용자 목록 + 검색
│   │   │   ├── UserCreate.jsx   # 사용자 생성
│   │   │   ├── UserDetail.jsx   # 사용자 상세
│   │   │   └── UserEdit.jsx     # 사용자 수정
│   │   ├── menu/
│   │   │   ├── MenuList.jsx     # 메뉴 트리 CRUD
│   │   │   └── MenuTreeNode.jsx # 재귀 트리 노드 컴포넌트
│   │   └── role/
│   │       ├── Role.jsx         # 권한관리 탭 (목록/메뉴/사용자)
│   │       ├── RoleList.jsx     # 권한 목록
│   │       ├── RoleModal.jsx    # 권한 등록/수정 모달
│   │       ├── MenuRole.jsx     # 권한별 메뉴 설정 (체크박스 트리)
│   │       ├── MenuCheckTree.jsx # 재귀 체크박스 트리 (indeterminate 지원)
│   │       └── UserRole.jsx     # 권한별 사용자 설정 (좌우 이동)
│   ├── user/
│   │   └── Profile.jsx          # 프로필 수정
│   └── common/
│       └── NotFound.jsx         # 404 페이지
│
├── routes/
│   └── CommonRouter.jsx         # 라우트 정의 (lazy loading)
│
├── store/
│   ├── useAuthStore.jsx         # 인증 상태 (user, isAuthenticated) + persist
│   └── useMenuStore.jsx         # 메뉴 목록 상태 + persist
│
└── lib/
    └── utils.js                 # cn() 유틸리티 (clsx + tailwind-merge)
```

---

## 주요 기능

### 인증
- HttpOnly 쿠키 기반 JWT 인증 (Bearer Token 없음)
- Access Token 만료 시 자동 갱신 (`/api/auth/reissue`) 후 원래 요청 재시도
- 갱신 실패 시 자동 로그아웃 + 로그인 페이지 이동
- Zustand `persist`로 새로고침 후에도 로그인 상태 유지 (localStorage)

### 메뉴 (RBAC)
- 로그인 후 사용자 권한에 맞는 메뉴 목록 서버에서 조회
- 상단 Nav에 동적으로 렌더링 (부모 메뉴 hover 시 자식 메뉴 드롭다운)
- `PrivateLayout`에서 현재 경로가 허용된 메뉴 URL인지 검증

### 게시판
- 카테고리(categoryId) 기반 다중 게시판
- 제목 / 작성자 검색, 컬럼 정렬, 서버 사이드 페이징
- 댓글 및 대댓글 작성/삭제

### 관리자
- **사용자 관리**: 목록 조회/생성/수정/상세
- **메뉴 관리**: 트리 구조 메뉴 CRUD (클릭 선택)
- **권한 관리**:
  - 권한별 메뉴 설정: 재귀 체크박스 트리 (부모 클릭 시 자식 일괄 선택, indeterminate 상태 지원)
  - 권한별 사용자 설정: 좌(전체) ↔ 우(권한 보유) 이동, 클라이언트 측 `roleUserIds` Set으로 동기화

### 대시보드
- Bar Chart, Line Chart, Pie Chart, Radar Chart (Recharts)

---

## 환경 설정

### Vite 프록시 (`vite.config.js`)

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

`/api/*` 요청을 Spring Boot 서버로 전달합니다. `/api` 경로를 그대로 유지합니다.

### 경로 별칭

`@/` → `src/` 로 매핑됩니다 (`vite.config.js`).

### 상태 저장 (localStorage)

```
localStorage
├── auth-storage   ← { isAuthenticated, user }
└── menu-storage   ← { menuList }
```

컴포넌트 외부(Axios 인터셉터 등)에서는 `useAuthStore.getState()`로 직접 접근합니다.

---

## 백엔드 연동 API

| 분류 | 메서드 | 경로 |
|---|---|---|
| 인증 | POST | `/api/auth/signIn` |
| 인증 | POST | `/api/auth/signUp` |
| 인증 | POST | `/api/auth/signOut` |
| 인증 | POST | `/api/auth/reissue` |
| 공통 | GET | `/api/common/menus/{userId}` |
| 게시글 | GET / POST | `/api/boards/{categoryId}/posts` |
| 게시글 | GET / PUT / DELETE | `/api/boards/{categoryId}/posts/{postId}` |
| 댓글 | GET / POST | `/api/boards/{categoryId}/posts/{postId}/comments` |
| 사용자 관리 | GET / POST / PUT | `/api/admin/users` |
| 메뉴 관리 | GET / POST / PUT / DELETE | `/api/admin/menus` |
| 권한 관리 | GET / POST / PUT / DELETE | `/api/admin/roles` |
| 권한-메뉴 | GET / POST | `/api/admin/menuRole/{roleId}` |
| 권한-사용자 | GET / POST | `/api/admin/userRole/{roleId}` |

---

## 라우트 구조

```
/                             → /dashboard (리다이렉트)
/dashboard                    대시보드
/user/profile                 프로필

/boards/:categoryId/posts                   게시글 목록
/boards/:categoryId/posts/create            게시글 작성
/boards/:categoryId/posts/:postId           게시글 상세
/boards/:categoryId/posts/:postId/edit      게시글 수정

/admin/users                  사용자 목록
/admin/users/create           사용자 생성
/admin/users/:userId          사용자 상세
/admin/users/:userId/edit     사용자 수정
/admin/menus                  메뉴 관리
/admin/roles                  권한 관리

/auth/signIn                  로그인
/auth/signUp                  회원가입
/auth/forgotPassword          비밀번호 찾기
```

모든 페이지 컴포넌트는 `React.lazy`로 lazy loading 처리됩니다.
