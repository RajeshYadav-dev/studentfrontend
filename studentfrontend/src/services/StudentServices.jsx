import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/v1/students";
const apiClient = axios.create({ baseURL: BASE_URL });

// 🔹 Attach the access token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Refresh token if access token expires
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Access token expired. Attempting refresh...");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        console.error("No refresh token found. Logging out.");
        logoutStudent();
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await apiClient.get("/refresh_token");

        // Store new access token
        localStorage.setItem(
          "access_token",
          refreshResponse.data.new_access_token
        );

        // Retry the failed request with the new token
        error.config.headers.Authorization = `Bearer ${refreshResponse.data.new_access_token}`;
        return apiClient(error.config);
      } catch (refreshError) {
        console.error("Token refresh failed. Logging out.");
        logoutStudent();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// ✅ API Functions
export const getAllStudents = () => apiClient.get("/");
export const addStudent = (student) => apiClient.post("/", student);
export const getAStudent = (std_id) => apiClient.get(`/${std_id}/`);
export const updateStudent = (std_id, student) =>
  apiClient.put(`/${std_id}/`, student);
export const deleteStudent = (std_id) => apiClient.delete(`/${std_id}/`);

export const uploadStudentPicture = (std_id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post(`/${std_id}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ✅ Login Function
export const loginStudent = async (loginDetail) => {
  try {
    const response = await apiClient.post("/login", loginDetail);

    console.log("API Response:", response.data); // Debugging

    // Store tokens
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
    localStorage.setItem("student", JSON.stringify(response.data.student));

    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Logout Function
export const logoutStudent = async () => {
  try {
    await apiClient.post("/logout"); // Call logout API
  } catch (error) {
    console.warn("Logout API call failed, clearing tokens anyway.");
  }

  // Clear tokens
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("student");
  window.location.href = "/"; // Redirect to login page
};
