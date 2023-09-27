package com.inn.cafe.serviceImpl;

import com.inn.cafe.JWT.JwtFilter;
import com.inn.cafe.POJO.Category;
import com.inn.cafe.POJO.Product;
import com.inn.cafe.constants.CafeConstant;
import com.inn.cafe.dao.ProductDao;
import com.inn.cafe.service.ProductService;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.wrapper.ProductWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    ProductDao productDao;
    @Autowired
    JwtFilter jwtFilter;
    @Override
    public ResponseEntity<String> addNewProduct(Map<String, String> requestMap) {
        try {
            if(jwtFilter.isAdmin()){
                if (validateProductMap(requestMap,false)){
                    productDao.save(getProductFromMap(requestMap,false));
                    return CafeUtils.getResponseEntity("Product Added Successfully.", HttpStatus.OK);
                }else {
                    return CafeUtils.getResponseEntity(CafeConstant.INVALID_DATA,HttpStatus.BAD_REQUEST);
                }
            }else {
                return CafeUtils.getResponseEntity(CafeConstant.UNAUTHORIZED_ACCESS,HttpStatus.UNAUTHORIZED);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstant.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private Product getProductFromMap(Map<String, String> requestMap, boolean isAdd) {
        Category category = new Category();
        category.setId(Integer.valueOf(requestMap.get("categoryId")));

        Product product = new Product();
        if (isAdd){
            product.setId(Integer.valueOf(requestMap.get("id")));
        }else {
            product.setStatus("true");
        }
        product.setCategory(category);
        product.setName(requestMap.get("name"));
        product.setPrice(Integer.valueOf(requestMap.get("price")));
        product.setDescription(requestMap.get("description"));
        return product;
    }
    private boolean validateProductMap(Map<String,String> requestMap, boolean validateId) {
        if(requestMap.containsKey("name")){
            if(requestMap.containsKey("id") && validateId){
                return true;
            } else if (!validateId) {
                return true;
            }
        }
        return false;
    }
    @Override
    public ResponseEntity<List<ProductWrapper>> getAllProduct() {
        try {
            return new ResponseEntity<>(productDao.getAllProduct(),HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateProduct(Map<String, String> requestmap) {
        try {
            if(jwtFilter.isAdmin()){
                if(validateProductMap(requestmap,true)){
                    Optional<Product> optional = productDao.findById(Integer.valueOf(requestmap.get("id")));
                    if(!optional.isEmpty()){
                        Product product = getProductFromMap(requestmap,true);
                        product.setStatus(optional.get().getStatus());
                        productDao.save(product);
                        return CafeUtils.getResponseEntity(("Product Updated Successfully."),HttpStatus.OK);
                    }else {
                        return CafeUtils.getResponseEntity("Product data does not exist.", HttpStatus.OK);
                    }
                }else {
                    return CafeUtils.getResponseEntity(CafeConstant.INVALID_DATA,HttpStatus.BAD_REQUEST);
                }
            }else {
                return CafeUtils.getResponseEntity(CafeConstant.UNAUTHORIZED_ACCESS,HttpStatus.UNAUTHORIZED);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstant.SOMETHING_WENT_WRONG,HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
