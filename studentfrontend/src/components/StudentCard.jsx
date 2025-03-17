import React, { useState, useEffect } from "react";
import { getAStudent, uploadStudentPicture } from "../services/StudentServices";
import { useParams, useNavigate } from "react-router-dom";
import { onlyDate } from "../utilities/DateUtils";

const StudentCard = () => {
  const [student, setStudent] = useState(null);
  const { std_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getAStudent(std_id)
      .then((response) => setStudent(response.data))
      .catch((error) => console.error("Error fetching student:", error));
  }, [std_id]);

  if (!student) {
    return <h2 className="text-center mt-5">Loading Student Data...</h2>;
  }

  const profilePicUrl = student.profile_pic_url
    ? `http://localhost:8000${
        student.profile_pic_url.startsWith("/") ? "" : "/"
      }${student.profile_pic_url}`
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const response = await uploadStudentPicture(std_id, file);
      setStudent((prev) => ({
        ...prev,
        profile_pic_url: response.data.profile_pic_url,
      }));
      console.log("Image uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageClick = () => {
    document.getElementById("file-input").click();
  };

  const handleEdit = () => {
    navigate(`/edit-student/${std_id}`);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div
        className="card shadow-lg p-4 rounded w-100 text-center overflow-hidden"
        style={{ maxWidth: "600px" }}
      >
        {/* Centered Profile Picture */}
        <div className="d-flex flex-column align-items-center mb-3">
          <div className="d-flex justify-content-center mt-5">
            <img
              className="rounded-circle border border-3 border-primary shadow-sm"
              src={profilePicUrl}
              alt="Profile"
              width={150}
              height={150}
              style={{
                cursor: "pointer",
                transition: "transform 0.3s",
                display: "block",
              }}
              onClick={handleImageClick}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            />
          </div>
          <input
            type="file"
            id="file-input"
            onChange={handleImageChange}
            style={{ display: "none" }}
            accept="image/*"
          />
        </div>

        {/* Student Name */}
        <h2 className="fw-bold text-primary">
          {student.first_name} {student.last_name}
        </h2>

        <div className="d-flex justify-content-center align-items-center gap-3">
          <span
            className={`badge ${
              student.is_active ? "bg-success" : "bg-danger"
            } fs-6 px-3 py-2`}
          >
            {student.is_active ? "Active" : "Inactive"}
          </span>
          <button className="btn btn-warning btn-sm" onClick={handleEdit}>
            ✏️ Edit Details
          </button>
        </div>

        {/* Student Details Box */}
        <div className="p-4 bg-light border rounded mt-4">
          <div className="row text-center">
            <div className="col-md-6">
              <p>
                <strong>📞 Phone:</strong> {student.phone_number}
              </p>
              <p>
                <strong>✉️ Email:</strong> {student.email}
              </p>
              <p>
                <strong>🧑‍🎓 Gender:</strong> {student.gender}
              </p>
              <p>
                <strong>🎂 DOB:</strong> {onlyDate(student.date_of_birth)}
              </p>
              <p>
                <strong>📊 GPA:</strong> {student.gpa}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>📌 Class:</strong> {student.standard} -{" "}
                {student.section}
              </p>
              <p>
                <strong>🔢 Roll No:</strong> {student.roll_number}
              </p>
              <p>
                <strong>📅 Enrollment:</strong>{" "}
                {onlyDate(student.enrollment_date)}
              </p>
              <p>
                <strong>🌆 City:</strong> {student.city}
              </p>
              <p>
                <strong>🏛️ State:</strong> {student.state}
              </p>
            </div>
          </div>
        </div>

        {/* Created & Updated Info */}
        <div className="text-center mt-4">
          <small className="text-muted">
            🕒 Created: {onlyDate(student.created_at)}
          </small>{" "}
          |
          <small className="text-muted">
            {" "}
            Updated: {onlyDate(student.updated_at)}
          </small>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
