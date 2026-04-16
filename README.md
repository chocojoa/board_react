# Board React

Spring Boot 백엔드와 연동하는 역할 기반 접근 제어(RBAC) 게시판 관리 애플리케이션입니다.  
사용자 관리, 메뉴/역할 관리, 게시판, 대시보드를 포함한 풀스택 Admin 시스템입니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 19, React Router 7 |
| 상태 관리 | Zustand 5 (persist 미들웨어) |
| 폼 처리 | React Hook Form + Zod |
| UI 컴포넌트 | Radix UI, shadcn/ui, Tailwind CSS 4 |
| 데이터 테이블 | TanStack React Table 8 |
| 차트 | Recharts 3 |
| HTTP 클라이언트 | Axios 1 |
| 아이콘 | Lucide React |
| 알림 | Sonner |
| 빌드 도구 | Vite 8 |

## 프로젝트 구조

```
src/
├── auth/                        # URL 허용 목록 (allowUrl.jsx)
├── components/
│   ├── form/                    # 재사용 폼 컴포넌트 (Post, User, Role, Menu 등)
│   ├── formSchema/              # Zod 유효성 검사 스키마
│   ├── layouts/
│   │   ├── Nav.jsx              # 동적 메뉴 네비게이션
│   │   ├── PrivateLayout.jsx    # 인증 필요 레이아웃 (라우트 접근 제어 포함)
│   │   └── PublicLayout.jsx     # 공개 페이지 레이아웃
│   └── ui/                      # shadcn/ui 기반 공통 UI 컴포넌트
├── hooks/
│   ├── useAxios.jsx             # JWT 자동 갱신 Axios 인스턴스
│   ├── usePagination.jsx        # 페이지네이션 상태 관리
│   ├── useSorting.jsx           # 정렬 상태 관리
│   └── useSelection.jsx         # 행 선택 상태 관리
├── pages/
│   ├── auth/                    # 로그인, 회원가입
│   ├── dashboard/               # 통계 대시보드 (Bar, Line, Pie, Radar 차트)
│   ├── user/                    # 사용자 프로필
│   ├── post/                    # 게시판 (목록, 작성, 상세, 수정, 댓글)
│   ├── admin/
│   │   ├── user/                # 사용자 관리 (CRUD)
│   │   ├── role/                # 역할 관리, 메뉴-역할 배정, 사용자-역할 배정
│   │   └── menu/                # 계층형 메뉴 트리 관리
│   └── common/                  # 404 등 공통 페이지
├── routes/
│   └── CommonRouter.jsx         # 라우트 정의 (lazy loading)
└── store/
    ├── useAuthStore.jsx          # 인증 상태 (user, token, isAuthenticated)
    └── useMenuStore.jsx          # 사용자 메뉴 목록 상태
```

## 주요 기능

### 인증 및 권한 관리
- 이메일/비밀번호 로그인, 회원가입
- JWT 액세스 토큰 + 리프레시 토큰 방식
- 토큰 만료 시 자동 갱신 후 원래 요청 재시도 (Axios 인터셉터)
- 로그인 후 사용자별 접근 가능 메뉴 동적 로드
- Zustand persist로 새로고침 후에도 로그인 상태 유지 (localStorage)

### 라우팅 및 레이아웃
- 인증 여부에 따라 Public / Private 레이아웃 자동 전환
- `PrivateLayout`에서 현재 URL이 사용자 메뉴에 포함되는지 검사 (미허용 시 404)
- 모든 페이지 컴포넌트 lazy loading 적용

### 게시판
- 카테고리별 게시글 목록 (검색, 정렬, 페이지네이션)
- 게시글 작성, 수정, 삭제
- 댓글 등록 및 목록 조회

### 관리자 기능
- **사용자 관리**: 사용자 목록 조회, 등록, 상세 보기, 수정
- **역할 관리**: 역할 CRUD, 역할에 메뉴 배정, 역할에 사용자 배정 (셔틀 UI)
- **메뉴 관리**: rc-tree 기반 드래그 앤 드롭 계층형 메뉴 트리 편집

### 대시보드
- Bar Chart, Line Chart, Pie Chart, Radar Chart (Recharts)

## 라우트 목록

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/auth/signIn` | SignIn | 로그인 |
| `/auth/signUp` | SignUp | 회원가입 |
| `/dashboard` | Dashboard | 통계 대시보드 |
| `/user/profile` | Profile | 내 프로필 |
| `/boards/:categoryId/posts` | PostList | 게시글 목록 |
| `/boards/:categoryId/posts/create` | PostCreate | 게시글 작성 |
| `/boards/:categoryId/posts/:postId` | PostDetail | 게시글 상세 + 댓글 |
| `/boards/:categoryId/posts/:postId/edit` | PostEdit | 게시글 수정 |
| `/admin/users` | UserList | 사용자 목록 |
| `/admin/users/create` | UserCreate | 사용자 등록 |
| `/admin/users/:userId` | UserDetail | 사용자 상세 |
| `/admin/users/:userId/edit` | UserEdit | 사용자 수정 |
| `/admin/menus` | MenuList | 메뉴 트리 관리 |
| `/admin/roles` | Role | 역할/메뉴-역할/사용자-역할 관리 |

## 상태 관리

Zustand의 `persist` 미들웨어로 localStorage에 상태를 저장합니다.

```
localStorage
├── auth-storage   ← { isAuthenticated, user, token }
└── menu-storage   ← { menuList }
```

컴포넌트 외부(Axios 인터셉터 등)에서는 `useAuthStore.getState()`로 직접 접근합니다.

## API 통신 패턴

`useAxios()` 훅이 Axios 인스턴스를 생성하고 인터셉터를 설정합니다.

```
요청 인터셉터: Authorization: Bearer {accessToken} 자동 부착
응답 인터셉터: 401 + JWT_TOKEN_IS_EXPIRED → /api/auth/reissue 호출 → 원래 요청 재시도
              그 외 에러 → Sonner toast 알림 출력
```

## 폼 처리 패턴

React Hook Form + Zod를 사용합니다.

1. `src/components/formSchema/` — Zod 스키마 정의
2. `src/components/form/` — 각 폼 필드 컴포넌트
3. 페이지 컴포넌트 — `useForm({ resolver: zodResolver(schema) })` 후 제출 처리

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build
```

백엔드 서버는 `http://localhost:8080`에서 실행되어야 합니다.  
Vite 개발 서버는 `/api` 요청을 백엔드로 프록시합니다.

## 참고 라이브러리

- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [TanStack Table](https://tanstack.com/table/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Recharts](https://recharts.org/)
- [Axios](https://axios-http.com/)
- [Lucide Icons](https://lucide.dev/)
- [rc-tree](https://www.npmjs.com/package/rc-tree)
- [Sonner](https://sonner.emilkowal.ski/)
