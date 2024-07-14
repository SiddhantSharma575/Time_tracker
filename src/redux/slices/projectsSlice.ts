import { ProjectInterface } from "@/src/types/project-interface";
import { createSlice } from "@reduxjs/toolkit";

interface ProjectState {
  projects: ProjectInterface[];
}

const initialState: ProjectState = {
  projects: [
    {
      id: 0,
      title: "Web Design",
      isActive: false,
      startTime: "00:00:00",
      trackedTime: 0,
    },
    {
      id: 1,
      title: "R & D",
      isActive: false,
      startTime: "00:00:00",
      trackedTime: 0,
    },
    {
      id: 2,
      title: "Web Development",
      isActive: false,
      startTime: "00:00:00",
      trackedTime: 0,
    },
  ],
};

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setCourseProjects: (state, action) => {
      return { ...state, projects: action.payload };
    },
  },
});

export const { setCourseProjects } = projectsSlice.actions;

export default projectsSlice.reducer;
