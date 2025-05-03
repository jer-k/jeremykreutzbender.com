/**
 * @jest-environment node
 */
import { GET } from "@/app/api/about/route";

describe("/api/about", () => {
  it("should return basic personal information", async () => {
    const response = await GET({} as Request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("name", "Jeremy Kreutzbender");
    expect(data).toHaveProperty("email", "jeremykreutzbender@gmail.com");
    expect(data).toHaveProperty("website", "jeremykreutzbender.com");
  });
  
  it("should match expected data structure", async () => {
    const response = await GET({} as Request);
    const data = await response.json();
    
    expect(Object.keys(data)).toHaveLength(3);
    expect(Object.keys(data)).toEqual(expect.arrayContaining([
      "name", "email", "website"
    ]));
  });
});