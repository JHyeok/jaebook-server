import request from "supertest";
import app from "../utils/testApp";

/*
beforeAll(async () => {
});

afterAll(() => {
});
*/

const setHeader = (): { Accept: string } => ({
    Accept: "application/json",
});

// Example
describe("GET /api/users", () => {
    it("404: 유저 정보를 요청하고 데이터가 반환된다", async () => {
        const response = await request(app)
            .get("/api/users")
            .set(setHeader());

        expect(response.status).toBe(404);
    });
});
