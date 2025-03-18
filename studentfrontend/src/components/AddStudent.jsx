import React, { useState } from "react";
import { addStudent } from "../services/StudentServices";
import { useNavigate } from "react-router-dom";

const AddStudent = () => {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    dob: "",
    gender: "Male",
    address: "",
    standard: "",
    profile_pic_url: "string",
    is_active: false,
  });

  const navigator = useNavigate();

  const handleOnChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudent({
      ...student,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveStudent = (event) => {
    event.preventDefault();
    addStudent(student)
      .then(() => {
        setStudent({
          name: "",
          email: "",
          password: "",
          phone_number: "",
          dob: "",
          gender: "Male",
          address: "",
          standard: "",
          profile_pic_url: "string",
          is_active: false,
        });
        navigator("/");
      })
      .catch((error) => console.error("Error adding student:", error));
  };

  console.log(student);

  return (
    <div className="container">
      <div className="row">
        <div className="card col-md-8 offset-md-2 my-5">
          <h2 className="text-center">Add Student</h2>
          <div className="card-body">
            <form onSubmit={saveStudent}>
              <div className="row">
                {[
                  { label: "Full Name", name: "name", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Password", name: "password", type: "password" },
                  { label: "Phone Number", name: "phone_number", type: "text" },
                  { label: "Date of Birth", name: "dob", type: "date" },
                  { label: "Address", name: "address", type: "text" },
                  { label: "Class", name: "standard", type: "text" },
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
                  <label className="form-label me-2">Agree to Terms</label>
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
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
