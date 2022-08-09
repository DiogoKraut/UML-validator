import java.io.*;  

public class GST {
    private String gstId;
    private String name;
    private String email;

    public void enrollGrower(){

    }
}

public class Grower {
    private String growerId;
    private String growerName;
    private String email;
    private GST agronomist;
    private String stage;

    public void operation0(){

    }

}

public class Farm {
   private String farmId;
   private String farmName;
   private String growerId;
   
}

public class Field {
   private String fieldId;
   private String fieldName;
   private String farmId;
   private int area;
}

public class RowCrop {
   private String crop;
   private Practice[] cropPractices;
}


public class PastureLand {
   private Animal[] animals;
   private Practice[] pasturePractices;
}


public class Animal {
   private String animalId;
   private String name;
}


public class Practice {
    private String practiceName;
    private Date startDate;
    private Date endDate;
}
