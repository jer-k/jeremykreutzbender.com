/**
 * @jest-environment node
 */
import { GET } from "@/app/api/cv/jobs/route";

// Mock the cvData
jest.mock("@/lib/constants/cv-data", () => ({
  cvData: {
    personalInfo: {
      name: "Jeremy Kreutzbender",
    },
    jobs: [
      {
        companyName: "Company A",
        companyUrl: "https://companya.com",
        workType: "Remote",
        duration: "2023 - Present",
        title: "Software Engineer",
        descriptionMarkdown: "Job description A",
      },
      {
        companyName: "Company B",
        workType: "On-Site",
        duration: "2020 - 2023",
        title: "Developer",
        descriptionMarkdown: "Job description B",
      },
    ]
  }
}));

describe("/api/cv/jobs", () => {
  it("should return only the jobs array from CV data", async () => {
    const response = await GET({} as Request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
    expect(data).not.toHaveProperty("personalInfo");
  });
  
  it("should match expected job data structure", async () => {
    const response = await GET({} as Request);
    const jobs = await response.json();
    
    // Check first job
    expect(jobs[0]).toHaveProperty("companyName", "Company A");
    expect(jobs[0]).toHaveProperty("companyUrl", "https://companya.com");
    expect(jobs[0]).toHaveProperty("workType", "Remote");
    expect(jobs[0]).toHaveProperty("duration");
    expect(jobs[0]).toHaveProperty("title");
    expect(jobs[0]).toHaveProperty("descriptionMarkdown");
    
    // Check second job
    expect(jobs[1]).toHaveProperty("companyName", "Company B");
    expect(jobs[1]).toHaveProperty("workType", "On-Site");
  });
  
  it("should handle error gracefully", async () => {
    // Mock console.error to avoid cluttering test output
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Mock the cvData to throw an error
    jest.resetModules();
    jest.mock("@/lib/constants/cv-data", () => {
      throw new Error("Test error");
    });
    
    try {
      // Need to re-import the handler after changing the mock
      const { GET: ErrorGET } = require("@/app/api/cv/jobs/route");
      const response = await ErrorGET({} as Request);
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Internal Server Error fetching jobs data");
    } finally {
      // Restore console.error
      console.error = originalConsoleError;
      
      // Reset the mock
      jest.resetModules();
    }
  });
});