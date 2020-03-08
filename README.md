## ❯ JaeBook Server

TypeScript와 Express를 사용해서 만든 서버

### TechStack

- **Express**
- **TypeScript**
- **Structure** 컨트롤러, 서비스, 리포지토리, 모델, 미들웨어의 계층 구조
- **TypeORM** Hibernate, Doctrine 및 Entity Framework의 영향을 많이 받은 ORM
- **TypeDI** JavaScript 및 TypeScript를 위한 의존성 주입
- **Routing-Controllers** 구조적이고 선언적이며 아름답게 구성된 클래스 기반 컨트롤러
- **JWT** AccessToken, RefreshToken을 이용
- **ESLint, Prettier** 코드 스타일 일관성 유지
- **Jest** 단위 테스트
- **SuperTest** E2E 테스트

### Environment Variable Management

`jaebook-server/config/`에서 `.sample`확장자 지우고 사용

```env
PORT=3000
API_PREFIX=api
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USERNAME=development
DATABASE_PASSWORD=development
DATABASE_NAME=development
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=true
JWT_SECRET_ACCESS_KEY=test!@#$
JWT_SECRET_REFRESH_KEY=retest!@#$
```

### Build Setup

Steps to run this project:

1. Run `yarn install` command
2. Run `docker-compose up` command
3. Run `yarn start` command

### Tests

```sh
# e2e, unit tests
$ yarn test
```