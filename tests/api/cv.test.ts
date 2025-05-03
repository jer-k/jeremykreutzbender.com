/**
 * @jest-environment node
 */
import { GET } from "@/app/api/cv/route";

// Mock the cvData
jest.mock("@/lib/constants/cv-data", () => ({
  cvData: {
    personalInfo: {
      name: "Jeremy Kreutzbender",
      location: "Portland, Oregon, United States",
      locationUrl: "https://www.google.com/maps/place/Portland,+OR",
      avatarUrl: "https://github.com/jer-k.png",
      avatarFallback: "JK",
    },
    about: {
      summary: "Test summary",
    },
    jobs: [
      {
        companyName: "Test Company",
        workType: "Remote",
        duration: "Jan 2023 - Present",
        title: "Software Engineer",
        descriptionMarkdown: "Test description",
      },
    ],
    projects: [
      {
        name: "Test Project",
        url: "https://example.com",
        descriptionMarkdown: "Test project description",
      },
    ],
    skills: {
      languages: ["JavaScript", "TypeScript"],
      technologies: ["Next.js", "React"],
    },
    schools: [
      {
        institutionName: "Test University",
        institutionUrl: "https://example.edu",
        location: "Test Location",
        locationUrl: "https://example.com",
        duration: "2010 - 2014",
      },
    ],
  }
}));

describe("/api/cv", () => {
  it("should return complete CV data structure", async () => {
    const response = await GET({} as Request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("personalInfo");
    expect(data).toHaveProperty("about");
    expect(data).toHaveProperty("jobs");
    expect(data).toHaveProperty("projects");
    expect(data).toHaveProperty("skills");
    expect(data).toHaveProperty("schools");
  });
  
  it("should match expected CV data structure", async () => {
    const response = await GET({} as Request);
    const data = await response.json();
    
    expect(data.personalInfo).toHaveProperty("name");
    expect(data.personalInfo).toHaveProperty("location");
    expect(data.personalInfo).toHaveProperty("avatarUrl");
    
    expect(data.about).toHaveProperty("summary");
    
    expect(data.jobs[0]).toHaveProperty("companyName");
    expect(data.jobs[0]).toHaveProperty("workType");
    expect(data.jobs[0]).toHaveProperty("duration");
    expect(data.jobs[0]).toHaveProperty("title");
    
    expect(data.skills).toHaveProperty("languages");
    expect(data.skills).toHaveProperty("technologies");
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
      const { GET: ErrorGET } = require("@/app/api/cv/route");
      const response = await ErrorGET({} as Request);
      const data = await response.json();
      
      expect(response.status).toBe(500);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Internal Server Error fetching CV data");
    } finally {
      // Restore console.error
      console.error = originalConsoleError;
      
      // Reset the mock
      jest.resetModules();
      jest.mock("@/lib/constants/cv-data", () => ({
        cvData: { /* same as above */ }
      }));
    }
  });
});