public class GST {
  private String gstId;
  private String name;
  private String email;
  private Grower[] growers;

  public void enrollGrower(name: String, email: String) {
    this.name = name;
    this.email = email;
  }
}