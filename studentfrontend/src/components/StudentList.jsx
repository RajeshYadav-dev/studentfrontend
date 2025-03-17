import React, { useEffect, useState } from "react";
import { getAllStudents, deleteStudent } from "../services/StudentServices";
import { useNavigate } from "react-router-dom";
import { onlyDate } from "../utilities/DateUtils";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [search, students]);

  const fetchStudents = () => {
    getAllStudents()
      .then((response) => {
        setStudents(response.data);
        setFilteredStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setLoading(true);
      });
  };

  const handleSearch = () => {
    const filtered = students.filter((student) =>
      `${student.first_name} ${student.last_name} ${student.email} ${student.city}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleAddStudent = () => navigate("/add-student");
  const handleEditStudent = (id) => navigate(`/edit-student/${id}`);

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        setStudents(students.filter((student) => student.std_id !== id));
        showNotification("Student deleted successfully!", "success");
      } catch (error) {
        showNotification("Failed to delete student.", "error");
        console.error("Error deleting student:", error);
      }
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Pagination Logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  if (loading) return <h1 className="text-center text-primary">Loading...</h1>;

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow-lg p-4">
        <h1 className="text-center my-4 text-primary">
          🎓 Student Management System
        </h1>

        {notification && (
          <div
            className={`alert ${
              notification.type === "success" ? "alert-success" : "alert-danger"
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder="🔍 Search by name, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn btn-success fw-bold"
            onClick={handleAddStudent}
          >
            ➕ Add Student
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-bordered text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Class</th>
                <th>Enrollment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => (
                <tr key={student.std_id}>
                  <td className="fw-bold">{indexOfFirstStudent + index + 1}</td>
                  <td>
                    <img
                      src={
                        student.profile_pic_url
                          ? `http://localhost:8000${student.profile_pic_url}`
                          : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt="Profile"
                      className="rounded-circle shadow"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />
                  </td>
                  <td className="fw-bold">
                    {student.first_name} {student.last_name}
                  </td>
                  <td>{student.email}</td>
                  <td>{student.phone_number}</td>
                  <td>{student.city}</td>
                  <td className="fw-bold text-success">
                    {student.standard} - {student.section}
                  </td>
                  <td>{onlyDate(student.enrollment_date)}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-primary btn-sm"
                        title="Edit Student"
                        onClick={() => handleEditStudent(student.std_id)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        title="Delete Student"
                        onClick={() => handleDeleteStudent(student.std_id)}
                      >
                        🗑️ Delete
                      </button>
                      <button
                        className="btn btn-info btn-sm"
                        title="View Profile"
                        onClick={() => navigate(`/profile/${student.std_id}`)}
                      >
                        👤 Profile
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-outline-primary mx-1"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ⬅️ Prev
          </button>
          <span className="mx-2 fw-bold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline-primary mx-1"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next ➡️
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentList;

