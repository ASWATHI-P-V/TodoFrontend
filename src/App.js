import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [number, setNumber] = useState("");
  const [patients, setPatients] = useState([]);
  const [editingId, setEditingId] = useState(null); // Tracks which patient is being edited

  // Fetch all patients
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/patients/")
      .then((response) => setPatients(response.data))
      .catch((error) => console.error("Error fetching patients:", error));
  }, []);

  // Add or update patient
  const handleSubmit = () => {
    if (!name || !age || !gender || !number) {
      alert("Please fill all fields!");
      return;
    }

    if (editingId) {
      // Update patient
      axios
        .put(`http://127.0.0.1:8000/api/patients/${editingId}/`, {
          name,
          age,
          gender,
          number,
        })
        .then((response) => {
          setPatients(patients.map((p) => (p.id === editingId ? response.data : p)));
          resetForm();
        })
        .catch((error) => console.error("Update Error:", error));
    } else {
      // Add new patient
      axios
        .post("http://127.0.0.1:8000/api/patients/", { name, age, gender, number })
        .then((response) => {
          setPatients([...patients, response.data]);
          resetForm();
        })
        .catch((error) => console.error("Add Error:", error));
    }
  };

  // Delete patient
  const deletePatient = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/patients/${id}/`)
      .then(() => setPatients(patients.filter((p) => p.id !== id)))
      .catch((error) => console.error("Delete Error:", error));
  };

  // Set fields for editing
  const editPatient = (patient) => {
    setEditingId(patient.id);
    setName(patient.name);
    setAge(patient.age);
    setGender(patient.gender);
    setNumber(patient.number);
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setAge("");
    setGender("");
    setNumber("");
    setEditingId(null);
  };

  return (
    <div className="App">
      <h1>Hospital Management</h1>
      <div className="form">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
        <input type="text" placeholder="Gender" value={gender} onChange={(e) => setGender(e.target.value)} />
        <input type="text" placeholder="Number" value={number} onChange={(e) => setNumber(e.target.value)} />
        <button onClick={handleSubmit}>{editingId ? "Update Patient" : "Add Patient"}</button>
        {editingId && <button onClick={resetForm}>Cancel</button>}
      </div>

      <ul className="patients">
        {patients.map((patient) => (
          <li key={patient.id}>
            <span>{patient.name}</span>
            <span>{patient.age}</span>
            <span>{patient.gender}</span>
            <span>{patient.number}</span>
            <button onClick={() => editPatient(patient)}>Edit</button>
            <button onClick={() => deletePatient(patient.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
