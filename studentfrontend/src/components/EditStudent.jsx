import React, { useState, useEffect } from "react";
import { updateStudent, getAStudent } from "../services/StudentServices";
import { useParams, useNavigate } from "react-router-dom";

const EditStudent = () => {
  const navigator = useNavigate();
  const { std_id } = useParams();
  const [student, setStudent] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    gender: "Male",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    standard: "",
    section: "",
    roll_number: "",
    enrollment_date: "",
    gpa: 0,
    profile_pic_url: "string",
    is_active: false,
    guardian_name: "",
    guardian_contact: "",
    relationship: "",
  });

  useEffect(() => {
    getAStudent(std_id)
      .then((response) => {
        setStudent(response.data);
      })
      .catch((error) => {
        console.error("Error fetching student:", error);
      });
  }, [std_id]);

  const handleOnChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudent({
      ...student,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const editStudent = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(std_id, student);
      navigator("/");
      alert("Student updated successfully!");
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  useEffect(() => {
    getAStudent(std_id)
      .then((response) => {
        const studentData = response.data;

        // Format date fields to YYYY-MM-DD for proper display in input type="date"
        studentData.date_of_birth = studentData.date_of_birth
          ? studentData.date_of_birth.split("T")[0] // Extract YYYY-MM-DD
          : "";

        studentData.enrollment_date = studentData.enrollment_date
          ? studentData.enrollment_date.split("T")[0]
          : "";

        setStudent(studentData);
      })
      .catch((error) => {
        console.error("Error fetching student:", error);
      });
  }, [std_id]);

  return (
    <div className="container">
      <div className="row">
        <div className="card col-md-8 offset-md-2 my-5">
          <h2 className="text-center">Edit Student</h2>
          <div className="card-body">
            <form onSubmit={editStudent}>
              <div className="row">
                {[
                  { label: "First Name", name: "first_name", type: "text" },
                  { label: "Last Name", name: "last_name", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Phone Number", name: "phone_number", type: "text" },
                  {
                    label: "Date of Birth",
                    name: "date_of_birth",
                    type: "date",
                  },
                  { label: "Address", name: "address", type: "text" },
                  { label: "City", name: "city", type: "text" },
                  { label: "State", name: "state", type: "text" },
                  { label: "Postal Code", name: "postal_code", type: "text" },
                  { label: "Class", name: "standard", type: "text" },
                  { label: "Section", name: "section", type: "text" },
                  { label: "Roll Number", name: "roll_number", type: "text" },
                  {
                    label: "Enrollment Date",
                    name: "enrollment_date",
                    type: "date",
                  },
                  { label: "GPA", name: "gpa", type: "number" },
                  {
                    label: "Guardian Name",
                    name: "guardian_name",
                    type: "text",
                  },
                  {
                    label: "Guardian Contact",
                    name: "guardian_contact",
                    type: "text",
                  },
                  {
                    label: "Relation with Guardian",
                    name: "relationship",
                    type: "text",
                  },
                ].map(({ label, name, type }) => (
                  <div className="col-md-6 mb-3" key={name}>
                    <label className="form-label">{label}</label>
                    <input
                      type={type}
                      placeholder={`Enter ${label}`}
                      name={name}
                      value={student[name]}
                      className="form-control"
                      required
                      onChange={handleOnChange}
                    />
                  </div>
                ))}
              </div>

              {/* Gender Selection */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Gender</label>
                  <div>
                    <label className="me-3">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={student.gender === "Male"}
                        onChange={handleOnChange}
                      />{" "}
                      Male
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={student.gender === "Female"}
                        onChange={handleOnChange}
                      />{" "}
                      Female
                    </label>
                  </div>
                </div>

                {/* Active Checkbox */}
                <div className="col-md-6 mb-3">
                  <label className="form-label me-2">Active</label>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={student.is_active}
                    onChange={handleOnChange}
                  />
                </div>
              </div>

              <div className="text-center">
                <button className="btn btn-success" type="submit">
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
