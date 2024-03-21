package com.inn.cafe.wrapper;

import lombok.Data;

@Data
public class ProductWrapper {
    Integer id;
    String name;
    String description;
    Integer price;
    String status;
    Integer categoryId;
    String categoryName;
    private String imageName;
    private String imageType;
    private byte[] imageBytes;


    public ProductWrapper(){}
    public ProductWrapper(Integer id, String name){
        this.id = id;
        this.name = name;
    }
    public ProductWrapper(Integer id, String name, String description, Integer price, String status,
                          Integer categoryId, String categoryName, String imageName, String imageType,
                          byte[] imageBytes) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.status = status;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.imageName = imageName;
        this.imageType = imageType;
        this.imageBytes = imageBytes;
    }

    public ProductWrapper(Integer id, String name, String description, Integer price) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
    }
}
