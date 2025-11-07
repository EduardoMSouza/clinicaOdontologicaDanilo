package com.consultorio.domain.paciente.erro;

public class PacienteNotFoundException extends RuntimeException {
  public PacienteNotFoundException(String message) {
    super(message);
  }
}
