package consultorio.domain.exception;

public class DentistaNotFoundException extends RuntimeException {
  public DentistaNotFoundException(String message) {
    super(message);
  }
}
