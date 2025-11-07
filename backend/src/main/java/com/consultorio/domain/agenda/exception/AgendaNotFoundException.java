package com.consultorio.domain.agenda.exception;

public class AgendaNotFoundException extends RuntimeException {
  public AgendaNotFoundException(String message) {
    super(message);
  }
}
