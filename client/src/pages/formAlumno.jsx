import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import FormAlumno from "../components/formAlumno";

export default function FormAlumnoPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <>
      <Header />
      <FormAlumno onSuccess={handleSuccess} />
      <Footer />
    </>
  );
}
