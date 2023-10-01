package com.inn.cafe.serviceImpl;

import com.inn.cafe.JWT.JwtFilter;
import com.inn.cafe.POJO.Bill;
import com.inn.cafe.constants.CafeConstant;
import com.inn.cafe.dao.BillDao;
import com.inn.cafe.service.BillService;
import com.inn.cafe.utils.CafeUtils;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.io.IOUtils;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;


@Slf4j
@Service
public class BillServiceImpl implements BillService {
    @Autowired
    JwtFilter jwtFilter;
    @Autowired
    BillDao billDao;
    @Override
    public ResponseEntity<String> generateReport(Map<String, Object> requestMap) {
        log.info("Inside GenerateReport");
        try {
            String filename;
            if(validateRequestMap(requestMap)){
                if (requestMap.containsKey("isGenerate") && !(Boolean) requestMap.get("isGenerate")){
                    filename = (String) requestMap.get("uuid");
                }else {
                    filename = CafeUtils.getUUID();
                    requestMap.put("uuid", filename);
                    insertBill(requestMap);
                }
                String data = "Name: " + requestMap.get("name") + "\n" + "ContactNumber: " + requestMap.get("contactNumber")
                        + "\n" + "Email: " + requestMap.get("email") + "\n" + "Payment Method: " + requestMap.get("paymentMethod");
                Document document = new Document();
                PdfWriter.getInstance(document,new FileOutputStream(CafeConstant.STORE_LOCATION + "\\" +filename + ".pdf"));

                document.open();
                setRectangleInPdf(document);

                Paragraph elements = new Paragraph("Cafe Management System", getFont("Header"));
                elements.setAlignment(Element.ALIGN_CENTER);
                document.add(elements);

                Paragraph paragraph = new Paragraph(data + "\n \n", getFont("Data"));
                document.add(paragraph);

                PdfPTable table = new PdfPTable(5);
                table.setWidthPercentage(100);
                addTableHeader(table);

                JSONArray jsonArray = CafeUtils.getJsonArrayFromString((String) requestMap.get("productDetails"));
                for (int i=0; i < jsonArray.length(); i++){
                    addRows(table,CafeUtils.getMapFromJson(jsonArray.getString(i)));
                }
                document.add(table);

                Paragraph footer = new Paragraph("Total: " + requestMap.get("totalAmount")+ "\n"
                +"Thank you for visit. Please visit again!!", getFont("Data"));
                document.add(footer);
                document.close();
                return new ResponseEntity<>("{\"uuid\":\""+filename+"\"}",HttpStatus.OK);
            }
            return CafeUtils.getResponseEntity("Required data not found." , HttpStatus.BAD_REQUEST);
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstant.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    private void addRows(PdfPTable table, Map<String, Object> data) {
        log.info("Inside addRows");
        table.addCell((String) data.get("name"));
        table.addCell((String)data.get("category"));
        table.addCell((String) data.get("quantity"));
        table.addCell(Double.toString((Double) data.get("price")));
        table.addCell(Double.toString((Double) data.get("total")));
    }

    private void addTableHeader(PdfPTable table){
        log.info("Inside addTabHeader");
        Stream.of("Name","Category","Quantity","Price","Sub Total")
                .forEach(columTitle -> {
                    PdfPCell pdfPCell = new PdfPCell();
                    pdfPCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    pdfPCell.setBorderWidth(2);
                    pdfPCell.setPhrase(new Phrase(columTitle));
                    pdfPCell.setBackgroundColor(BaseColor.YELLOW);
                    pdfPCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    pdfPCell.setVerticalAlignment(Element.ALIGN_CENTER);
                    table.addCell(pdfPCell);
                });
    }
    private Font getFont(String type) {
        log.info("Inside getFont");
        switch (type){
            case "Header":
                Font hearderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLDOBLIQUE,18,BaseColor.BLACK);
                hearderFont.setStyle(Font.BOLD);
                return hearderFont;
            case "Data":
                Font dataFont = FontFactory.getFont(FontFactory.TIMES_ROMAN,11,BaseColor.BLACK);
                dataFont.setStyle(Font.BOLD);
                return dataFont;
            default:
                return new Font();
        }
    }
    private void setRectangleInPdf(Document document) throws DocumentException {
        log.info("Inside setRectangleInPdf");
        Rectangle rectangle = new Rectangle(577,825, 18, 15);
        rectangle.enableBorderSide(1);
        rectangle.enableBorderSide(2);
        rectangle.enableBorderSide(4);
        rectangle.enableBorderSide(8);
        rectangle.setBorderColor(BaseColor.BLACK);
        rectangle.setBorderWidth(1);
        document.add(rectangle);
    }
    private void insertBill(Map<String, Object> requestMap) {
        try {
            Bill bill = new Bill();
            bill.setUuid((String) requestMap.get("uuid"));
            bill.setName((String) requestMap.get("name"));
            bill.setEmail((String) requestMap.get("email"));
            bill.setContactNumber((String) requestMap.get("contactNumber"));
            bill.setPaymentMethod((String) requestMap.get("paymentMethod"));
            bill.setProductDetail((String) requestMap.get("productDetails"));
            bill.setTotal(Integer.parseInt((String)requestMap.get("totalAmount")));
            bill.setCreateBy(jwtFilter.getCurrentUser());
            billDao.save(bill);
        }catch (Exception e){
            e.printStackTrace();
        }
    }
    private boolean validateRequestMap(Map<String, Object> requestMap) {
        return requestMap.containsKey("name") &&
                requestMap.containsKey("contactNumber") &&
                requestMap.containsKey("email") &&
                requestMap.containsKey("paymentMethod") &&
                requestMap.containsKey("productDetails") &&
                requestMap.containsKey("totalAmount");
    }
    @Override
    public ResponseEntity<List<Bill>> getBills() {
        List<Bill> list = new ArrayList<>();
        if (jwtFilter.isAdmin()){
            list = billDao.getAllBills();
        }else  {
            list = billDao.getBillByUserName(jwtFilter.getCurrentUser());
        }
        return new ResponseEntity<>(list,HttpStatus.OK);
    }

    @Override
    public ResponseEntity<byte[]> getPdf(Map<String, Object> requestMap) {
        log.info("Inside getPdf: requestMap {}", requestMap);
        try {
            byte[] byteArray = new byte[0];
            if (!requestMap.containsKey("uuid") && validateRequestMap(requestMap))
                return new ResponseEntity<>(byteArray,HttpStatus.BAD_REQUEST);
            String filePath = CafeConstant.STORE_LOCATION + "\\" + (String) requestMap.get("uuid") + ".pdf";
            if (CafeUtils.isFileExist(filePath)){
                byteArray = getByteArray(filePath);
                return new ResponseEntity<>(byteArray,HttpStatus.OK);
            }else {
                requestMap.put("isGenerate",false);
                generateReport(requestMap);
                byteArray = getByteArray(filePath);
                return new ResponseEntity<>(byteArray,HttpStatus.OK);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    private byte[] getByteArray(String filePath) throws Exception {
        File initialFile = new File(filePath);
        InputStream inputStream = new FileInputStream(initialFile);
        byte[] byteArray = IOUtils.toByteArray(inputStream);
        inputStream.close();
        return byteArray;
    }

    @Override
    public ResponseEntity<String> deleteBill(Integer id) {
        try {
                Optional optional = billDao.findById(id);
                if(!optional.isEmpty()){
                    billDao.deleteById(id);
                    return CafeUtils.getResponseEntity("Bill deleted successfully.",HttpStatus.OK);
                }else {
                    return CafeUtils.getResponseEntity("Bill id not Exist.",HttpStatus.OK);
                }
        }catch (Exception e){
            e.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstant.SOMETHING_WENT_WRONG,HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
